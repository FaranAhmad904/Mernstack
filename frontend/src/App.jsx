import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";


// ==========================================
// CUSTOMER PAGES
// ==========================================

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Wishlist from "./pages/Wishlist";
import MyOrders from "./pages/MyOrders";


// ==========================================
// ROUTE PROTECTION
// ==========================================

import ProtectedRoute from "./components/ProtectedRoute";


// ==========================================
// ADMIN COMPONENTS
// ==========================================

import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./layouts/AdminLayout";


// ==========================================
// ADMIN PAGES
// ==========================================

import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import AdminOrders from "./pages/AdminOrders";
import AdminUsers from "./pages/AdminUsers";
import AdminReports from "./pages/AdminReports";


// ==========================================
// GLOBAL CSS
// ==========================================

import "./App.css";


// ==========================================
// APP
// ==========================================

function App()
{
    return (

        <BrowserRouter>

            <Routes>


                {/* ==================================
                    PUBLIC CUSTOMER ROUTES
                    ================================== */}

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/products"
                    element={<Products />}
                />

                <Route
                    path="/products/:id"
                    element={<ProductDetails />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* ==================================
                    PROTECTED CUSTOMER ROUTES
                    LOGIN REQUIRED
                    ================================== */}

                <Route
                    element={<ProtectedRoute />}
                >

                    <Route
                        path="/cart"
                        element={<Cart />}
                    />

                    <Route
                        path="/checkout"
                        element={<Checkout />}
                    />

                    <Route
                        path="/order-success/:orderId"
                        element={<OrderSuccess />}
                    />

                    <Route
                        path="/wishlist"
                        element={<Wishlist />}
                    />

                    <Route
                        path="/my-orders"
                        element={<MyOrders />}
                    />

                </Route>


                {/* ==================================
                    ADMIN ROUTES
                    ADMIN ACCESS REQUIRED
                    ================================== */}

                <Route
                    path="/admin"
                    element={
                        <AdminRoute>
                            <AdminLayout />
                        </AdminRoute>
                    }
                >

                    {/* ADMIN DASHBOARD */}

                    <Route
                        index
                        element={<AdminDashboard />}
                    />


                    {/* ADMIN PRODUCTS */}

                    <Route
                        path="products"
                        element={<AdminProducts />}
                    />


                    {/* ADD PRODUCT */}

                    <Route
                        path="products/new"
                        element={<AddProduct />}
                    />


                    {/* EDIT PRODUCT */}

                    <Route
                        path="products/edit/:id"
                        element={<EditProduct />}
                    />


                    {/* ADMIN ORDERS */}

                    <Route
                        path="orders"
                        element={<AdminOrders />}
                    />


                    {/* ADMIN USERS */}

                    <Route
                        path="users"
                        element={<AdminUsers />}
                    />


                    {/* ADMIN REPORTS */}

                    <Route
                        path="reports"
                        element={<AdminReports />}
                    />

                </Route>

            </Routes>

        </BrowserRouter>

    );
}

export default App; 