const mongoose = require("mongoose");
const Review = require("../models/Review");
const Product = require("../models/Product");


const getProductReviews = async (req,res) =>
{
    try{

        const {productId} = req.params;

        if(!mongoose.isValidObjectId(productId))
        {
            return res.status(400).json({
                message:"Invalid producct id"
            })
        }

        const productExists = await Product.exists({
            _id:productId
        })


        if(!productExists)
        {
            return res.status(404).json({
                message:"Product not found"
            })
        }

        const reviews = await Review.find({
            product: productId
        }).sort({createdAt: -1});

        const totalReviews = reviews.length;

         const averageRating = totalReviews
            ? reviews.reduce(
                (total, review) => total + review.rating,
                0
            ) / totalReviews
            : 0;

        // Count reviews for each star rating.
        const ratingBreakdown = {
            5: 0,
            4: 0,
            3: 0,
            2: 0,
            1: 0
        };

        reviews.forEach((review) => {
            ratingBreakdown[review.rating]++;
        });

        res.json({
            reviews,
            totalReviews,
            averageRating: Number(averageRating.toFixed(1)),
            ratingBreakdown
        });
    
    }catch(error)
    {
        console.error("Get reviews error",error);
        res.status(500).json({
            
            message: "Failed to load reviews"
        })
    }
    
}

//add or update

const addProductReview = async (req,res)=>
{
    try
    {
        const {productId} = req.params;
        const {rating,comment} = req.body;

        if(!mongoose.isValidObjectId(productId))
        {
            return res.status(400).json({
                message:"Invalid Product id"
            })
        }

         const userId =
            req.user?.id ||
            req.user?.userId ||
            req.user?._id;

        if (!userId) {
            return res.status(401).json({
                message: "Unable to identify logged-in user"
            });
        }

        const productExists = await Product.exists({
            _id: productId
        })

        if(!productExists)
        {
            return res.status(404).json({
                message:"Invalid prodcuct id"
            })
        }

         const numericRating = Number(rating);
        const cleanComment =
            typeof comment === "string"
                ? comment.trim()
                : "";

        if (
            !Number.isInteger(numericRating) ||
            numericRating < 1 ||
            numericRating > 5
        ) {
            return res.status(400).json({
                message: "Please select a rating from 1 to 5"
            });
        }

        if (
            cleanComment.length < 3 ||
            cleanComment.length > 1000
        ) {
            return res.status(400).json({
                message: "Review must contain 3 to 1000 characters"
            });
        }

        const userName =
            req.user?.name ||
            req.user?.username ||
            req.user?.email ||
            "ShopHub Customer";

        const review = await Review.findOneAndUpdate(
            {
                product:productId,
                userId: String(userId)
            },
            {
                $set:
                {
                     userName,
                    rating: numericRating,
                    comment: cleanComment

                },
                 $setOnInsert: {
                    product: productId,
                    userId: String(userId)
                }
            },
             {
                new: true,
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true
            }
        );
        res.status(200).json({
            message:"Your reveiw has been saved",
            review
        });
    } catch (error) {
        console.error("SAVE REVIEW ERROR:", error);

        // Handles a rare simultaneous duplicate submission.
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Your review is already being saved. Please refresh."
            });
        }

        res.status(500).json({
            message: "Failed to save review"
        });
    }
}


module.exports = {
    getProductReviews,
    addProductReview
};