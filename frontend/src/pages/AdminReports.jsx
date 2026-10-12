// ==========================================
// IMPORTS
// ==========================================

import { useEffect, useState } from "react";

import {
    BarChart3,
    ShoppingCart,
    DollarSign,
    CheckCircle,
    XCircle,
    TrendingUp,
    Package,
    RefreshCw,
    Printer
} from "lucide-react";

import api from "../services/api";

import "../styles/AdminReports.css";


// ==========================================
// ADMIN REPORTS
// ==========================================

function AdminReports() {

    // ==========================================
    // STATE
    // ==========================================

    const [orders, setOrders] = useState([]);

    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // ==========================================
    // FETCH REPORT DATA
    // ==========================================

    const fetchReportData = async () => {

        try {

            setLoading(true);

            setError("");

            const [
                ordersResponse,
                productsResponse
            ] = await Promise.all([
                api.get("/orders/admin"),
                api.get("/products")
            ]);

            setOrders(
                ordersResponse.data.orders || []
            );

            setProducts(
            Array.isArray(productsResponse.data)
                ? productsResponse.data
                : productsResponse.data.products || []
        );

        } catch (error) {

            console.error(
                "FETCH REPORT DATA ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load report data"
            );

        } finally {

            setLoading(false);

        }
    };


    // ==========================================
    // LOAD DATA
    // ==========================================

    useEffect(() => {

        fetchReportData();

    }, []);


    // ==========================================
    // FORMAT PRICE
    // ==========================================

    const formatPrice = (price) => {

        return Number(price || 0).toLocaleString(
            "en-PK"
        );

    };


    // ==========================================
    // FORMAT DATE
    // ==========================================

    const formatDate = (date) => {

        return new Date(date).toLocaleDateString(
            "en-PK",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    };


    // ==========================================
    // REPORT CALCULATIONS
    // ==========================================

    // Cancelled orders
    const cancelledOrders = orders.filter(
        (order) =>
            order.status === "Cancelled"
    );


    // Delivered orders
    const deliveredOrders = orders.filter(
        (order) =>
            order.status === "Delivered"
    );


    // Pending orders
    const pendingOrders = orders.filter(
        (order) =>
            order.status === "Pending"
    );


    // Processing orders
    const processingOrders = orders.filter(
        (order) =>
            order.status === "Processing"
    );


    // Shipped orders
    const shippedOrders = orders.filter(
        (order) =>
            order.status === "Shipped"
    );


    // Orders that count toward revenue
    const validOrders = orders.filter(
        (order) =>
            order.status !== "Cancelled"
    );


    // Total revenue
    const totalRevenue = validOrders.reduce(
        (total, order) => {

            return (
                total +
                Number(order.totalAmount || 0)
            );

        },
        0
    );


    // Average order value
    const averageOrderValue =
        validOrders.length > 0
            ? totalRevenue / validOrders.length
            : 0;


    // ==========================================
    // BEST SELLING PRODUCTS
    // ==========================================

    const productSales = {};


    validOrders.forEach((order) => {

        order.items.forEach((item) => {

            if (!productSales[item.product]) {

                productSales[item.product] = {
                    name: item.name,
                    quantity: 0,
                    revenue: 0
                };

            }

            productSales[item.product].quantity +=
                Number(item.quantity || 0);

            productSales[item.product].revenue +=
                Number(item.price || 0) *
                Number(item.quantity || 0);

        });

    });


    const bestSellingProducts =
        Object.values(productSales)
            .sort(
                (a, b) =>
                    b.quantity - a.quantity
            )
            .slice(0, 5);


    // ==========================================
    // RECENT SALES
    // ==========================================

    const recentSales = orders
        .slice(0, 8);


    // ==========================================
    // LOW STOCK
    // ==========================================

    const lowStockProducts =
        products.filter(
            (product) =>
                Number(product.stock) <= 5
        );


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <section className="admin-reports-page">

                <div className="reports-loading">

                    <RefreshCw
                        size={26}
                        className="reports-loading-icon"
                    />

                    <p>
                        Loading reports...
                    </p>

                </div>

            </section>
        );

    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        return (
            <section className="admin-reports-page">

                <header className="reports-header">

                    <div>

                        <p className="reports-label">
                            ADMIN PANEL
                        </p>

                        <h1>
                            Reports
                        </h1>

                    </div>

                </header>

                <section className="reports-error">

                    <BarChart3 size={30} />

                    <h2>
                        Unable to Load Reports
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        onClick={fetchReportData}
                    >
                        Try Again
                    </button>

                </section>

            </section>
        );

    }


    // ==========================================
    // REPORT PAGE
    // ==========================================

    return (
        <section className="admin-reports-page">

            {/* ==================================
                HEADER
                ================================== */}

            <header className="reports-header">

                <div>

                    <p className="reports-label">
                        ADMIN PANEL
                    </p>

                    <h1>
                        Reports
                    </h1>

                    <p className="reports-subtitle">
                        Sales and order performance overview
                    </p>

                </div>


                <div className="reports-actions">

                    <button
                        className="reports-print-button"
                        onClick={() =>
                            window.print()
                        }
                    >
                        <Printer size={16} />

                        Print Report
                    </button>


                    <button
                        className="reports-refresh-button"
                        onClick={fetchReportData}
                    >
                        <RefreshCw size={16} />

                        Refresh
                    </button>

                </div>

            </header>


            {/* ==================================
                REPORT DATE
                ================================== */}

            <p className="report-generated">

                Report generated on{" "}

                <strong>
                    {new Date().toLocaleDateString(
                        "en-PK",
                        {
                            day: "2-digit",
                            month: "long",
                            year: "numeric"
                        }
                    )}
                </strong>

            </p>


            {/* ==================================
                SUMMARY CARDS
                ================================== */}

            <section className="report-summary">

                <article className="report-card">

                    <div className="report-icon orders">
                        <ShoppingCart size={21} />
                    </div>

                    <p>
                        Total Orders
                    </p>

                    <h2>
                        {orders.length}
                    </h2>

                </article>


                <article className="report-card">

                    <div className="report-icon revenue">
                        <DollarSign size={21} />
                    </div>

                    <p>
                        Total Revenue
                    </p>

                    <h2>
                        Rs. {formatPrice(totalRevenue)}
                    </h2>

                </article>


                <article className="report-card">

                    <div className="report-icon delivered">
                        <CheckCircle size={21} />
                    </div>

                    <p>
                        Delivered Orders
                    </p>

                    <h2>
                        {deliveredOrders.length}
                    </h2>

                </article>


                <article className="report-card">

                    <div className="report-icon cancelled">
                        <XCircle size={21} />
                    </div>

                    <p>
                        Cancelled Orders
                    </p>

                    <h2>
                        {cancelledOrders.length}
                    </h2>

                </article>


                <article className="report-card">

                    <div className="report-icon average">
                        <TrendingUp size={21} />
                    </div>

                    <p>
                        Average Order Value
                    </p>

                    <h2>
                        Rs. {formatPrice(averageOrderValue)}
                    </h2>

                </article>

            </section>


            {/* ==================================
                MAIN REPORT GRID
                ================================== */}

            <section className="reports-grid">

                {/* ==================================
                    BEST SELLING PRODUCTS
                    ================================== */}

                <article className="report-section">

                    <header className="report-section-header">

                        <div>

                            <h2>
                                Best-Selling Products
                            </h2>

                            <span>
                                Top products by quantity sold
                            </span>

                        </div>

                        <Package size={19} />

                    </header>


                    {bestSellingProducts.length === 0 ? (

                        <p className="report-empty">
                            No sales data available.
                        </p>

                    ) : (

                        <section className="best-products">

                            {bestSellingProducts.map(
                                (product, index) => (

                                    <article
                                        className="best-product"
                                        key={product.name}
                                    >

                                        <span className="product-rank">
                                            {index + 1}
                                        </span>

                                        <div className="best-product-info">

                                            <strong>
                                                {product.name}
                                            </strong>

                                            <span>
                                                {product.quantity}
                                                {" "}
                                                items sold
                                            </span>

                                        </div>

                                        <strong className="best-product-revenue">

                                            Rs.{" "}
                                            {formatPrice(
                                                product.revenue
                                            )}

                                        </strong>

                                    </article>

                                )
                            )}

                        </section>

                    )}

                </article>


                {/* ==================================
                    ORDER STATUS
                    ================================== */}

                <article className="report-section">

                    <header className="report-section-header">

                        <div>

                            <h2>
                                Order Status
                            </h2>

                            <span>
                                Current order distribution
                            </span>

                        </div>

                        <BarChart3 size={19} />

                    </header>


                    <section className="status-report">

                        <article className="status-report-row">

                            <span>
                                Pending
                            </span>

                            <strong>
                                {pendingOrders.length}
                            </strong>

                        </article>


                        <article className="status-report-row">

                            <span>
                                Processing
                            </span>

                            <strong>
                                {processingOrders.length}
                            </strong>

                        </article>


                        <article className="status-report-row">

                            <span>
                                Shipped
                            </span>

                            <strong>
                                {shippedOrders.length}
                            </strong>

                        </article>


                        <article className="status-report-row">

                            <span>
                                Delivered
                            </span>

                            <strong>
                                {deliveredOrders.length}
                            </strong>

                        </article>


                        <article className="status-report-row">

                            <span>
                                Cancelled
                            </span>

                            <strong>
                                {cancelledOrders.length}
                            </strong>

                        </article>

                    </section>

                </article>

            </section>


            {/* ==================================
                RECENT SALES
                ================================== */}

            <section className="report-section recent-sales-section">

                <header className="report-section-header">

                    <div>

                        <h2>
                            Recent Sales
                        </h2>

                        <span>
                            Latest customer orders
                        </span>

                    </div>

                    <ShoppingCart size={19} />

                </header>


                {recentSales.length === 0 ? (

                    <p className="report-empty">
                        No sales available.
                    </p>

                ) : (

                    <div className="sales-table-wrapper">

                        <table className="sales-table">

                            <thead>

                                <tr>

                                    <th>
                                        Order
                                    </th>

                                    <th>
                                        Customer
                                    </th>

                                    <th>
                                        Date
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Payment
                                    </th>

                                    <th>
                                        Total
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {recentSales.map(
                                    (order) => (

                                        <tr
                                            key={order._id}
                                        >

                                            <td>
                                                <strong>
                                                    #
                                                    {order._id.slice(-8)}
                                                </strong>
                                            </td>

                                            <td>
                                                {order.customerName}
                                            </td>

                                            <td>
                                                {formatDate(
                                                    order.createdAt
                                                )}
                                            </td>

                                            <td>

                                                <span
                                                    className={`report-status ${order.status.toLowerCase()}`}
                                                >
                                                    {order.status}
                                                </span>

                                            </td>

                                            <td>
                                                {order.paymentMethod}
                                            </td>

                                            <td>
                                                <strong>
                                                    Rs.{" "}
                                                    {formatPrice(
                                                        order.totalAmount
                                                    )}
                                                </strong>
                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </section>


            {/* ==================================
                STOCK SUMMARY
                ================================== */}

            <section className="report-section stock-section">

                <header className="report-section-header">

                    <div>

                        <h2>
                            Inventory Summary
                        </h2>

                        <span>
                            Current product stock information
                        </span>

                    </div>

                    <Package size={19} />

                </header>


                <section className="inventory-summary">

                    <article>

                        <span>
                            Total Products
                        </span>

                        <strong>
                            {products.length}
                        </strong>

                    </article>


                    <article>

                        <span>
                            Low Stock
                        </span>

                        <strong className="low-stock-number">
                            {lowStockProducts.length}
                        </strong>

                    </article>


                    <article>

                        <span>
                            Out of Stock
                        </span>

                        <strong className="out-stock-number">
                            {
                                products.filter(
                                    (product) =>
                                        Number(product.stock) === 0
                                ).length
                            }
                        </strong>

                    </article>

                </section>

            </section>

        </section>
    );
}

export default AdminReports;