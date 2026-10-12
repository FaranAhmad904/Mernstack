import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    Users,
    Package,
    ShoppingCart,
    DollarSign,
    Clock,
    Truck,
    CheckCircle,
    AlertTriangle,
    RefreshCw
} from "lucide-react";

import api from "../services/api";
import "../styles/AdminDashboard.css";


function AdminDashboard() {

    // ==========================================
    // STATE
    // ==========================================

    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // ==========================================
    // FETCH DASHBOARD DATA
    // ==========================================

    const fetchDashboardData = async () => {

        try {

            setLoading(true);
            setError("");

            const [
                usersResponse,
                productsResponse,
                ordersResponse
            ] = await Promise.all([
                api.get("/users"),
                api.get("/products"),
                api.get("/orders/admin")
            ]);


            // USERS

            setUsers(
                usersResponse.data.users || []
            );


            // PRODUCTS

            setProducts(
    Array.isArray(productsResponse.data)
        ? productsResponse.data
        : productsResponse.data.products || []
);


            // ORDERS

            setOrders(
                ordersResponse.data.orders || []
            );

        } catch (error) {

            console.error(
                "DASHBOARD ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load dashboard data"
            );

        } finally {

            setLoading(false);

        }
    };


    // ==========================================
    // LOAD DATA
    // ==========================================

    useEffect(() => {

        fetchDashboardData();

    }, []);


    // ==========================================
    // CALCULATE REVENUE
    // ==========================================

    const totalRevenue = orders
        .filter(
            (order) =>
                order.status !== "Cancelled"
        )
        .reduce(
            (total, order) =>
                total + Number(order.totalAmount || 0),
            0
        );


    // ==========================================
    // ORDER STATUS COUNTS
    // ==========================================

    const pendingOrders = orders.filter(
        (order) =>
            order.status === "Pending"
    ).length;


    const processingOrders = orders.filter(
        (order) =>
            order.status === "Processing"
    ).length;


    const shippedOrders = orders.filter(
        (order) =>
            order.status === "Shipped"
    ).length;


    const deliveredOrders = orders.filter(
        (order) =>
            order.status === "Delivered"
    ).length;


    // ==========================================
    // LOW STOCK PRODUCTS
    // ==========================================

    const lowStockProducts = products.filter(
        (product) =>
            Number(product.stock) <= 5
    );


    // ==========================================
    // RECENT ORDERS
    // ==========================================

    const recentOrders = orders.slice(0, 5);


    // ==========================================
    // FORMAT PRICE
    // ==========================================

    const formatPrice = (price) => {

        return Number(price || 0).toLocaleString(
            "en-PK"
        );

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <div className="admin-dashboard">

                <div className="dashboard-loading">

                    <RefreshCw
                        size={25}
                        className="loading-icon"
                    />

                    <p>
                        Loading dashboard...
                    </p>

                </div>

            </div>
        );

    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        return (
            <div className="admin-dashboard">

                <div className="dashboard-error">

                    <AlertTriangle size={25} />

                    <h2>
                        Unable to Load Dashboard
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        onClick={fetchDashboardData}
                    >
                        Try Again
                    </button>

                </div>

            </div>
        );

    }


    // ==========================================
    // DASHBOARD
    // ==========================================

    return (

        <div className="admin-dashboard">


            {/* ======================================
                HEADER
            ====================================== */}

            <div className="dashboard-header">

                <div>

                    <p className="dashboard-label">
                        ADMIN PANEL
                    </p>

                    <h1>
                        Dashboard
                    </h1>

                    <p className="dashboard-subtitle">
                        Overview of your ShopHub store
                    </p>

                </div>


                <button
                    className="dashboard-refresh-button"
                    onClick={fetchDashboardData}
                >

                    <RefreshCw size={16} />

                    Refresh

                </button>

            </div>


            {/* ======================================
                STAT CARDS
            ====================================== */}

            <div className="dashboard-stats">


                {/* USERS */}

                <div className="dashboard-stat-card">

                    <div className="stat-icon users-icon">
                        <Users size={21} />
                    </div>

                    <div>

                        <p>
                            Total Users
                        </p>

                        <h2>
                            {users.length}
                        </h2>

                    </div>

                </div>


                {/* PRODUCTS */}

                <div className="dashboard-stat-card">

                    <div className="stat-icon products-icon">
                        <Package size={21} />
                    </div>

                    <div>

                        <p>
                            Total Products
                        </p>

                        <h2>
                            {products.length}
                        </h2>

                    </div>

                </div>


                {/* ORDERS */}

                <div className="dashboard-stat-card">

                    <div className="stat-icon orders-icon">
                        <ShoppingCart size={21} />
                    </div>

                    <div>

                        <p>
                            Total Orders
                        </p>

                        <h2>
                            {orders.length}
                        </h2>

                    </div>

                </div>


                {/* REVENUE */}

                <div className="dashboard-stat-card">

                    <div className="stat-icon revenue-icon">
                        <DollarSign size={21} />
                    </div>

                    <div>

                        <p>
                            Total Revenue
                        </p>

                        <h2>
                            Rs. {formatPrice(totalRevenue)}
                        </h2>

                    </div>

                </div>

            </div>


            {/* ======================================
                MAIN DASHBOARD GRID
            ====================================== */}

            <div className="dashboard-main-grid">


                {/* ==================================
                    RECENT ORDERS
                ================================== */}

                <div className="dashboard-card recent-orders-card">

                    <div className="dashboard-card-header">

                        <div>

                            <h2>
                                Recent Orders
                            </h2>

                            <span>
                                Latest customer orders
                            </span>

                        </div>


                        <Link
                            to="/admin/orders"
                            className="view-all-link"
                        >
                            View All
                        </Link>

                    </div>


                    {recentOrders.length === 0 ? (

                        <div className="dashboard-empty">
                            No orders yet.
                        </div>

                    ) : (

                        <div className="recent-orders-list">

                            {recentOrders.map(
                                (order) => (

                                    <div
                                        className="recent-order"
                                        key={order._id}
                                    >

                                        <div className="order-main-info">

                                            <div className="order-icon">

                                                <ShoppingCart
                                                    size={17}
                                                />

                                            </div>


                                            <div>

                                                <strong>
                                                    #
                                                    {order._id.slice(-8)}
                                                </strong>

                                                <p>
                                                    {order.customerName}
                                                </p>

                                            </div>

                                        </div>


                                        <div className="order-price">

                                            <strong>
                                                Rs.{" "}
                                                {formatPrice(
                                                    order.totalAmount
                                                )}
                                            </strong>

                                            <span
                                                className={
                                                    `order-status ${order.status.toLowerCase()}`
                                                }
                                            >
                                                {order.status}
                                            </span>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>


                {/* ==================================
                    ORDER STATUS
                ================================== */}

                <div className="dashboard-card">

                    <div className="dashboard-card-header">

                        <div>

                            <h2>
                                Order Status
                            </h2>

                            <span>
                                Current order overview
                            </span>

                        </div>

                    </div>


                    <div className="order-status-list">


                        <div className="status-row">

                            <div className="status-left">

                                <div className="status-icon pending">
                                    <Clock size={17} />
                                </div>

                                <span>
                                    Pending
                                </span>

                            </div>

                            <strong>
                                {pendingOrders}
                            </strong>

                        </div>


                        <div className="status-row">

                            <div className="status-left">

                                <div className="status-icon processing">
                                    <RefreshCw size={17} />
                                </div>

                                <span>
                                    Processing
                                </span>

                            </div>

                            <strong>
                                {processingOrders}
                            </strong>

                        </div>


                        <div className="status-row">

                            <div className="status-left">

                                <div className="status-icon shipped">
                                    <Truck size={17} />
                                </div>

                                <span>
                                    Shipped
                                </span>

                            </div>

                            <strong>
                                {shippedOrders}
                            </strong>

                        </div>


                        <div className="status-row">

                            <div className="status-left">

                                <div className="status-icon delivered">
                                    <CheckCircle size={17} />
                                </div>

                                <span>
                                    Delivered
                                </span>

                            </div>

                            <strong>
                                {deliveredOrders}
                            </strong>

                        </div>

                    </div>

                </div>

            </div>


            {/* ======================================
                LOW STOCK + QUICK ACTIONS
            ====================================== */}

            <div className="dashboard-bottom-grid">


                {/* LOW STOCK */}

                <div className="dashboard-card">

                    <div className="dashboard-card-header">

                        <div>

                            <h2>
                                Low Stock Products
                            </h2>

                            <span>
                                Products with 5 or fewer items
                            </span>

                        </div>


                        <Link
                            to="/admin/products"
                            className="view-all-link"
                        >
                            Products
                        </Link>

                    </div>


                    {lowStockProducts.length === 0 ? (

                        <div className="dashboard-empty">

                            <CheckCircle size={22} />

                            <p>
                                All products have sufficient stock.
                            </p>

                        </div>

                    ) : (

                        <div className="low-stock-list">

                            {lowStockProducts
                                .slice(0, 5)
                                .map(
                                    (product) => (

                                        <div
                                            className="low-stock-row"
                                            key={product._id}
                                        >

                                            <div className="low-stock-product">

                                                <Package
                                                    size={17}
                                                />

                                                <span>
                                                    {product.name}
                                                </span>

                                            </div>


                                            <span className="stock-warning">

                                                {product.stock} left

                                            </span>

                                        </div>

                                    )
                                )}

                        </div>

                    )}

                </div>


                {/* QUICK ACTIONS */}

                <div className="dashboard-card">

                    <div className="dashboard-card-header">

                        <div>

                            <h2>
                                Quick Actions
                            </h2>

                            <span>
                                Common admin tasks
                            </span>

                        </div>

                    </div>


                    <div className="quick-actions">

                        <Link
                            to="/admin/products/new"
                            className="quick-action"
                        >

                            <Package size={19} />

                            <div>

                                <strong>
                                    Add Product
                                </strong>

                                <span>
                                    Create a new product
                                </span>

                            </div>

                        </Link>


                        <Link
                            to="/admin/orders"
                            className="quick-action"
                        >

                            <ShoppingCart size={19} />

                            <div>

                                <strong>
                                    Manage Orders
                                </strong>

                                <span>
                                    View customer orders
                                </span>

                            </div>

                        </Link>


                        <Link
                            to="/admin/users"
                            className="quick-action"
                        >

                            <Users size={19} />

                            <div>

                                <strong>
                                    Manage Users
                                </strong>

                                <span>
                                    View registered users
                                </span>

                            </div>

                        </Link>

                    </div>

                </div>

            </div>

        </div>

    );
}


export default AdminDashboard;