// ==========================================
// IMPORTS
// ==========================================

import { Link, useNavigate } from "react-router-dom";

import {
    ShoppingCart,
    User,
    LogIn,
    UserPlus,
    LogOut
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

import "../styles/Navbar.css";


// ==========================================
// NAVBAR COMPONENT
// ==========================================

function Navbar() {

    const { user, logout } = useAuth();

    const navigate = useNavigate();


    // ==========================================
    // LOGOUT
    // ==========================================

    const handleLogout = () => {

        logout();

        navigate("/login");

    };


    // ==========================================
    // UI
    // ==========================================

    return (

        <nav className="shop-navbar">

            {/* ==================================
                LOGO
                ================================== */}

            <Link
                to="/"
                className="shop-logo"
            >
                Shop<span>Hub</span>
            </Link>


            {/* ==================================
                MAIN NAVIGATION
                ================================== */}

            <div className="shop-nav-links">

                <Link to="/">
                    Home
                </Link>

                <Link to="/products">
                    Products
                </Link>

            </div>


            {/* ==================================
                RIGHT SIDE
                ================================== */}

            <div className="shop-nav-actions">


                {/* CART */}

                <Link
                    to="/cart"
                    className="cart-link"
                >

                    <ShoppingCart
                        size={19}
                        strokeWidth={2}
                    />

                    <span>
                        Cart
                    </span>

                </Link>


                {/* ==================================
                    LOGGED IN USER
                    ================================== */}

                {user ? (

                    <>

                        {/* USER */}

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


                        {/* LOGOUT */}

                        <button
                            className="navbar-logout"
                            onClick={handleLogout}
                        >

                            <LogOut
                                size={17}
                                strokeWidth={2}
                            />

                            <span>
                                Logout
                            </span>

                        </button>

                    </>

                ) : (

                    <>

                        {/* LOGIN */}

                        <Link
                            to="/login"
                            className="navbar-login"
                        >

                            <LogIn
                                size={17}
                                strokeWidth={2}
                            />

                            <span>
                                Login
                            </span>

                        </Link>


                        {/* REGISTER */}

                        <Link
                            to="/register"
                            className="navbar-register"
                        >

                            <UserPlus
                                size={17}
                                strokeWidth={2}
                            />

                            <span>
                                Register
                            </span>

                        </Link>

                    </>

                )}

            </div>

        </nav>

    );

}


export default Navbar;