import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/AdminOrders.css";

function AdminOrders() {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ==========================================
    // FETCH ALL ORDERS
    // ==========================================

    const fetchOrders = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get("/orders/admin");

            setOrders(response.data.orders);

        } catch (error) {

            console.error("FETCH ORDERS ERROR:", error);

            setError(
                error.response?.data?.message ||
                "Failed to load orders"
            );

        } finally {

            setLoading(false);

        }
    };


    // ==========================================
    // LOAD ORDERS WHEN PAGE OPENS
    // ==========================================

    useEffect(() => {
        fetchOrders();
    }, []);


    // ==========================================
    // UPDATE ORDER STATUS
    // ==========================================

    const updateStatus = async (orderId, newStatus) => {

        try {

            await api.put(
                `/orders/admin/${orderId}/status`,
                {
                    status: newStatus
                }
            );

            // Refresh orders after updating
            fetchOrders();

        } catch (error) {

            console.error("UPDATE STATUS ERROR:", error);

            alert(
                error.response?.data?.message ||
                "Failed to update order status"
            );
        }
    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <div className="admin-orders-page">
                <h1>Orders</h1>
                <p>Loading orders...</p>
            </div>
        );
    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {
        return (
            <div className="admin-orders-page">
                <h1>Orders</h1>
                <p className="orders-error">{error}</p>

                <button
                    className="retry-button"
                    onClick={fetchOrders}
                >
                    Try Again
                </button>
            </div>
        );
    }


    // ==========================================
    // PAGE
    // ==========================================

    return (
        <div className="admin-orders-page">

            <div className="orders-header">

                <div>
                    <p className="orders-label">
                        ADMIN PANEL
                    </p>

                    <h1>Orders</h1>

                    <span>
                        Manage customer orders
                    </span>
                </div>

                <button
                    className="refresh-button"
                    onClick={fetchOrders}
                >
                    Refresh
                </button>

            </div>


            {/* ==========================================
                NO ORDERS
            ========================================== */}

            {orders.length === 0 ? (

                <div className="no-orders">
                    <h2>No Orders Yet</h2>
                    <p>
                        Customer orders will appear here
                        after they place an order.
                    </p>
                </div>

            ) : (

                <div className="orders-list">

                    {orders.map((order) => (

                        <div
                            className="admin-order-card"
                            key={order._id}
                        >

                            {/* ==========================================
                                ORDER HEADER
                            ========================================== */}

                            <div className="order-card-header">

                                <div>
                                    <h3>
                                        Order #{order._id.slice(-8)}
                                    </h3>

                                    <p>
                                        {new Date(
                                            order.createdAt
                                        ).toLocaleString()}
                                    </p>
                                </div>

                                <div className="order-status">

                                    <select
                                        value={order.status}
                                        onChange={(e) =>
                                            updateStatus(
                                                order._id,
                                                e.target.value
                                            )
                                        }
                                    >

                                        <option value="Pending">
                                            Pending
                                        </option>

                                        <option value="Processing">
                                            Processing
                                        </option>

                                        <option value="Shipped">
                                            Shipped
                                        </option>

                                        <option value="Delivered">
                                            Delivered
                                        </option>

                                        <option value="Cancelled">
                                            Cancelled
                                        </option>

                                    </select>

                                </div>

                            </div>


                            {/* ==========================================
                                CUSTOMER INFORMATION
                            ========================================== */}

                            <div className="customer-info">

                                <h4>Customer Information</h4>

                                <p>
                                    <strong>Name:</strong>{" "}
                                    {order.customerName}
                                </p>

                                <p>
                                    <strong>Phone:</strong>{" "}
                                    {order.phone}
                                </p>

                                <p>
                                    <strong>City:</strong>{" "}
                                    {order.city}
                                </p>

                                <p>
                                    <strong>Address:</strong>{" "}
                                    {order.shippingAddress}
                                </p>

                                <p>
                                    <strong>Payment:</strong>{" "}
                                    {order.paymentMethod}
                                </p>

                            </div>


                            {/* ==========================================
                                ORDER ITEMS
                            ========================================== */}

                            <div className="order-items">

                                <h4>Products</h4>

                                {order.items.map((item, index) => (

                                    <div
                                        className="order-item"
                                        key={index}
                                    >

                                        <div>

                                            <strong>
                                                {item.name}
                                            </strong>

                                            <p>
                                                Rs. {item.price} ×{" "}
                                                {item.quantity}
                                            </p>

                                        </div>

                                        <strong>
                                            Rs.{" "}
                                            {item.price *
                                                item.quantity}
                                        </strong>

                                    </div>

                                ))}

                            </div>


                            {/* ==========================================
                                TOTAL
                            ========================================== */}

                            <div className="order-total">

                                <span>
                                    Total Amount
                                </span>

                                <strong>
                                    Rs. {order.totalAmount}
                                </strong>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default AdminOrders;