import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

import api from "../services/api";

import "../styles/Checkout.css";


function Checkout() {

    // ==========================================
    // GET AUTH AND CART DATA
    // ==========================================

    const { user } = useAuth();

    const {
        cartItems,
        dispatch
    } = useCart();

    const navigate = useNavigate();


    // ==========================================
    // FORM STATE
    // ==========================================

    const [formData, setFormData] = useState({
        customerName: user?.name || "",
        phone: "",
        shippingAddress: "",
        city: "",
        paymentMethod: "COD"
    });


    // ==========================================
    // OTHER STATE
    // ==========================================

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");


    // ==========================================
    // CALCULATE TOTAL
    // ==========================================

    const totalAmount = cartItems.reduce(
        (total, item) => {
            return total + item.price * item.quantity;
        },
        0
    );


    // ==========================================
    // HANDLE INPUT CHANGE
    // ==========================================

    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value
        });

    };


    // ==========================================
    // PLACE ORDER
    // ==========================================

    const handlePlaceOrder = async (event) => {

        event.preventDefault();

        setError("");


        // Check cart
        if (cartItems.length === 0) {

            setError("Your cart is empty.");

            return;

        }


        try {

            setLoading(true);


            // ==========================================
            // SEND ORDER TO BACKEND
            // ==========================================

            const response = await api.post(
                "/orders",
                formData
            );


            // ==========================================
            // CLEAR FRONTEND CART
            // ==========================================

            dispatch({
                type: "CLEAR_CART"
            });


            // ==========================================
            // GO TO SUCCESS PAGE
            // ==========================================

            navigate(
                `/order-success/${response.data.order._id}`
            );

        }

        catch (error) {

            console.error(
                "PLACE ORDER ERROR:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Unable to place order."
            );

        }

        finally {

            setLoading(false);

        }

    };


    // ==========================================
    // EMPTY CART
    // ==========================================

    if (cartItems.length === 0) {

        return (

            <>
                <Navbar />

                <div className="checkout-empty">

                    <h2>
                        Your cart is empty
                    </h2>

                    <p>
                        Add some products before checking out.
                    </p>

                    <button
                        onClick={() => navigate("/products")}
                    >
                        Continue Shopping
                    </button>

                </div>

            </>

        );

    }


    // ==========================================
    // RETURN
    // ==========================================

    return (

        <>

            <Navbar />


            <div className="checkout-page">


                {/* ==========================================
                    PAGE HEADER
                ========================================== */}

                <div className="checkout-header">

                    <p>
                        CHECKOUT
                    </p>

                    <h1>
                        Complete Your Order
                    </h1>

                    <span>
                        Enter your delivery information below.
                    </span>

                </div>


                <div className="checkout-container">


                    {/* ==========================================
                        CUSTOMER FORM
                    ========================================== */}

                    <div className="checkout-form-section">

                        <h2>
                            Delivery Information
                        </h2>


                        <form onSubmit={handlePlaceOrder}>


                            {/* NAME */}

                            <div className="form-group">

                                <label>
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    name="customerName"
                                    value={formData.customerName}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    required
                                />

                            </div>


                            {/* PHONE */}

                            <div className="form-group">

                                <label>
                                    Phone Number
                                </label>

                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="03XXXXXXXXX"
                                    required
                                />

                            </div>


                            {/* ADDRESS */}

                            <div className="form-group">

                                <label>
                                    Shipping Address
                                </label>

                                <textarea
                                    name="shippingAddress"
                                    value={formData.shippingAddress}
                                    onChange={handleChange}
                                    placeholder="House number, street, area..."
                                    rows="4"
                                    required
                                />

                            </div>


                            {/* CITY */}

                            <div className="form-group">

                                <label>
                                    City
                                </label>

                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="Enter your city"
                                    required
                                />

                            </div>


                            {/* PAYMENT */}

                            <div className="form-group">

                                <label>
                                    Payment Method
                                </label>

                                <div className="payment-option">

                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="COD"
                                        checked={
                                            formData.paymentMethod === "COD"
                                        }
                                        onChange={handleChange}
                                    />

                                    <span>
                                        Cash on Delivery
                                    </span>

                                </div>

                            </div>


                            {/* ERROR */}

                            {error && (

                                <div className="checkout-error">
                                    {error}
                                </div>

                            )}


                            {/* PLACE ORDER */}

                            <button
                                type="submit"
                                className="place-order-button"
                                disabled={loading}
                            >

                                {loading
                                    ? "Placing Order..."
                                    : "Place Order"
                                }

                            </button>


                        </form>

                    </div>


                    {/* ==========================================
                        ORDER SUMMARY
                    ========================================== */}

                    <div className="checkout-summary">

                        <h2>
                            Order Summary
                        </h2>


                        {/* PRODUCTS */}

                        <div className="summary-items">

                            {cartItems.map((item) => (

                                <div
                                    className="summary-item"
                                    key={item._id}
                                >

                                    <div>

                                        <h4>
                                            {item.name}
                                        </h4>

                                        <p>
                                            Qty: {item.quantity}
                                        </p>

                                    </div>


                                    <span>
                                        Rs. {item.price * item.quantity}
                                    </span>

                                </div>

                            ))}

                        </div>


                        {/* TOTAL */}

                        <div className="summary-total">

                            <span>
                                Total
                            </span>

                            <strong>
                                Rs. {totalAmount}
                            </strong>

                        </div>


                        <p className="cod-note">
                            Payment will be collected when
                            your order is delivered.
                        </p>

                    </div>


                </div>

            </div>

        </>

    );

}


export default Checkout;