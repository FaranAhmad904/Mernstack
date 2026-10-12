
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

//createorder


const createOrder = async(req,res)=>
{
    try
    {
        const {
            customerName,
            phone,
            shippingAddress,
            city,
            paymentMethod
        } = req.body;

         if (
            !customerName ||
            !phone ||
            !shippingAddress ||
            !city
        ) {
            return res.status(400).json({
                message: "Please provide all customer information"
            });
        }
         if (paymentMethod !== "COD") {
            return res.status(400).json({
                message: "Only Cash on Delivery is available"
            });
        }


        const cart = await Cart.findOne({
            user:req.user.userId
        }).populate("items.product");


         if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                message: "Your cart is empty"
            });
        }


        //check product and stock

        for(const item of cart.items)
        {
            if(!item)
            {
                return res.status(400).json({
                    message:"One of the products in your cart no longer exists"
                })
            }

               if (item.product.stock < item.quantity) {
                return res.status(400).json({
                    message:
                        `${item.product.name} does not have enough stock`
                });
            }
        }

        const orderItems = cart.items.map((item) => {

            return {
                product: item.product._id,

                // Save current product name
                name: item.product.name,

                // Save current product price
                price: item.product.price,

                // Save ordered quantity
                quantity: item.quantity
            };

        });

            let totalAmount = 0;


        cart.items.forEach((item) => {

            totalAmount +=
                item.product.price * item.quantity;

        });


        const order = await Order.create({

            user: req.user.userId,

            items: orderItems,

            customerName,

            phone,

            shippingAddress,

            city,

            paymentMethod: "COD",

            totalAmount,

            status: "Pending"

        });


         for (const item of cart.items) {

            item.product.stock =
                item.product.stock - item.quantity;

            await item.product.save();

        }


        // ==========================================
        // CLEAR CART
        // ==========================================

        cart.items = [];

        await cart.save();


        // ==========================================
        // SEND RESPONSE
        // ==========================================

        res.status(201).json({

            message: "Order placed successfully",

            order

        });

    }catch(error)
    {

        console.error("CREATE ORDER ERROR:", error);

        res.status(500).json({

            message: "Server error",

            error: error.message

        });
    }
}

//getmyorders

const getMyOrders = async (req,res)=>
{
    try
    {
        const orders = await Order.find({
            user: req.user.userId
        }).sort({createdAt: -1});

        res.json({
            orders
        })
    }catch(error)
    {
          console.error("GET MY ORDERS ERROR:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
}


//getallorders

const getAllOrders = async (req,res)=>
{
    try
    {
        const orders = await Order.find().populate("user","name email").sort({createdAt: -1})

        res.json({
            orders
        })
    }catch(error)
    {
        console.error("GET ALL ORDERS ERROR:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
}

//udpdateorderstatus

const updateOrderStatus = async(req,res)=>
{
    try
    {
        const {status} = req.body;

         const allowedStatuses = [
            "Pending",
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled"
        ];

         if (!allowedStatuses.includes(status)) {

            return res.status(400).json({
                message: "Invalid order status"
            });

        }

        const order = await Order.findById(req.params.id)

        if(!order)
        {
            return(
                res.status(404).json({
                    message:"order not found"
                })
            )
        }
        order.status = status;

        await order.save();

        res.json({
            message:"Order updated successfuly",
            order
        })
    } catch (error) {

        console.error("UPDATE ORDER STATUS ERROR:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }

}

module.exports = {

    createOrder,

    getMyOrders,

    getAllOrders,

    updateOrderStatus

};