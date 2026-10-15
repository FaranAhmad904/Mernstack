// ==========================================
// IMPORTS
// ==========================================

import { useEffect, useMemo, useState } from "react";

import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

import {
    Package,
    ShoppingBag,
    Wallet,
    Search,
    ArrowRight,
    MapPin,
    Phone,
    CalendarDays,
    CreditCard,
    Clock,
    CheckCircle2,
    Truck,
    XCircle,
    RefreshCw
} from "lucide-react";

import api from "../services/api";

import "../styles/MyOrders.css";


// ==========================================
// MY ORDERS COMPONENT
// ==========================================

function MyOrders()
{
     <Navbar/>

    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [searchTerm, setSearchTerm] = useState("");

    const [statusFilter, setStatusFilter] = useState("All");

    const [sortOrder, setSortOrder] = useState("newest");


    // ==========================================
    // FETCH CUSTOMER ORDERS
    // ==========================================

    const fetchOrders = async () =>
    {
        try
        {
            setLoading(true);

            setError("");

            const response = await api.get("/orders/my-orders");

            setOrders(response.data.orders || []);
        }
        catch (error)
        {
            console.error(
                "FETCH ORDERS ERROR:",
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
    // LOAD ORDERS ON PAGE OPEN
    // ==========================================

    useEffect(() =>
    {
        fetchOrders();

    }, []);


    // ==========================================
    // ORDER SUMMARY
    // ==========================================

    const totalOrders = orders.length;

    const totalItems = orders.reduce(
        (total, order) =>
        {
            return total + order.items.reduce(
                (itemTotal, item) =>
                {
                    return itemTotal + item.quantity;
                },
                0
            );
        },
        0
    );

    const totalSpent = orders.reduce(
        (total, order) =>
        {
            if (order.status !== "Cancelled")
            {
                return total + order.totalAmount;
            }

            return total;
        },
        0
    );


    // ==========================================
    // FILTER AND SORT ORDERS
    // ==========================================

    const filteredOrders = useMemo(() =>
    {
        let result = [...orders];

        if (statusFilter !== "All")
        {
            result = result.filter(
                order => order.status === statusFilter
            );
        }

        if (searchTerm.trim())
        {
            const search = searchTerm.toLowerCase();

            result = result.filter(order =>
            {
                const orderId = order._id.toLowerCase();

                const productMatch = order.items.some(
                    item =>
                    {
                        return item.name
                            .toLowerCase()
                            .includes(search);
                    }
                );

                return orderId.includes(search) || productMatch;
            });
        }

        result.sort((a, b) =>
        {
            const firstDate = new Date(a.createdAt).getTime();

            const secondDate = new Date(b.createdAt).getTime();

            return sortOrder === "newest"
                ? secondDate - firstDate
                : firstDate - secondDate;
        });

        return result;

    }, [orders, searchTerm, statusFilter, sortOrder]);


    // ==========================================
    // STATUS ICON
    // ==========================================

    const getStatusIcon = (status) =>
    {
        switch (status)
        {
            case "Pending":
                return <Clock size={15} />;

            case "Processing":
                return <Package size={15} />;

            case "Shipped":
                return <Truck size={15} />;

            case "Delivered":
                return <CheckCircle2 size={15} />;

            case "Cancelled":
                return <XCircle size={15} />;

            default:
                return <Package size={15} />;
        }
    };


    // ==========================================
    // STATUS CLASS
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
    // FORMAT PRICE
    // ==========================================

    const formatPrice = (price) =>
    {
        return new Intl.NumberFormat(
            "en-PK",
            {
                style: "currency",
                currency: "PKR",
                maximumFractionDigits: 0
            }
        ).format(price || 0);
    };


    // ==========================================
    // FORMAT DATE
    // ==========================================

    const formatDate = (date) =>
    {
        if (!date)
        {
            return "Date unavailable";
        }

        return new Date(date).toLocaleDateString(
            "en-PK",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );
    };


    // ==========================================
    // LOADING SCREEN
    // ==========================================

    if (loading)
    {
        return (
            <div className="my-orders-page">

                <div className="my-orders-loading">

                    <div className="orders-loading-spinner"></div>

                    <h3>Loading your orders</h3>

                    <p>
                        Please wait while we fetch your order history.
                    </p>

                </div>

            </div>
        );
    }


    // ==========================================
    // MAIN UI
    // ==========================================

    return (
        <>
        <Navbar/>
        
       
        <div className="my-orders-page">

            <div className="my-orders-container">


                {/* ==================================
                    PAGE HEADER
                    ================================== */}

                <div className="my-orders-header">

                    <div className="my-orders-heading">

                        <div className="orders-heading-icon">
                            <Package size={25} />
                        </div>

                        <div>

                            <h1>My Orders</h1>

                            <p>
                                Track your purchases and manage your orders.
                            </p>

                        </div>

                    </div>


                    <Link
                        to="/products"
                        className="orders-shop-button"
                    >

                        <ShoppingBag size={17} />

                        Continue Shopping

                        <ArrowRight size={16} />

                    </Link>

                </div>


                {/* ==================================
                    SUMMARY CARDS
                    ================================== */}

                <div className="orders-summary-grid">

                    <div className="orders-summary-card">

                        <div className="orders-summary-icon purple">
                            <Package size={22} />
                        </div>

                        <div className="orders-summary-info">

                            <span>Total Orders</span>

                            <h2>{totalOrders}</h2>

                            <p>All your purchases</p>

                        </div>

                    </div>


                    <div className="orders-summary-card">

                        <div className="orders-summary-icon orange">
                            <ShoppingBag size={22} />
                        </div>

                        <div className="orders-summary-info">

                            <span>Items Purchased</span>

                            <h2>{totalItems}</h2>

                            <p>Total items ordered</p>

                        </div>

                    </div>


                    <div className="orders-summary-card">

                        <div className="orders-summary-icon green">
                            <Wallet size={22} />
                        </div>

                        <div className="orders-summary-info">

                            <span>Order Value</span>

                            <h2>{formatPrice(totalSpent)}</h2>

                            <p>Excluding cancelled orders</p>

                        </div>

                    </div>

                </div>


                {/* ==================================
                    ERROR MESSAGE
                    ================================== */}

                {error && (
                    <div className="orders-error-message">

                        <XCircle size={20} />

                        <span>{error}</span>

                        <button
                            type="button"
                            onClick={fetchOrders}
                        >
                            <RefreshCw size={15} />
                            Retry
                        </button>

                    </div>
                )}


                {/* ==================================
                    ORDER HISTORY
                    ================================== */}

                <div className="orders-history-section">


                    {/* SECTION HEADER */}

                    <div className="orders-history-heading">

                        <div>

                            <h2>Order History</h2>

                            <p>
                                View your previous orders and their current status.
                            </p>

                        </div>

                        <span className="orders-count-badge">
                            {filteredOrders.length} Orders
                        </span>

                    </div>


                    {/* ==================================
                        SEARCH AND FILTERS
                        ================================== */}

                    <div className="orders-toolbar">

                        <div className="orders-search">

                            <Search size={19} />

                            <input
                                type="text"
                                placeholder="Search order ID or product..."
                                value={searchTerm}
                                onChange={(event) =>
                                {
                                    setSearchTerm(event.target.value);
                                }}
                            />

                        </div>


                        <div className="orders-filter-group">

                            <select
                                value={statusFilter}
                                onChange={(event) =>
                                {
                                    setStatusFilter(event.target.value);
                                }}
                                aria-label="Filter orders by status"
                            >

                                <option value="All">
                                    All Statuses
                                </option>

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


                            <select
                                value={sortOrder}
                                onChange={(event) =>
                                {
                                    setSortOrder(event.target.value);
                                }}
                                aria-label="Sort orders by date"
                            >

                                <option value="newest">
                                    Newest First
                                </option>

                                <option value="oldest">
                                    Oldest First
                                </option>

                            </select>

                        </div>

                    </div>


                    {/* ==================================
                        EMPTY ORDER HISTORY
                        ================================== */}

                    {!error && orders.length === 0 && (

                        <div className="orders-empty-state">

                            <div className="orders-empty-icon">
                                <ShoppingBag size={35} />
                            </div>

                            <h3>No orders yet</h3>

                            <p>
                                Your purchases will appear here once you place your first order.
                            </p>

                            <Link
                                to="/products"
                                className="orders-empty-button"
                            >
                                Explore Products
                                <ArrowRight size={17} />
                            </Link>

                        </div>

                    )}


                    {/* ==================================
                        NO FILTER RESULTS
                        ================================== */}

                    {orders.length > 0 && filteredOrders.length === 0 && (

                        <div className="orders-empty-state">

                            <div className="orders-empty-icon">
                                <Search size={32} />
                            </div>

                            <h3>No matching orders</h3>

                            <p>
                                Try another search term or change your filters.
                            </p>

                            <button
                                type="button"
                                className="orders-reset-button"
                                onClick={() =>
                                {
                                    setSearchTerm("");
                                    setStatusFilter("All");
                                }}
                            >
                                Clear Filters
                            </button>

                        </div>

                    )}


                    {/* ==================================
                        ORDER CARDS
                        ================================== */}

                    <div className="orders-list">

                        {filteredOrders.map(order =>
                        (
                            <article
                                className="my-order-card"
                                key={order._id}
                            >


                                {/* ORDER CARD HEADER */}

                                <div className="my-order-card-header">

                                    <div className="my-order-reference">

                                        <span className="my-order-label">
                                            ORDER NUMBER
                                        </span>

                                        <h3>
                                            #{order._id.slice(-8).toUpperCase()}
                                        </h3>

                                        <span className="my-order-date">

                                            <CalendarDays size={14} />

                                            {formatDate(order.createdAt)}

                                        </span>

                                    </div>


                                    <div
                                        className={`my-order-status ${getStatusClass(order.status)}`}
                                    >

                                        {getStatusIcon(order.status)}

                                        <span>
                                            {order.status}
                                        </span>

                                    </div>

                                </div>


                                {/* ORDER PRODUCTS */}

                                <div className="my-order-products">

                                    {order.items.map((item, index) =>
                                    (
                                        <div
                                            className="my-order-product"
                                            key={`${order._id}-${item.product?._id || item.name}-${index}`}
                                        >

                                            <div className="my-order-product-image">

                                                {item.product?.image ? (

                                                    <img
                                                        src={item.product.image}
                                                        alt={item.name}
                                                        loading="lazy"
                                                    />

                                                ) : (

                                                    <div className="my-order-image-unavailable">
                                                        Image unavailable
                                                    </div>

                                                )}

                                            </div>


                                            <div className="my-order-product-info">

                                                <h4>
                                                    {item.name}
                                                </h4>

                                                <p>
                                                    Product purchased from ShopHub
                                                </p>

                                                <span className="my-order-quantity">
                                                    Qty: {item.quantity}
                                                </span>

                                            </div>


                                            <div className="my-order-product-price">

                                                <span>Price</span>

                                                <strong>
                                                    {formatPrice(
                                                        item.price * item.quantity
                                                    )}
                                                </strong>

                                                <small>
                                                    {formatPrice(item.price)} each
                                                </small>

                                            </div>

                                        </div>
                                    ))}

                                </div>


                                {/* ORDER DETAILS */}

                                <div className="my-order-details">

                                    <div className="my-order-detail-item">

                                        <div className="my-order-detail-icon">
                                            <MapPin size={17} />
                                        </div>

                                        <div>

                                            <span>Delivery Address</span>

                                            <strong>
                                                {order.shippingAddress}
                                            </strong>

                                            <small>
                                                {order.city}
                                            </small>

                                        </div>

                                    </div>


                                    <div className="my-order-detail-item">

                                        <div className="my-order-detail-icon">
                                            <CreditCard size={17} />
                                        </div>

                                        <div>

                                            <span>Payment Method</span>

                                            <strong>
                                                {order.paymentMethod === "COD"
                                                    ? "Cash on Delivery"
                                                    : order.paymentMethod}
                                            </strong>

                                        </div>

                                    </div>


                                    <div className="my-order-detail-item">

                                        <div className="my-order-detail-icon">
                                            <Phone size={17} />
                                        </div>

                                        <div>

                                            <span>Contact Number</span>

                                            <strong>
                                                {order.phone || "Not provided"}
                                            </strong>

                                        </div>

                                    </div>

                                </div>


                                {/* ORDER FOOTER */}

                                <div className="my-order-card-footer">

                                    <div className="my-order-total">

                                        <span>Order Total</span>

                                        <strong>
                                            {formatPrice(order.totalAmount)}
                                        </strong>

                                    </div>


                                    <div className="my-order-footer-note">

                                        <CheckCircle2 size={16} />

                                        <span>
                                            Order placed successfully
                                        </span>

                                    </div>

                                </div>

                            </article>
                        ))}

                    </div>

                </div>

            </div>

        </div>
        </>
    );
}


export default MyOrders;