// ==========================================
// IMPORT MONGOOSE
// ==========================================

const mongoose = require("mongoose");

// ==========================================
// REVIEW SCHEMA
// ==========================================

const reviewSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
            index: true
        },

        userId: {
            type: String,
            required: true
        },

        userName: {
            type: String,
            required: true,
            trim: true
        },

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
            validate: {
                validator: Number.isInteger,
                message: "Rating must be a whole number"
            }
        },

        comment: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 1000
        }
    },
    {
        timestamps: true
    }
);

// One review per user for each product.
// A second submission updates the existing review.
reviewSchema.index(
    { product: 1, userId: 1 },
    { unique: true }
);

// ==========================================
// EXPORT MODEL
// ==========================================

module.exports = mongoose.model("Review", reviewSchema);