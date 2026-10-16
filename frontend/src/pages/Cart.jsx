// ==========================================
// IMPORTS
// ==========================================

import { Link } from "react-router-dom";

import {
    ShoppingBag,
    ArrowRight,
    Trash2
} from "lucide-react";

import Navbar from "../components/Navbar";

import { useCart } from "../context/CartContext";

import "../styles/Cart.css";


// ==========================================
// CART PAGE
// ==========================================

function Cart() {

    // ==========================================
    // GET CART DATA FROM CART CONTEXT
    // ==========================================

    const {
        cartItems,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart
    } = useCart();


    // ==========================================
    // CALCULATE TOTAL
    // ==========================================

    const totalPrice = cartItems.reduce(
        (total, item) => {

            return total + (
                item.price * item.quantity
            );

        },
        0
    );


    // ==========================================
    // CALCULATE TOTAL QUANTITY
    // ==========================================

    const totalQuantity = cartItems.reduce(
        (total, item) => {

            return total + item.quantity;

        },
        0
    );


    // ==========================================
    // FORMAT PRICE
    // ==========================================

    const formatPrice = (price) => {

        return Number(price || 0).toLocaleString("en-PK");

    };


    // ==========================================
    // EMPTY CART
    // ==========================================

    if (cartItems.length === 0) {

        return (
            <>
                <Navbar />

                <div className="cart-page">

                    <div className="empty-cart">

                        <div className="empty-cart-icon">
                            <ShoppingBag size={38} />
                        </div>

                        <h1>
                            Your Cart is Empty
                        </h1>

                        <p>
                            You haven't added any
                            products to your cart yet.
                        </p>

                        <Link
                            to="/products"
                            className="continue-shopping-button"
                        >
                            Continue Shopping

                            <ArrowRight size={17} />
                        </Link>

                    </div>

                </div>
            </>
        );
    }


    // ==========================================
    // CART UI
    // ==========================================

    return (
        <>
            <Navbar />

            <div className="cart-page">

                {/* ==================================
                    BREADCRUMB
                ================================== */}

                <nav
                    className="cart-breadcrumb"
                    aria-label="Breadcrumb"
                >
                    <Link to="/">Home</Link>

                    <span>/</span>

                    <strong>Cart</strong>
                </nav>


                {/* ==================================
                    PAGE HEADER
                ================================== */}

                <div className="cart-header">

                    <div>
                        <h1>
                            Shopping Cart
                        </h1>

                        <p>
                            {cartItems.length}{" "}
                            {cartItems.length === 1
                                ? "product"
                                : "products"}{" "}
                            in your cart
                        </p>
                    </div>

                    <button
                        type="button"
                        className="clear-cart-button"
                        onClick={clearCart}
                    >
                        <Trash2 size={15} />

                        Clear Cart
                    </button>

                </div>


                {/* ==================================
                    CART CONTENT
                ================================== */}

                <div className="cart-container">

                    {/* ==================================
                        CART ITEMS
                    ================================== */}

                    <div className="cart-items">

                        {cartItems.map((item) => (

                            <div
                                className="cart-item"
                                key={item._id}
                            >

                                {/* ==================================
                                    PRODUCT IMAGE
                                ================================== */}

                                <div className="cart-item-image">

                                    {item.image ? (

                                        <img
                                            src={item.image}
                                            alt={item.name}
                                        />

                                    ) : (

                                        <span>
                                            No Image
                                        </span>

                                    )}

                                </div>


                                {/* ==================================
                                    PRODUCT INFORMATION
                                ================================== */}

                                <div className="cart-item-info">

                                    <p className="cart-item-category">
                                        {item.category}
                                    </p>

                                    <h2>
                                        {item.name}
                                    </h2>

                                    <p className="cart-item-price">
                                        Rs. {formatPrice(item.price)}
                                    </p>

                                </div>


                                {/* ==================================
                                    QUANTITY CONTROLS
                                ================================== */}

                                <div className="quantity-section">

                                    <span>
                                        Quantity
                                    </span>

                                    <div className="quantity-controls">

                                        <button
                                            type="button"
                                            aria-label="Decrease quantity"
                                            onClick={() =>
                                                decreaseQuantity(
                                                    item._id
                                                )
                                            }
                                        >
                                            −
                                        </button>

                                        <strong>
                                            {item.quantity}
                                        </strong>

                                        <button
                                            type="button"
                                            aria-label="Increase quantity"
                                            onClick={() =>
                                                increaseQuantity(
                                                    item._id
                                                )
                                            }
                                        >
                                            +
                                        </button>

                                    </div>

                                </div>


                                {/* ==================================
                                    ITEM TOTAL
                                ================================== */}

                                <div className="cart-item-total">

                                    <span>
                                        Item Total
                                    </span>

                                    <strong>
                                        Rs.{" "}
                                        {formatPrice(
                                            item.price *
                                            item.quantity
                                        )}
                                    </strong>

                                </div>


                                {/* ==================================
                                    REMOVE BUTTON
                                ================================== */}

                                <button
                                    type="button"
                                    className="remove-cart-item"
                                    onClick={() =>
                                        removeFromCart(
                                            item._id
                                        )
                                    }
                                >
                                    Remove
                                </button>

                            </div>

                        ))}

                    </div>


                    {/* ==================================
                        CART SUMMARY
                    ================================== */}

                    <div className="cart-summary">

                        <h2>
                            Order Summary
                        </h2>

                        <div className="summary-row">

                            <span>
                                Products
                            </span>

                            <span>
                                {totalQuantity}
                            </span>

                        </div>

                        <div className="summary-row">

                            <span>
                                Subtotal
                            </span>

                            <span>
                                Rs. {formatPrice(totalPrice)}
                            </span>

                        </div>

                        <div className="summary-divider"></div>

                        <div className="summary-total">

                            <span>
                                Total
                            </span>

                            <strong>
                                Rs. {formatPrice(totalPrice)}
                            </strong>

                        </div>


                        {/* ==================================
                            CHECKOUT
                        ================================== */}

                        <Link
                            to="/checkout"
                            className="checkout-button"
                        >
                            Checkout

                            <ArrowRight size={17} />
                        </Link>


                        <Link
                            to="/products"
                            className="continue-shopping-link"
                        >
                            ← Continue Shopping
                        </Link>

                    </div>

                </div>

            </div>
        </>
    );
}

export default Cart;