// ==========================================
// IMPORTS
// ==========================================

import { Link } from "react-router-dom";

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
    // EMPTY CART
    // ==========================================

    if (cartItems.length === 0) {

        return (
            <>
                <Navbar />

                <div className="cart-page">

                    <div className="empty-cart">

                        <div className="empty-cart-icon">
                            🛒
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
                        className="clear-cart-button"
                        onClick={clearCart}
                    >
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
                                        Rs. {item.price}
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
                                        {item.price *
                                            item.quantity}
                                    </strong>

                                </div>


                                {/* ==================================
                                    REMOVE BUTTON
                                ================================== */}

                                <button
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
                                {cartItems.reduce(
                                    (total, item) =>
                                        total +
                                        item.quantity,
                                    0
                                )}
                            </span>

                        </div>

                        <div className="summary-row">

                            <span>
                                Subtotal
                            </span>

                            <span>
                                Rs. {totalPrice}
                            </span>

                        </div>

                        <div className="summary-divider"></div>

                        <div className="summary-total">

                            <span>
                                Total
                            </span>

                            <strong>
                                Rs. {totalPrice}
                            </strong>

                        </div>


                        {/* ==================================
                            CHECKOUT FOR LATER
                        ================================== */}

                       <Link
    to="/checkout"
    className="checkout-button"
>
    Checkout
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