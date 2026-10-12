const express = require("express");

const {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus
} = require("../controllers/orderController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();


// ==========================================
// CUSTOMER ROUTES
// ==========================================

// Place a new order
router.post(
    "/",
    authMiddleware,
    createOrder
);


// Get logged-in user's orders
router.get(
    "/my-orders",
    authMiddleware,
    getMyOrders
);


// ==========================================
// ADMIN ROUTES
// ==========================================

// Get all orders
router.get(
    "/admin",
    authMiddleware,
    adminMiddleware,
    getAllOrders
);


// Update order status
router.put(
    "/admin/:id/status",
    authMiddleware,
    adminMiddleware,
    updateOrderStatus
);


module.exports = router;