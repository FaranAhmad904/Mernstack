
import { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import {
    Heart,
    ShoppingCart,
    Trash2,
    ArrowRight
} from "lucide-react";

import api from "../services/api";

import { useAuth } from "../context/AuthContext";

import Navbar from "../components/Navbar";

import "../styles/Wishlist.css";


function Wishlist()
{
    const { user } = useAuth();

    const navigate = useNavigate();

    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [message, setMessage] = useState("");

    const [busyProduct, setBusyProduct] = useState("");


    // ==========================================
    // FETCH WISHLIST
    // ==========================================

    useEffect(() =>
    {
        if (!user)
        {
            setProducts([]);
            setLoading(false);
            return;
        }

        const fetchWishlist = async () =>
        {
            try
            {
                setLoading(true);
                setError("");

                const response = await api.get("/wishlist");

                setProducts(response.data.products || []);
            }
            catch (err)
            {
                setError(
                    err.response?.data?.message ||
                    "Unable to load your wishlist."
                );
            }
            finally
            {
                setLoading(false);
            }
        };

        fetchWishlist();

    }, [user]);


    // ==========================================
    // REMOVE FROM WISHLIST
    // ==========================================

    const removeFromWishlist = async (productId) =>
    {
        try
        {
            setBusyProduct(productId);
            setError("");
            setMessage("");

            await api.delete(`/wishlist/${productId}`);

            setProducts((current) =>
                current.filter(
                    (product) => product._id !== productId
                )
            );

            setMessage("Product removed from your wishlist.");
        }
        catch (err)
        {
            setError(
                err.response?.data?.message ||
                "Failed to remove product."
            );
        }
        finally
        {
            setBusyProduct("");
        }
    };


    // ==========================================
    // ADD TO CART
    // ==========================================

    const addToCart = async (product) =>
    {
        try
        {
            setBusyProduct(product._id);
            setError("");
            setMessage("");

            await api.post("/cart", {
                productId: product._id,
                quantity: 1
            });

            setMessage(`${product.name} added to your cart.`);
        }
        catch (err)
        {
            setError(
                err.response?.data?.message ||
                "Unable to add this product to your cart."
            );
        }
        finally
        {
            setBusyProduct("");
        }
    };


    // ==========================================
    // FORMAT PRICE
    // ==========================================

    const formatPrice = (price) =>
    {
        return Number(price || 0).toLocaleString("en-PK");
    };


    // ==========================================
    // LOGIN REQUIRED
    // ==========================================

    if (!user)
    {
        return (
            <div className="wishlist-page">

                <Navbar />

                <main className="wishlist-container">

                    <div className="wishlist-empty">

                        <Heart size={48} />

                        <h1>Your Wishlist</h1>

                        <p>
                            Please log in to view and save
                            your favorite products.
                        </p>

                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                        >
                            Login to Continue
                        </button>

                    </div>

                </main>

            </div>
        );
    }


    // ==========================================
    // UI
    // ==========================================

    return (
        <div className="wishlist-page">

            <Navbar />

            <main className="wishlist-container">

                <div className="wishlist-heading">

                    <div className="wishlist-title">

                        <div className="wishlist-title-icon">
                            <Heart size={25} />
                        </div>

                        <div>

                            <p className="wishlist-eyebrow">
                                YOUR PERSONAL COLLECTION
                            </p>

                            <h1>My Wishlist</h1>

                            <p>
                                Keep the products you love
                                in one place.
                            </p>

                        </div>

                    </div>

                    {!loading && (
                        <span className="wishlist-count">
                            {products.length}{" "}
                            {products.length === 1
                                ? "Product"
                                : "Products"}
                        </span>
                    )}

                </div>


                {error && (
                    <div className="wishlist-alert error">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="wishlist-alert success">
                        {message}
                    </div>
                )}


                {loading && (
                    <div className="wishlist-status">

                        <div className="wishlist-spinner"></div>

                        <h2>Loading your wishlist...</h2>

                    </div>
                )}


                {!loading &&
                    !error &&
                    products.length === 0 && (
                        <div className="wishlist-empty">

                            <div className="empty-heart">
                                <Heart size={42} />
                            </div>

                            <h2>Your wishlist is waiting</h2>

                            <p>
                                You haven't saved any products yet.
                                Explore ShopHub and save your favorites.
                            </p>

                            <Link
                                to="/products"
                                className="wishlist-shop-button"
                            >
                                Explore Products

                                <ArrowRight size={17} />
                            </Link>

                        </div>
                    )}


                {!loading && products.length > 0 && (
                    <div className="wishlist-grid">

                        {products.map((product) => (
                            <article
                                className="wishlist-card"
                                key={product._id}
                            >

                                <div className="wishlist-image">

                                    <Link
                                        to={`/products/${product._id}`}
                                    >
                                        {product.image ? (
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                            />
                                        ) : (
                                            <div className="wishlist-no-image">
                                                No Image
                                            </div>
                                        )}
                                    </Link>

                                    <button
                                        type="button"
                                        className="wishlist-remove"
                                        onClick={() =>
                                            removeFromWishlist(product._id)
                                        }
                                        disabled={
                                            busyProduct === product._id
                                        }
                                        aria-label="Remove from wishlist"
                                        title="Remove from wishlist"
                                    >
                                        <Trash2 size={17} />
                                    </button>

                                    <span className="wishlist-saved-label">
                                        <Heart
                                            size={12}
                                            fill="currentColor"
                                        />
                                        Saved
                                    </span>

                                </div>


                                <div className="wishlist-card-body">

                                    <span className="wishlist-category">
                                        {product.category || "Product"}
                                    </span>

                                    <h2>
                                        <Link
                                            to={`/products/${product._id}`}
                                        >
                                            {product.name || "Untitled Product"}
                                        </Link>
                                    </h2>

                                    <p className="wishlist-description">
                                        {product.description ||
                                            "Explore product details and specifications."}
                                    </p>

                                    <div className="wishlist-card-bottom">
                                        <strong>
                                            Rs. {formatPrice(product.price)}
                                        </strong>
                                    </div>

                                    <div className="wishlist-card-actions">

                                        <button
                                            type="button"
                                            className="wishlist-cart-button"
                                            onClick={() => addToCart(product)}
                                            disabled={
                                                busyProduct === product._id ||
                                                product.stock === 0
                                            }
                                        >
                                            <ShoppingCart size={16} />

                                            {busyProduct === product._id
                                                ? "Please wait..."
                                                : product.stock === 0
                                                ? "Out of Stock"
                                                : "Add to Cart"}
                                        </button>

                                        <button
                                            type="button"
                                            className="wishlist-delete-button"
                                            onClick={() =>
                                                removeFromWishlist(product._id)
                                            }
                                            disabled={
                                                busyProduct === product._id
                                            }
                                            aria-label="Remove product"
                                            title="Remove product"
                                        >
                                            <Trash2 size={17} />
                                        </button>

                                    </div>

                                </div>

                            </article>
                        ))}

                    </div>
                )}

            </main>

        </div>
    );
}


export default Wishlist;
