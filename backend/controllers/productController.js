const Product = require("../models/Product");


// ================================
// GET ALL PRODUCTS
// ================================

const getProducts = async (req, res) => {
    try {

        const products = await Product.find();

        res.json(products);

    } catch (error) {

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }
};


// ================================
// GET SINGLE PRODUCT
// ================================

const getProductById = async (req, res) => {
    try {

        const product = await Product.findById(
            req.params.id
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json(product);

    } catch (error) {

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }
};


// ================================
// CREATE PRODUCT
// ================================

const createProduct = async (req, res) => {
    try {

        const {
            name,
            description,
            price,
            category,
            image,
            stock
        } = req.body;


        // Check required fields

        if (
            !name ||
            !description ||
            price === undefined ||
            !category
        ) {
            return res.status(400).json({
                message: "Please provide name, description, price and category"
            });
        }


        // Create product

        const product = await Product.create({
            name,
            description,
            price,
            category,
            image,
            stock
        });


        res.status(201).json({
            message: "Product created successfully",
            product
        });

    } catch (error) {

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }
};


//update Product

const updateProduct = async (req,res) =>
{
    try
    {
        const
        {
            name,
            description,
            price,
            category,
            image,
            stock
        }=req.body


        const product = await Product.findById(req.params.id)

        if(!product)
        {
            return res.status(404).json({
                message:"Product not found"
            })
        }

        product.name = name;
        product.description = description;
        product.price = price;
        product.category = category;
        product.image = image;
        product.stock = stock;

        //save updated product

        const updatedProduct = await product.save();

        res.json({
            message:"Product updated successfully",
            product:updatedProduct
        })
    }catch(error)
    {
        console.log(error);
        res.status(500).json({
            message:"server error"
        })
    }
}

//delete Product

const deleteProduct = async (req,res) =>
{
    try
    {
         const product = await Product.findByIdAndDelete(
            req.params.id
        );

        if(!product)
        {
            return res.status(404).json({
                message:"Product not found"
            })
        }
        res.json({
            message:"Product deleted Succesfully"
        })

    }catch(error)
    {
        res.status(404).json({
            message:"Something went wrong"
        })
    }
}

















module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct

};