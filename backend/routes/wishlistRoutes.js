
// ==========================================
// IMPORTS
// ==========================================

const express = require("express");
const mongoose = require("mongoose");

const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// CHECK WISHLIST MODEL
// ==========================================

if (typeof Wishlist.findOne !== "function")
{
    throw new Error(
        "Wishlist model is not loaded correctly. Check models/Wishlist.js"
    );
}


// ==========================================
// PROTECT ALL WISHLIST ROUTES
// ==========================================

router.use(authMiddleware);


// ==========================================
// GET USER WISHLIST
// ==========================================

router.get("/", async (req, res) =>
{
    try
    {
        const userId = req.user.id;

        let wishlist = await Wishlist.findOne({
            user: userId
        }).populate("products");

        if (!wishlist)
        {
            wishlist = await Wishlist.create({
                user: userId,
                products: []
            });
        }

        return res.status(200).json({
            products: wishlist.products
        });
    }
    catch (error)
    {
        console.error("GET WISHLIST ERROR:", error);

        return res.status(500).json({
            message: "Failed to load wishlist."
        });
    }
});


// ==========================================
// ADD PRODUCT TO WISHLIST
// ==========================================

router.post("/:productId", async (req, res) =>
{
    try
    {
        const userId = req.user.id;
        const productId = req.params.productId;


        // ==========================================
        // VALIDATE PRODUCT ID
        // ==========================================

        if (!mongoose.Types.ObjectId.isValid(productId))
        {
            return res.status(400).json({
                message: "Invalid product ID."
            });
        }


        // ==========================================
        // FIND PRODUCT
        // ==========================================

        const product = await Product.findById(productId);

        if (!product)
        {
            return res.status(404).json({
                message: "Product not found."
            });
        }


        // ==========================================
        // FIND OR CREATE WISHLIST
        // ==========================================

        let wishlist = await Wishlist.findOne({
            user: userId
        });

        if (!wishlist)
        {
            wishlist = new Wishlist({
                user: userId,
                products: []
            });
        }


        // ==========================================
        // CHECK DUPLICATE PRODUCT
        // ==========================================

        const alreadyExists = wishlist.products.some(
            (id) => id.toString() === productId
        );

        if (alreadyExists)
        {
            await wishlist.populate("products");

            return res.status(200).json({
                message: "Product is already in your wishlist.",
                products: wishlist.products
            });
        }


        // ==========================================
        // ADD PRODUCT
        // ==========================================

        wishlist.products.push(product._id);

        await wishlist.save();
        await wishlist.populate("products");


        // ==========================================
        // SEND RESPONSE
        // ==========================================

        return res.status(200).json({
            message: "Product added to wishlist.",
            products: wishlist.products
        });
    }
    catch (error)
    {
        console.error("ADD WISHLIST ERROR:", error);

        return res.status(500).json({
            message: "Failed to add product to wishlist."
        });
    }
});


// ==========================================
// REMOVE PRODUCT FROM WISHLIST
// ==========================================

router.delete("/:productId", async (req, res) =>
{
    try
    {
        const userId = req.user.id;
        const productId = req.params.productId;


        // ==========================================
        // VALIDATE PRODUCT ID
        // ==========================================

        if (!mongoose.Types.ObjectId.isValid(productId))
        {
            return res.status(400).json({
                message: "Invalid product ID."
            });
        }


        // ==========================================
        // FIND WISHLIST
        // ==========================================

        const wishlist = await Wishlist.findOne({
            user: userId
        });

        if (!wishlist)
        {
            return res.status(404).json({
                message: "Wishlist not found."
            });
        }


        // ==========================================
        // REMOVE PRODUCT
        // ==========================================

        wishlist.products = wishlist.products.filter(
            (id) => id.toString() !== productId
        );

        await wishlist.save();
        await wishlist.populate("products");


        // ==========================================
        // SEND RESPONSE
        // ==========================================

        return res.status(200).json({
            message: "Product removed from wishlist.",
            products: wishlist.products
        });
    }
    catch (error)
    {
        console.error("REMOVE WISHLIST ERROR:", error);

        return res.status(500).json({
            message: "Failed to remove product from wishlist."
        });
    }
});


// ==========================================
// EXPORT ROUTER
// ==========================================

module.exports = router;
