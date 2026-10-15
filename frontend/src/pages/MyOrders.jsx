
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";

import api from "../services/api";

import "../styles/MyOrders.css";


function MyOrders()
{
    // ==========================================
    // STATES
    // ==========================================

    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // ==========================================
    // FORMAT PRICE
    // ==========================================

    const formatPrice = (price) =>
    {
        return new Intl.NumberFormat("en-PK", {
            style: "currency",
            currency: "PKR",
            maximumFractionDigits: 0
        }).format(price || 0);
    };


    // ==========================================
    // FORMAT DATE
    // ==========================================

    const formatDate = (date) =>
    {
        return new Date(date).toLocaleDateString("en-PK", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    };


    // ==========================================
    // FETCH CUSTOMER ORDERS
    // ==========================================

    const fetchOrders = async () =>
    {
        try
        {
            setLoading(true);

            setError("");

            const response = await api.get(
                "/orders/my-orders"
            );

            setOrders(response.data.orders || []);
        }
        catch (error)
        {
            console.error(
                "FETCH MY ORDERS ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to load your orders. Please try again."
            );
        }
        finally
        {
            setLoading(false);
        }
    };


    // ==========================================
    // LOAD ORDERS WHEN PAGE OPENS
    // ==========================================

    useEffect(() =>
    {
        fetchOrders();
    }, []);


    // ==========================================
    // GET STATUS CLASS
    // ==========================================

    const getStatusClass = (status) =>
    {
        switch (status)
        {
            case "Pending":
                return "status-pending";

            case "Processing":
                return "status-processing";

            case "Shipped":
                return "status-shipped";

            case "Delivered":
                return "status-delivered";

            case "Cancelled":
                return "status-cancelled";

            default:
                return "status-pending";
        }
    };


    // ==========================================
    // LOADING STATE
    // ==========================================

    if (loading)
    {
        return (
            <>
                <Navbar />

                <div className="my-orders-page">
                    <div className="orders-loading">
                        <div className="orders-spinner"></div>

                        <h2>
                            Loading your orders
                        </h2>

                        <p>
                            Please wait while we retrieve your order history.
                        </p>
                    </div>
                </div>
            </>
        );
    }


    // ==========================================
    // MAIN PAGE
    // ==========================================

    return (
        <>
            <Navbar />

            <main className="my-orders-page">

                <div className="my-orders-container">

                    {/* ==========================================
                        PAGE HEADER
                    ========================================== */}

                    <div className="my-orders-header">

                        <div>
                            <span className="orders-eyebrow">
                                YOUR ACCOUNT
                            </span>

                            <h1>
                                My Orders
                            </h1>

                            <p>
                                Track your purchases and view your order details.
                            </p>
                        </div>

                        <Link
                            to="/products"
                            className="orders-shop-button"
                        >
                            Continue Shopping
                        </Link>

                    </div>


                    {/* ==========================================
                        ORDER SUMMARY
                    ========================================== */}

                    {!error && orders.length > 0 && (

                        <div className="orders-summary-card">

                            <div className="orders-summary-icon">
                                📦
                            </div>

                            <div>
                                <span>
                                    Total Orders
                                </span>

                                <strong>
                                    {orders.length}
                                </strong>
                            </div>

                            <div className="orders-summary-divider"></div>

                            <div>
                                <span>
                                    Total Items Ordered
                                </span>

                                <strong>
                                    {orders.reduce(
                                        (total, order) =>
                                            total +
                                            order.items.reduce(
                                                (itemTotal, item) =>
                                                    itemTotal + item.quantity,
                                                0
                                            ),
                                        0
                                    )}
                                </strong>
                            </div>

                        </div>
                    )}


                    {/* ==========================================
                        ERROR STATE
                    ========================================== */}

                    {error && (

                        <div className="orders-error">

                            <div className="orders-message-icon">
                                !
                            </div>

                            <h2>
                                Something went wrong
                            </h2>

                            <p>
                                {error}
                            </p>

                            <button
                                type="button"
                                onClick={fetchOrders}
                                className="orders-retry-button"
                            >
                                Try Again
                            </button>

                        </div>
                    )}


                    {/* ==========================================
                        EMPTY ORDERS
                    ========================================== */}

                    {!error && orders.length === 0 && (

                        <div className="orders-empty">

                            <div className="orders-empty-icon">
                                📦
                            </div>

                            <h2>
                                No orders yet
                            </h2>

                            <p>
                                You haven't placed any orders yet.
                                Your purchases will appear here.
                            </p>

                            <Link
                                to="/products"
                                className="orders-shop-button"
                            >
                                Explore Products
                            </Link>

                        </div>
                    )}


                    {/* ==========================================
                        ORDER LIST
                    ========================================== */}

                    {!error && orders.length > 0 && (

                        <div className="orders-list">

                            {orders.map((order) => (

                                <article
                                    className="order-card"
                                    key={order._id}
                                >

                                    {/* ORDER HEADER */}

                                    <div className="order-card-header">

                                        <div className="order-number-section">

                                            <span className="order-label">
                                                ORDER NUMBER
                                            </span>

                                            <strong>
                                                #{order._id.slice(-8).toUpperCase()}
                                            </strong>

                                            <span className="order-date">
                                                Placed on {formatDate(order.createdAt)}
                                            </span>

                                        </div>

                                        <span
                                            className={`order-status ${getStatusClass(order.status)}`}
                                        >
                                            <span className="status-dot"></span>

                                            {order.status}
                                        </span>

                                    </div>


                                    {/* ORDER PRODUCTS */}

                                    <div className="order-card-body">

                                        <div className="order-products">

                                            {order.items.map((item, index) => (

                                                <div
                                                    className="order-product"
                                                    key={`${order._id}-${index}`}
                                                >

                                                   {/* ORDER PRODUCT IMAGE */}

<div className="my-order-product-image">

    {item.product?.image ? (
        <img
            src={item.product.image}
            alt={item.name}
        />
    ) : (
        <div className="my-order-image-unavailable">
            Image unavailable
        </div>
    )}

</div>

                                                    <div className="order-product-info">

                                                        <h3>
                                                            {item.name}
                                                        </h3>

                                                        <p>
                                                            Quantity: {item.quantity}
                                                        </p>

                                                    </div>

                                                    <strong className="order-product-price">
                                                        {formatPrice(
                                                            item.price * item.quantity
                                                        )}
                                                    </strong>

                                                </div>

                                            ))}

                                        </div>


                                        {/* SHIPPING DETAILS */}

                                        <div className="order-shipping-details">

                                            <h3>
                                                Delivery Information
                                            </h3>

                                            <p>
                                                <strong>
                                                    {order.customerName}
                                                </strong>
                                            </p>

                                            <p>
                                                {order.phone}
                                            </p>

                                            <p>
                                                {order.shippingAddress}
                                            </p>

                                            <p>
                                                {order.city}
                                            </p>

                                        </div>

                                    </div>


                                    {/* ORDER FOOTER */}

                                    <div className="order-card-footer">

                                        <div className="order-payment">

                                            <span>
                                                Payment Method
                                            </span>

                                            <strong>
                                                Cash on Delivery
                                            </strong>

                                        </div>

                                        <div className="order-total">

                                            <span>
                                                Order Total
                                            </span>

                                            <strong>
                                                {formatPrice(order.totalAmount)}
                                            </strong>

                                        </div>

                                    </div>

                                </article>

                            ))}

                        </div>
                    )}

                </div>

            </main>
        </>
    );
}


export default MyOrders;
