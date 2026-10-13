// ==========================================
// IMPORTS
// ==========================================

const express = require("express");

const {
    getProductReviews,
    addProductReview
} = require("../controllers/reviewController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Anyone can view reviews.
router.get("/:productId", getProductReviews);

// Only logged-in users can add or update reviews.
router.post("/:productId", authMiddleware, addProductReview);

module.exports = router;