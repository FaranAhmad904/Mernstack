// ==========================================
// IMPORTS
// ==========================================

const express = require("express");

const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");


// ==========================================
// ROUTER
// ==========================================

const router = express.Router();


// ==========================================
// PUBLIC ROUTES
// ==========================================

// Anyone can view products
router.get("/", getProducts);

router.get("/:id", getProductById);


// ==========================================
// ADMIN ROUTES
// ==========================================

// Create product
router.post(
    "/",
    authMiddleware,
    adminMiddleware,
    createProduct
);


// Update product
router.put(
    "/:id",
    authMiddleware,
    adminMiddleware,
    updateProduct
);


// Delete product
router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    deleteProduct
);


module.exports = router;