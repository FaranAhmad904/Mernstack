const mongoose = require("mongoose");

// ==========================================
// ORDER ITEM SCHEMA
// ==========================================

const orderItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },

        // Save product name at the time of order
        name: {
            type: String,
            required: true
        },

        // Save product price at the time of order
        price: {
            type: Number,
            required: true,
            min: 0
        },

        quantity: {
            type: Number,
            required: true,
            min: 1
        }
    },
    {
        _id: false
    }
);


// ==========================================
// ORDER SCHEMA
// ==========================================

const orderSchema = new mongoose.Schema(
    {
        // User who placed the order
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        // Products inside the order
        items: {
            type: [orderItemSchema],
            required: true,

            validate: {
                validator: (items) => items.length > 0,
                message: "Order must contain at least one item"
            }
        },

        // Customer information
        customerName: {
            type: String,
            required: true,
            trim: true
        },

        phone: {
            type: String,
            required: true,
            trim: true
        },

        shippingAddress: {
            type: String,
            required: true,
            trim: true
        },

        city: {
            type: String,
            required: true,
            trim: true
        },

        // Currently we are using Cash on Delivery
        paymentMethod: {
            type: String,
            enum: ["COD"],
            default: "COD"
        },

        // Final order total
        totalAmount: {
            type: Number,
            required: true,
            min: 0
        },

        // Order status
        status: {
            type: String,
            enum: [
                "Pending",
                "Processing",
                "Shipped",
                "Delivered",
                "Cancelled"
            ],
            default: "Pending"
        }
    },
    {
        timestamps: true
    }
);


// ==========================================
// CREATE MODEL
// ==========================================

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;