// ==========================================
// IMPORTS
// ==========================================

const express = require("express");

const {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
} = require("../controllers/cartController");

const authMiddleware = require("../middleware/authMiddleware");


// ==========================================
// ROUTER
// ==========================================

const router = express.Router();


// ==========================================
// PROTECT ALL CART ROUTES
// ==========================================

router.use(authMiddleware);


// ==========================================
// GET USER CART
// ==========================================

router.get(
    "/",
    getCart
);


// ==========================================
// ADD PRODUCT TO CART
// ==========================================

router.post(
    "/",
    addToCart
);


// ==========================================
// UPDATE PRODUCT QUANTITY
// ==========================================

router.put(
    "/:productId",
    updateCartItem
);


// ==========================================
// REMOVE PRODUCT FROM CART
// ==========================================

router.delete(
    "/:productId",
    removeFromCart
);


// ==========================================
// CLEAR CART
// ==========================================

router.delete(
    "/",
    clearCart
);


// ==========================================
// EXPORT ROUTER
// ==========================================

module.exports = router;