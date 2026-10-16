import { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import {
    ShoppingCart,
    User,
    LogIn,
    UserPlus,
    LogOut,
    Heart,
    Package
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

import api from "../services/api";

import "../styles/Navbar.css";


// ==========================================
// PROPS
// overlay     = navbar floats on top of the page (used on Home)
// transparent = navbar has no background (used on Home slide 1 only)
// Other pages use <Navbar /> as before.
// ==========================================

function Navbar({ overlay = false, transparent = false })
{
    const { user, logout } = useAuth();

    const navigate = useNavigate();

    const [wishlistCount, setWishlistCount] = useState(0);


    // ==========================================
    // LOAD WISHLIST COUNT
    // ==========================================

    useEffect(() =>
    {
        if (!user)
        {
            setWishlistCount(0);
            return;
        }

        const fetchWishlistCount = async () =>
        {
            try
            {
                const response = await api.get("/wishlist");

                setWishlistCount(
                    response.data.products?.length || 0
                );
            }
            catch (error)
            {
                console.error(
                    "WISHLIST COUNT ERROR:",
                    error
                );
            }
        };

        fetchWishlistCount();

    }, [user]);


    // ==========================================
    // LOGOUT
    // ==========================================

    const handleLogout = () =>
    {
        logout();

        navigate("/login");
    };


    // ==========================================
    // NAVBAR CLASSES
    // ==========================================

    const navbarClass = [
        "shop-navbar",
        overlay ? "navbar-overlay" : "",
        transparent ? "navbar-transparent" : ""
    ]
        .filter(Boolean)
        .join(" ");


    // ==========================================
    // UI
    // ==========================================

    return (
        <nav className={navbarClass}>

            <Link
                to="/"
                className="shop-logo"
            >
                Shop<span>Hub</span>
            </Link>


            <div className="shop-nav-links">

                <Link to="/">
                    Home
                </Link>

                <Link to="/products">
                    Products
                </Link>

            </div>


            <div className="shop-nav-actions">

                {/* WISHLIST */}

                {user && (
                    <Link
                        to="/wishlist"
                        className="wishlist-nav-link"
                    >

                        <span className="wishlist-nav-icon">

                            <Heart
                                size={19}
                                strokeWidth={2}
                            />

                            {wishlistCount > 0 && (
                                <span className="wishlist-nav-count">
                                    {wishlistCount > 99
                                        ? "99+"
                                        : wishlistCount}
                                </span>
                            )}

                        </span>

                        <span>Wishlist</span>

                    </Link>
                )}


                {/* MY ORDERS */}

                {user && (
                    <Link
                        to="/my-orders"
                        className="my-orders-nav-link"
                    >

                        <Package
                            size={19}
                            strokeWidth={2}
                        />

                        <span>My Orders</span>

                    </Link>
                )}


                {/* CART */}

                <Link
                    to="/cart"
                    className="cart-link"
                >

                    <ShoppingCart
                        size={19}
                        strokeWidth={2}
                    />

                    <span>Cart</span>

                </Link>


                {/* LOGGED-IN USER */}

                {user ? (
                    <>

                        <div className="navbar-user">

                            <div className="navbar-user-icon">

                                <User
                                    size={17}
                                    strokeWidth={2}
                                />

                            </div>

                            <span>
                                Hi, {user.name}
                            </span>

                        </div>


                        <button
                            className="navbar-logout"
                            type="button"
                            onClick={handleLogout}
                        >

                            <LogOut
                                size={17}
                                strokeWidth={2}
                            />

                            <span>Logout</span>

                        </button>

                    </>
                ) : (
                    <>

                        <Link
                            to="/login"
                            className="navbar-login"
                        >

                            <LogIn
                                size={17}
                                strokeWidth={2}
                            />

                            <span>Login</span>

                        </Link>


                        <Link
                            to="/register"
                            className="navbar-register"
                        >

                            <UserPlus
                                size={17}
                                strokeWidth={2}
                            />

                            <span>Register</span>

                        </Link>

                    </>
                )}

            </div>

        </nav>
    );
}


export default Navbar;