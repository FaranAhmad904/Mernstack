const Cart = require("../models/Cart");


const getCart = async (req,res) =>
{
    try{
        let cart = await Cart.findOne({
            user:req.user.userId
        }).populate("items.product")

        if(!cart)
        {
            cart = await Cart.create({
                user:req.user.userId,
                items:[]
            })
        }

        cart = await Cart.findById(cart._id).populate("items.product")

        res.json(cart);
    }catch(error)
    {
        console.log("Error",error)

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }
}

//add product to cart

const addToCart= async (req,res) =>
{
    try
    {
        const {productId,quantity} = req.body

        if(!productId)
        {
            return res.status(500).json({
                message:"Product not found"
            })
        }

        let cart = await Cart.findOne({
            user:req.user.userId
        });

        if(!cart)
        {
            cart = await Cart.create({
                user:req.user.userId,
                items:[
                    {
                        product:productId,
                        quantity:quantity || 1
                    }
                ]
            })
        }
        else
        {

            const existingItem = cart.items.find(
                (item)=> item.product.toString() === productId
            )

            if(existingItem)
            {
                existingItem.quantity +=
                    quantity || 1;
            }
            else {

                // Add new product
                cart.items.push({
                    product: productId,
                    quantity: quantity || 1
                });
            }

            await cart.save();
        }

        cart = await Cart.findById(cart._id).populate("items.product");
        res.status(200).json({
            message:"Product added to cart",
            cart
        })

    }catch(error)
    {
        console.error(
            "ADD TO CART ERROR:",
            error
        );

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
}

//update Cart item quantity

const updateCartItem = async (req,res) =>
{
    try
    {
        const {quantity}= req.body;

        const{productId} = req.params;

        if(!quantity || quantity<1)
        {
            return res.status(400).json({
                message:"Quantity must be greater than or at least 1"
            })
        }

        const cart = await Cart.findOne({
            user:req.user.userId
        })

        if(!cart)
        {
            return res.status(400).json({
                message:"Cart not found"
            })
        }

        const item = cart.items.find((item)=>item.product.toString() === productId)

        if(!item)
        {
            return res.status(404).json({
                message:"Product not found in cart"
            })
        }

        item.quantity = quantity
        
        await cart.save();

        const updatedCart = await Cart.findById(cart._id).populate("items.product");

        res.json({
            message:"Cart updated successfulyy",
            cart:updatedCart
        })
    }catch(error)
    {
         console.error(
            "UPDATE CART ERROR:",
            error
        );

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
}

//removeProduct

const removeFromCart = async (req,res)=>
{
    try
    {
        const{productId} = req.params;

        const cart = await Cart.findOne({
            user:req.user.userId
        })

        if(!cart)
        {
            return res.status(404).json({
                message:"Cart not found"
            })
        }

        cart.items = cart.items.filter(
            (item)=>item.product.toString()!== productId
        )

        await cart.save();

        const updatedCart = await Cart.findById(cart._id).populate("items.product");

        res.json({
            message: "Product removed from cart",
            cart: updatedCart
        })
    }catch(error)
    {
         console.error(
            "REMOVE FROM CART ERROR:",
            error
        );

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }
}
const clearCart = async (req, res) => {

    try {

        const cart = await Cart.findOne({
            user: req.user.userId
        });

        if (!cart) {

            return res.status(404).json({
                message: "Cart not found"
            });
        }

        cart.items = [];

        await cart.save();

        res.json({
            message: "Cart cleared successfully",
            cart
        });

    } catch (error) {

        console.error(
            "CLEAR CART ERROR:",
            error
        );

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// ==========================================
// EXPORT CONTROLLERS
// ==========================================

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
};