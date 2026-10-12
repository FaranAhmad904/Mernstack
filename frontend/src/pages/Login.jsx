import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "../styles/Auth.css";

function Login() {

    const navigate = useNavigate();

    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [message, setMessage] = useState("");


    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response = await api.post(
                "/auth/login",
                formData
            );

            console.log(
                "Login response:",
                response.data
            );


            // Save user and token in AuthContext
            login(
                response.data.user,
                response.data.token
            );


            // Move to Home page
            navigate("/");

        } catch (error) {

            console.log(
                "LOGIN ERROR:",
                error
            );

            setMessage(
                error.response?.data?.message ||
                "Something went wrong"
            );

        }

    };


    return (

        <div className="auth-page">

            <div className="auth-container">

                <h1>
                    Welcome Back
                </h1>

                <p className="auth-subtitle">
                    Login to your ShopHub account
                </p>


                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >

                    {/* EMAIL */}

                    <div className="form-group">

                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {/* PASSWORD */}

                    <div className="form-group">

                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {/* LOGIN BUTTON */}

                    <button
                        className="auth-button"
                        type="submit"
                    >
                        Login
                    </button>

                </form>


                {/* ERROR MESSAGE */}

                {message && (

                    <p className="auth-message">
                        {message}
                    </p>

                )}


                {/* REGISTER LINK */}

                <p className="auth-switch">

                    Don't have an account?{" "}

                    <Link to="/register">
                        Create Account
                    </Link>

                </p>

            </div>

        </div>

    );

}

export default Login;