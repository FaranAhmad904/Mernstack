
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import api from "../services/api";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";

import "../styles/ProductDetails.css";

// ==========================================
// STAR DISPLAY
// ==========================================

function Stars({ rating = 0, interactive = false, onSelect }) {
    const selectedRating = Number(rating) || 0;

    return (
        <div
            className={`review-stars ${interactive ? "interactive" : ""}`}
            role={interactive ? "group" : "img"}
            aria-label={
                interactive
                    ? "Choose a rating from 1 to 5"
                    : `${selectedRating.toFixed(1)} out of 5 stars`
            }
        >
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    className={star <= selectedRating ? "star active" : "star"}
                    disabled={!interactive}
                    onClick={() => onSelect?.(star)}
                    aria-label={`${star} ${star === 1 ? "star" : "stars"}`}
                    aria-pressed={
                        interactive ? star === selectedRating : undefined
                    }
                >
                    ★
                </button>
            ))}
        </div>
    );
}

// ==========================================
// HELPERS
// ==========================================

function formatReviewDate(date) {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "";

    return parsedDate.toLocaleDateString("en-PK", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

function getTokenPayload() {
    const token = localStorage.getItem("token");

    if (!token) return null;

    try {
        const base64 = token
            .split(".")[1]
            .replace(/-/g, "+")
            .replace(/_/g, "/");

        return JSON.parse(atob(base64));
    } catch {
        return null;
    }
}

function getCurrentUserId() {
    const payload = getTokenPayload();

    return String(
        payload?.id ||
        payload?.userId ||
        payload?._id ||
        ""
    );
}

function getReviewUserId(review) {
    return String(review.userId?._id || review.userId || "");
}

// ==========================================
// PRODUCT DETAILS PAGE
// ==========================================

function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { dispatch } = useCart();

    // Product state
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Reviews state
    const [reviews, setReviews] = useState([]);
    const [totalReviews, setTotalReviews] = useState(0);
    const [averageRating, setAverageRating] = useState(0);

    const [ratingBreakdown, setRatingBreakdown] = useState({
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0
    });

    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [reviewError, setReviewError] = useState("");
    const [reviewSuccess, setReviewSuccess] = useState("");

    // Review form state
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [submittingReview, setSubmittingReview] = useState(false);

    const [isLoggedIn, setIsLoggedIn] = useState(
        Boolean(localStorage.getItem("token"))
    );

    const currentUserId = getCurrentUserId();

    const existingReview = reviews.find(
        (review) =>
            getReviewUserId(review) === currentUserId &&
            Boolean(currentUserId)
    );

    // ==========================================
    // FETCH PRODUCT
    // ==========================================

    useEffect(() => {
        let active = true;

        async function fetchProduct() {
            setLoading(true);
            setError("");
            setProduct(null);

            try {
                const response = await api.get(`/products/${id}`);

                if (active) {
                    setProduct(response.data);
                }
            } catch (err) {
                if (active) {
                    setError(
                        err.response?.data?.message ||
                        "Unable to load this product. Please try again."
                    );
                }

                console.error("PRODUCT DETAILS ERROR:", err);
            } finally {
                if (active) setLoading(false);
            }
        }

        fetchProduct();

        return () => {
            active = false;
        };
    }, [id]);

    // ==========================================
    // FETCH REVIEWS
    // ==========================================

    const fetchReviews = useCallback(async () => {
        setReviewsLoading(true);
        setReviewError("");

        try {
            const response = await api.get(`/reviews/${id}`);
            const data = response.data;

            const fetchedReviews = data.reviews || [];

            setReviews(fetchedReviews);
            setTotalReviews(data.totalReviews || 0);
            setAverageRating(Number(data.averageRating) || 0);

            setRatingBreakdown(
                data.ratingBreakdown || {
                    5: 0,
                    4: 0,
                    3: 0,
                    2: 0,
                    1: 0
                }
            );

            // Prefill the form when the customer has already reviewed.
            const userId = getCurrentUserId();

            const userReview = fetchedReviews.find(
                (review) =>
                    getReviewUserId(review) === userId &&
                    Boolean(userId)
            );

            if (userReview) {
                setRating(userReview.rating);
                setComment(userReview.comment || "");
            }
        } catch (err) {
            console.error("FETCH REVIEWS ERROR:", err);

            setReviewError(
                err.response?.data?.message ||
                "Unable to load reviews right now."
            );
        } finally {
            setReviewsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    // ==========================================
    // ADD TO CART
    // ==========================================

    const handleAddToCart = async () => {
        if (!localStorage.getItem("token")) {
            navigate("/login", {
                state: { from: `/products/${id}` }
            });
            return;
        }

        try {
            const response = await api.post("/cart", {
                productId: product._id,
                quantity: 1
            });

            dispatch({
                type: "SET_CART",
                payload: response.data.cart
            });

            alert("Product added to cart!");
        } catch (err) {
            console.error("ADD TO CART ERROR:", err);

            if (err.response?.status === 401) {
                navigate("/login", {
                    state: { from: `/products/${id}` }
                });
                return;
            }

            alert(
                err.response?.data?.message ||
                "Unable to add product to cart."
            );
        }
    };

    // ==========================================
    // SUBMIT / UPDATE REVIEW
    // ==========================================

    const handleReviewSubmit = async (event) => {
        event.preventDefault();

        setReviewError("");
        setReviewSuccess("");

        if (!localStorage.getItem("token")) {
            setIsLoggedIn(false);
            setReviewError("Please log in to write a review.");
            return;
        }

        if (!rating || rating < 1 || rating > 5) {
            setReviewError("Please select a star rating.");
            return;
        }

        if (comment.trim().length < 3) {
            setReviewError("Please write at least 3 characters.");
            return;
        }

        setSubmittingReview(true);

        try {
            const response = await api.post(`/reviews/${id}`, {
                rating,
                comment: comment.trim()
            });

            setReviewSuccess(
                response.data.message || "Your review has been saved!"
            );

            await fetchReviews();
        } catch (err) {
            console.error("SUBMIT REVIEW ERROR:", err);

            if (
                err.response?.status === 401 ||
                err.response?.status === 403
            ) {
                setIsLoggedIn(false);
            }

            setReviewError(
                err.response?.data?.message ||
                "Unable to submit your review. Please try again."
            );
        } finally {
            setSubmittingReview(false);
        }
    };

    // ==========================================
    // LOADING STATE
    // ==========================================

    if (loading) {
        return (
            <>
                <Navbar />

                <main className="product-details-page">
                    <div className="product-page-message">
                        <span className="details-spinner" />
                        <h2>Finding your product</h2>
                        <p>Please wait while we load the details.</p>
                    </div>
                </main>
            </>
        );
    }

    // ==========================================
    // ERROR / NOT FOUND STATE
    // ==========================================

    if (error || !product) {
        return (
            <>
                <Navbar />

                <main className="product-details-page">
                    <div className="product-page-message">
                        <div className="details-message-icon">!</div>
                        <h2>{error || "Product not found"}</h2>
                        <p>
                            We couldn't find this product. Please return to
                            the catalog and explore other products.
                        </p>

                        <button
                            type="button"
                            className="details-back-button"
                            onClick={() => navigate("/products")}
                        >
                            ← Back to Products
                        </button>
                    </div>
                </main>
            </>
        );
    }

    const stock = Number(product.stock) || 0;
    const price = Number(product.price) || 0;

    // ==========================================
    // MAIN UI
    // ==========================================

    return (
        <>
            <Navbar />

            <main className="product-details-page">
                <div className="product-page-content">
                    {/* Breadcrumb */}
                    <nav
                        className="product-breadcrumb"
                        aria-label="Breadcrumb"
                    >
                        <Link to="/">Home</Link>
                        <span>/</span>
                        <Link to="/products">Products</Link>
                        <span>/</span>
                        <strong title={product.name}>{product.name}</strong>
                    </nav>

                    {/* Back navigation */}
                    <button
                        type="button"
                        className="details-back-button"
                        onClick={() => navigate("/products")}
                    >
                        <span aria-hidden="true">←</span>
                        Back to Products
                    </button>

                    {/* Main product card */}
                    <section className="product-details-container">
                        {/* Image panel */}
                        <div className="product-details-image">
                            <div className="product-image-frame">
                                {product.image ? (
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                    />
                                ) : (
                                    <div className="product-image-placeholder">
                                        <span aria-hidden="true">◇</span>
                                        <p>No image available</p>
                                    </div>
                                )}
                            </div>

                            <span
                                className={`product-image-status ${
                                    stock > 0 ? "available" : "unavailable"
                                }`}
                            >
                                <span className="stock-indicator" />
                                {stock > 0 ? "Available" : "Out of Stock"}
                            </span>
                        </div>

                        {/* Product information */}
                        <div className="product-details-info">
                            <div className="details-topline">
                                {product.category && (
                                    <span className="details-category">
                                        {product.category}
                                    </span>
                                )}

                                <span className="details-product-label">
                                    SHOPHUB PRODUCT
                                </span>
                            </div>

                            <h1>{product.name}</h1>

                            <a
                                className="details-rating-summary"
                                href="#product-reviews"
                                aria-label={`View ${totalReviews} customer reviews`}
                            >
                                <Stars rating={averageRating} />

                                <strong>
                                    {averageRating.toFixed(1)}
                                </strong>

                                <span>
                                    ({totalReviews}{" "}
                                    {totalReviews === 1 ? "review" : "reviews"})
                                </span>
                            </a>

                            <div className="details-divider" />

                            <p className="details-description">
                                {product.description ||
                                    "No product description is available."}
                            </p>

                            <div className="details-price-block">
                                <span className="details-price-label">
                                    Price
                                </span>

                                <div className="details-price">
                                    <span className="price-currency">Rs.</span>
                                    {price.toLocaleString("en-PK")}
                                </div>
                            </div>

                            <div className="details-stock">
                                <span
                                    className={
                                        stock > 0
                                            ? "in-stock"
                                            : "out-of-stock"
                                    }
                                >
                                    <span className="stock-indicator" />

                                    {stock > 0
                                        ? `In stock · ${stock} available`
                                        : "Currently unavailable"}
                                </span>
                            </div>

                            <button
                                type="button"
                                className="add-to-cart-button"
                                disabled={stock <= 0}
                                onClick={handleAddToCart}
                            >
                                <span className="cart-button-icon" aria-hidden="true">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                    >
                                        <circle cx="9" cy="21" r="1" />
                                        <circle cx="20" cy="21" r="1" />
                                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                                    </svg>
                                </span>

                                {stock > 0 ? "Add to Cart" : "Out of Stock"}
                            </button>

                            <div className="product-trust-note">
                                <span className="trust-check" aria-hidden="true">
                                    ✓
                                </span>

                                <div>
                                    <strong>Shop with confidence</strong>
                                    <span>
                                        A simple and reliable shopping experience.
                                    </span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Product information */}
                    <section className="product-extra-section">
                        <div className="section-title-group">
                            <div className="section-title-icon" aria-hidden="true">
                                i
                            </div>

                            <div>
                                <p className="section-eyebrow">
                                    THE DETAILS
                                </p>
                                <h2>Product Information</h2>
                                <p className="section-subtitle">
                                    Everything you need to know about this item.
                                </p>
                            </div>
                        </div>

                        <div className="product-information-description">
                            <h3>About this product</h3>
                            <p>
                                {product.description ||
                                    "This product is available for purchase while stock lasts."}
                            </p>
                        </div>

                        <div className="product-information-grid">
                            <div className="product-information-item">
                                <span>Product name</span>
                                <strong>{product.name}</strong>
                            </div>

                            <div className="product-information-item">
                                <span>Category</span>
                                <strong>{product.category || "General"}</strong>
                            </div>

                            <div className="product-information-item">
                                <span>Availability</span>
                                <strong
                                    className={
                                        stock > 0
                                            ? "information-available"
                                            : "information-unavailable"
                                    }
                                >
                                    {stock > 0 ? "In Stock" : "Out of Stock"}
                                </strong>
                            </div>

                            <div className="product-information-item">
                                <span>Customer rating</span>
                                <strong>
                                    {averageRating.toFixed(1)} / 5
                                </strong>
                            </div>
                        </div>
                    </section>

                    {/* Customer reviews */}
                    <section
                        className="product-reviews-section"
                        id="product-reviews"
                    >
                        <div className="reviews-heading">
                            <div>
                                <p className="section-eyebrow">
                                    CUSTOMER FEEDBACK
                                </p>

                                <h2>Customer Reviews</h2>

                                <p className="reviews-subtitle">
                                    Honest feedback from shoppers about this product.
                                </p>
                            </div>

                            <span className="reviews-total-badge">
                                {totalReviews}{" "}
                                {totalReviews === 1 ? "Review" : "Reviews"}
                            </span>
                        </div>

                        {/* Rating overview */}
                        <div className="reviews-summary">
                            <div className="reviews-average">
                                <strong>{averageRating.toFixed(1)}</strong>

                                <Stars rating={averageRating} />

                                <span>
                                    Based on {totalReviews}{" "}
                                    {totalReviews === 1 ? "review" : "reviews"}
                                </span>
                            </div>

                            <div className="reviews-breakdown">
                                {[5, 4, 3, 2, 1].map((star) => {
                                    const count =
                                        Number(ratingBreakdown[star]) || 0;

                                    const percentage = totalReviews
                                        ? (count / totalReviews) * 100
                                        : 0;

                                    return (
                                        <div
                                            className="rating-breakdown-row"
                                            key={star}
                                        >
                                            <span className="rating-star-label">
                                                {star} star
                                            </span>

                                            <div
                                                className="rating-bar"
                                                role="progressbar"
                                                aria-label={`${star} star reviews`}
                                                aria-valuenow={count}
                                                aria-valuemin={0}
                                                aria-valuemax={totalReviews || 1}
                                            >
                                                <div
                                                    className="rating-bar-fill"
                                                    style={{
                                                        width: `${percentage}%`
                                                    }}
                                                />
                                            </div>

                                            <span className="rating-count">
                                                {count}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Write or update review */}
                        <div className="write-review-card">
                            <div className="write-review-heading">
                                <div>
                                    <p className="section-eyebrow">
                                        YOUR EXPERIENCE
                                    </p>

                                    <h3>
                                        {existingReview
                                            ? "Update Your Review"
                                            : "Write a Review"}
                                    </h3>

                                    <p>
                                        Share your thoughts to help other shoppers.
                                    </p>
                                </div>

                                <span
                                    className="write-review-icon"
                                    aria-hidden="true"
                                >
                                    ✎
                                </span>
                            </div>

                            {isLoggedIn ? (
                                <form onSubmit={handleReviewSubmit}>
                                    <label className="review-field-label">
                                        Your rating
                                    </label>

                                    <Stars
                                        rating={rating}
                                        interactive
                                        onSelect={setRating}
                                    />

                                    <label
                                        className="review-field-label"
                                        htmlFor="review-comment"
                                    >
                                        Your review
                                    </label>

                                    <textarea
                                        id="review-comment"
                                        value={comment}
                                        onChange={(event) =>
                                            setComment(event.target.value)
                                        }
                                        placeholder="What did you think about this product?"
                                        minLength={3}
                                        maxLength={1000}
                                        rows={4}
                                        required
                                    />

                                    <div className="review-form-footer">
                                        <span>
                                            {comment.length}/1000 characters
                                        </span>

                                        <button
                                            type="submit"
                                            disabled={
                                                submittingReview ||
                                                rating === 0 ||
                                                comment.trim().length < 3
                                            }
                                        >
                                            {submittingReview
                                                ? "Saving Review..."
                                                : existingReview
                                                    ? "Update Review"
                                                    : "Submit Review"}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="review-login-prompt">
                                    <p>
                                        Log in to rate this product and share
                                        your experience with other customers.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate("/login", {
                                                state: {
                                                    from: `/products/${id}`
                                                }
                                            })
                                        }
                                    >
                                        Log In to Review
                                    </button>
                                </div>
                            )}

                            {reviewError && (
                                <p
                                    className="review-feedback error"
                                    role="alert"
                                >
                                    {reviewError}
                                </p>
                            )}

                            {reviewSuccess && (
                                <p
                                    className="review-feedback success"
                                    role="status"
                                >
                                    {reviewSuccess}
                                </p>
                            )}
                        </div>

                        {/* Review list heading */}
                        <div className="reviews-list-heading">
                            <div>
                                <h3>What Customers Say</h3>
                                <p>Feedback shared by other shoppers.</p>
                            </div>

                            <span>{totalReviews} total</span>
                        </div>

                        {/* Review list states */}
                        {reviewsLoading ? (
                            <div className="reviews-empty-state">
                                <span className="details-spinner" />
                                <p>Loading customer reviews...</p>
                            </div>
                        ) : reviewError && reviews.length === 0 ? (
                            <div className="reviews-empty-state">
                                <div className="empty-review-icon">!</div>
                                <h4>Reviews couldn't be loaded</h4>
                                <p>{reviewError}</p>

                                <button
                                    type="button"
                                    className="review-retry-button"
                                    onClick={fetchReviews}
                                >
                                    Try Again
                                </button>
                            </div>
                        ) : reviews.length === 0 ? (
                            <div className="reviews-empty-state">
                                <div className="empty-review-icon">☆</div>
                                <h4>No reviews yet</h4>
                                <p>
                                    Be the first to share your experience with
                                    this product.
                                </p>
                            </div>
                        ) : (
                            <div className="reviews-list">
                                {reviews.map((review) => {
                                    const reviewerName =
                                        review.userName || "ShopHub Customer";

                                    return (
                                        <article
                                            className="customer-review-card"
                                            key={review._id}
                                        >
                                            <div className="review-avatar">
                                                {reviewerName
                                                    .trim()
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>

                                            <div className="customer-review-content">
                                                <div className="customer-review-top">
                                                    <div className="review-author">
                                                        <h4>{reviewerName}</h4>
                                                        <Stars
                                                            rating={review.rating}
                                                        />
                                                    </div>

                                                    <time className="review-date">
                                                        {formatReviewDate(
                                                            review.updatedAt ||
                                                            review.createdAt
                                                        )}
                                                    </time>
                                                </div>

                                                <p className="customer-review-comment">
                                                    {review.comment}
                                                </p>

                                                {review.updatedAt &&
                                                    review.createdAt &&
                                                    new Date(
                                                        review.updatedAt
                                                    ).getTime() -
                                                        new Date(
                                                            review.createdAt
                                                        ).getTime() >
                                                        1000 && (
                                                        <span className="review-edited">
                                                            Edited
                                                        </span>
                                                    )}
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                </div>

                {/* Footer */}
                <footer className="shop-footer">
                    <Link to="/" className="shop-footer-logo">
                        Shop<span>Hub</span>
                    </Link>

                    <p>Your simple and reliable online store.</p>

                    <div>
                        © {new Date().getFullYear()} ShopHub. All rights reserved.
                    </div>
                </footer>
            </main>
        </>
    );
}

export default ProductDetails;
