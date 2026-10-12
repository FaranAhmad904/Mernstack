// ==========================================
// IMPORTS
// ==========================================

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import {
    ArrowRight,
    ShoppingBag,
    ChevronDown,
    ChevronRight,
    Sparkles,
    ShieldCheck,
    Truck,
    Star,
    Zap
} from "lucide-react";

import api from "../services/api";
import Navbar from "../components/Navbar";

import "../styles/Home.css";


// ==========================================
// HOME PAGE
// ==========================================

function Home() {

    // ==========================================
    // STATE
    // ==========================================

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [activeSection, setActiveSection] = useState(0);

    const containerRef = useRef(null);


    // ==========================================
    // CATEGORIES
    // ==========================================

    const categories = [
        {
            name: "Electronics",
            subtitle: "Smart technology",
            image:
                "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1200&q=85"
        },
        {
            name: "Clothing",
            subtitle: "Everyday style",
            image:
                "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=85"
        },
        {
            name: "Shoes",
            subtitle: "Step into style",
            image:
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=85"
        },
        {
            name: "Accessories",
            subtitle: "Complete your look",
            image:
                "https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?auto=format&fit=crop&w=1200&q=85"
        }
    ];


    // ==========================================
    // FETCH PRODUCTS
    // ==========================================

    useEffect(() => {

        const fetchProducts = async () => {

            try {

                setLoading(true);
                setError("");

                const response = await api.get("/products");

                setProducts(
                    Array.isArray(response.data)
                        ? response.data
                        : response.data.products || []
                );

            } catch (error) {

                console.error(
                    "FETCH PRODUCTS ERROR:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Unable to load products."
                );

            } finally {

                setLoading(false);

            }

        };

        fetchProducts();

    }, []);


    // ==========================================
    // DETECT ACTIVE SECTION
    // ==========================================

    useEffect(() => {

        const container = containerRef.current;

        if (!container) return;

        const sections =
            container.querySelectorAll(".snap-section");

        const observer = new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    if (
                        entry.isIntersecting &&
                        entry.intersectionRatio >= 0.55
                    ) {

                        setActiveSection(
                            Number(
                                entry.target.dataset.index
                            )
                        );

                    }

                });

            },
            {
                root: container,
                threshold: [0.55, 0.7]
            }
        );

        sections.forEach((section) => {
            observer.observe(section);
        });

        return () => {
            observer.disconnect();
        };

    }, []);


    // ==========================================
    // FEATURED PRODUCTS
    // ==========================================

    const featuredProducts =
        products.slice(0, 4);


    // ==========================================
    // PRICE FORMAT
    // ==========================================

    const formatPrice = (price) => {

        return Number(price || 0).toLocaleString("en-PK");

    };


    // ==========================================
    // GO TO SECTION
    // ==========================================

    const goToSection = (index) => {

        const container = containerRef.current;

        if (!container) return;

        const sections =
            container.querySelectorAll(".snap-section");

        if (!sections[index]) return;

        sections[index].scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    };


    // ==========================================
    // NEXT SECTION
    // ==========================================

    const nextSection = () => {

        if (activeSection < 4) {
            goToSection(activeSection + 1);
        }

    };


    // ==========================================
    // PREVIOUS SECTION
    // ==========================================

    const previousSection = () => {

        if (activeSection > 0) {
            goToSection(activeSection - 1);
        }

    };


    // ==========================================
    // RETURN
    // ==========================================

    return (

        <div className="home-page">

            {/* ==================================
                NAVBAR
                ================================== */}

            <Navbar />


            {/* ==================================
                PAGE CONTAINER
                ================================== */}

            <main
                className="home-snap-container"
                ref={containerRef}
            >


                {/* ==================================
                    SECTION 1 — HERO
                    ================================== */}

                <section
                    className={`snap-section hero-section ${
                        activeSection === 0
                            ? "section-active"
                            : ""
                    }`}
                    data-index="0"
                >

                    {/* Animated background */}

                    <div className="hero-orb orb-one"></div>
                    <div className="hero-orb orb-two"></div>
                    <div className="hero-grid"></div>


                    {/* Hero content */}

                    <div className="hero-content">

                        <div className="hero-label">

                            <span className="label-dot"></span>

                            NEW COLLECTION

                        </div>


                        <h1>

                            Shop smarter.
                            <span>
                                Live better.
                            </span>

                        </h1>


                        <p className="hero-description">

                            Discover products you'll love,
                            explore new collections and
                            find everything you need in
                            one simple shopping experience.

                        </p>


                        <div className="hero-buttons">

                            <Link
                                to="/products"
                                className="hero-main-button"
                            >

                                <ShoppingBag size={18} />

                                Start Shopping

                                <ArrowRight size={17} />

                            </Link>


                            <Link
                                to="/products"
                                className="hero-outline-button"
                            >

                                Explore Collection

                            </Link>

                        </div>


                        {/* Stats */}

                        <div className="hero-stats">

                            <div>
                                <strong>
                                    {products.length}+
                                </strong>

                                <span>
                                    Products
                                </span>
                            </div>


                            <div className="stat-line"></div>


                            <div>
                                <strong>
                                    4
                                </strong>

                                <span>
                                    Categories
                                </span>
                            </div>


                            <div className="stat-line"></div>


                            <div>
                                <strong>
                                    24/7
                                </strong>

                                <span>
                                    Shopping
                                </span>
                            </div>

                        </div>

                    </div>


                    {/* Hero visual */}

                    <div className="hero-visual">

                        <div className="hero-glow"></div>


                        <div className="hero-product-card">

                            <div className="hero-product-top">

                                <span>
                                    SHOPHUB
                                </span>

                                <Sparkles size={17} />

                            </div>


                            <div className="hero-bag">

                                <ShoppingBag
                                    size={95}
                                    strokeWidth={1}
                                />

                            </div>


                            <div className="hero-product-bottom">

                                <span>
                                    DISCOVER MORE
                                </span>

                                <ArrowRight size={17} />

                            </div>

                        </div>


                        <div className="floating-card floating-card-one">

                            <div className="floating-icon">
                                <Zap size={17} />
                            </div>

                            <div>
                                <strong>
                                    New Arrivals
                                </strong>

                                <span>
                                    Just added
                                </span>
                            </div>

                        </div>


                        <div className="floating-card floating-card-two">

                            <Star
                                size={16}
                                fill="currentColor"
                            />

                            <strong>
                                Great products
                            </strong>

                        </div>

                    </div>


                    {/* Scroll */}

                    <button
                        className="hero-scroll"
                        onClick={nextSection}
                    >

                        <span>
                            Scroll to explore
                        </span>

                        <ChevronDown size={19} />

                    </button>

                </section>


                {/* ==================================
                    SECTION 2 — CATEGORIES
                    ================================== */}

                <section
                    className={`snap-section category-section ${
                        activeSection === 1
                            ? "section-active"
                            : ""
                    }`}
                    data-index="1"
                >

                    <div className="section-container">

                        <div className="section-header">

                            <div>

                                <p className="section-label">
                                    EXPLORE
                                </p>

                                <h2>
                                    Find your style.
                                </h2>

                            </div>

                            <p>
                                Explore our popular
                                categories and discover
                                products made for everyday life.
                            </p>

                        </div>


                        <div className="category-grid">

                            {categories.map(
                                (category, index) => (

                                    <Link
                                        to="/products"
                                        className="category-card"
                                        key={category.name}
                                        style={{
                                            "--delay":
                                                `${index * 0.12}s`
                                        }}
                                    >

                                        <img
                                            src={category.image}
                                            alt={category.name}
                                        />


                                        <div className="category-number">
                                            0{index + 1}
                                        </div>


                                        <div className="category-gradient"></div>


                                        <div className="category-info">

                                            <span>
                                                {
                                                    category.subtitle
                                                }
                                            </span>

                                            <h3>
                                                {
                                                    category.name
                                                }
                                            </h3>

                                            <div className="category-explore">

                                                Explore

                                                <ArrowRight
                                                    size={15}
                                                />

                                            </div>

                                        </div>

                                    </Link>

                                )
                            )}

                        </div>

                    </div>

                </section>


                {/* ==================================
                    SECTION 3 — PRODUCTS
                    ================================== */}

                <section
                    className={`snap-section product-section ${
                        activeSection === 2
                            ? "section-active"
                            : ""
                    }`}
                    data-index="2"
                >

                    <div className="section-container">

                        <div className="product-heading">

                            <div>

                                <p className="section-label">
                                    SHOPHUB PICKS
                                </p>

                                <h2>
                                    Featured products.
                                </h2>

                                <p>
                                    A few products from our
                                    growing collection.
                                </p>

                            </div>


                            <Link
                                to="/products"
                                className="all-products"
                            >

                                View all products

                                <ArrowRight
                                    size={16}
                                />

                            </Link>

                        </div>


                        {loading && (

                            <div className="product-loading">
                                Loading products...
                            </div>

                        )}


                        {!loading &&
                            error && (

                                <div className="product-loading error">
                                    {error}
                                </div>

                            )}


                        {!loading &&
                            !error &&
                            featuredProducts.length === 0 && (

                                <div className="product-loading">
                                    No products available.
                                </div>

                            )}


                        {!loading &&
                            !error &&
                            featuredProducts.length > 0 && (

                                <div className="product-grid">

                                    {featuredProducts.map(
                                        (
                                            product,
                                            index
                                        ) => (

                                            <article
                                                className="product-card"
                                                key={product._id}
                                                style={{
                                                    "--delay":
                                                        `${index * 0.12}s`
                                                }}
                                            >

                                                <Link
                                                    to={`/products/${product._id}`}
                                                    className="product-image"
                                                >

                                                    {product.image ? (

                                                        <img
                                                            src={
                                                                product.image
                                                            }
                                                            alt={
                                                                product.name
                                                            }
                                                        />

                                                    ) : (

                                                        <div className="no-image">
                                                            No Image
                                                        </div>

                                                    )}

                                                    <span className="product-view">
                                                        View Product
                                                        <ArrowRight
                                                            size={14}
                                                        />
                                                    </span>

                                                </Link>


                                                <div className="product-info">

                                                    <span className="product-category">
                                                        {
                                                            product.category
                                                        }
                                                    </span>

                                                    <h3>
                                                        {
                                                            product.name
                                                        }
                                                    </h3>


                                                    <div className="product-price-row">

                                                        <strong>
                                                            Rs.{" "}
                                                            {
                                                                formatPrice(
                                                                    product.price
                                                                )
                                                            }
                                                        </strong>


                                                        <Link
                                                            to={`/products/${product._id}`}
                                                            className="product-arrow"
                                                        >

                                                            <ArrowRight
                                                                size={15}
                                                            />

                                                        </Link>

                                                    </div>

                                                </div>

                                            </article>

                                        )
                                    )}

                                </div>

                            )}

                    </div>

                </section>


                {/* ==================================
                    SECTION 4 — EXPERIENCE
                    ================================== */}

                <section
                    className={`snap-section experience-section ${
                        activeSection === 3
                            ? "section-active"
                            : ""
                    }`}
                    data-index="3"
                >

                    <div className="experience-background"></div>


                    <div className="section-container">

                        <div className="experience-layout">


                            {/* Left */}

                            <div className="experience-text">

                                <p className="section-label">
                                    THE SHOPHUB EXPERIENCE
                                </p>

                                <h2>
                                    Simple shopping.
                                    <span>
                                        Beautiful experience.
                                    </span>
                                </h2>

                                <p className="experience-description">

                                    We keep shopping simple,
                                    clean and convenient so
                                    you can focus on finding
                                    the products you actually need.

                                </p>


                                <Link
                                    to="/products"
                                    className="experience-button"
                                >

                                    Explore ShopHub

                                    <ArrowRight size={17} />

                                </Link>

                            </div>


                            {/* Right */}

                            <div className="experience-features">

                                <article className="experience-card">

                                    <div className="experience-icon">
                                        <Truck size={23} />
                                    </div>

                                    <div>

                                        <span>
                                            01
                                        </span>

                                        <h3>
                                            Easy Shopping
                                        </h3>

                                        <p>
                                            Browse products and
                                            build your cart with ease.
                                        </p>

                                    </div>

                                </article>


                                <article className="experience-card">

                                    <div className="experience-icon">
                                        <ShieldCheck
                                            size={23}
                                        />
                                    </div>

                                    <div>

                                        <span>
                                            02
                                        </span>

                                        <h3>
                                            Secure Account
                                        </h3>

                                        <p>
                                            Your account and
                                            orders stay protected.
                                        </p>

                                    </div>

                                </article>


                                <article className="experience-card">

                                    <div className="experience-icon">
                                        <Sparkles size={23} />
                                    </div>

                                    <div>

                                        <span>
                                            03
                                        </span>

                                        <h3>
                                            Quality Collection
                                        </h3>

                                        <p>
                                            Discover products
                                            selected for everyday needs.
                                        </p>

                                    </div>

                                </article>

                            </div>

                        </div>

                    </div>

                </section>


                {/* ==================================
                    SECTION 5 — CTA
                    ================================== */}

                <section
                    className={`snap-section final-section ${
                        activeSection === 4
                            ? "section-active"
                            : ""
                    }`}
                    data-index="4"
                >

                    <div className="final-orb final-orb-one"></div>
                    <div className="final-orb final-orb-two"></div>


                    <div className="final-content">

                        <div className="final-icon">
                            <ShoppingBag size={28} />
                        </div>

                        <p className="section-label">
                            SHOPHUB
                        </p>

                        <h2>
                            Your next favorite
                            <span>
                                product is waiting.
                            </span>
                        </h2>

                        <p>
                            Explore the collection and
                            discover something you'll love.
                        </p>


                        <Link
                            to="/products"
                            className="final-button"
                        >

                            Start Shopping

                            <ArrowRight size={18} />

                        </Link>

                    </div>


                    <footer className="final-footer">

                        <strong>
                            Shop<span>Hub</span>
                        </strong>

                        <span>
                            © 2026 ShopHub
                        </span>

                    </footer>

                </section>

            </main>


            {/* ==================================
                SIDE NAVIGATION
                ================================== */}

            <div className="section-navigation">

                {[
                    "Home",
                    "Categories",
                    "Products",
                    "Experience",
                    "Shop"
                ].map(
                    (label, index) => (

                        <button
                            key={label}
                            className={
                                activeSection === index
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                goToSection(index)
                            }
                        >

                            <span>
                                {label}
                            </span>

                            <i></i>

                        </button>

                    )
                )}

            </div>


            {/* ==================================
                LEFT / RIGHT ARROWS
                ================================== */}

            {activeSection > 0 && (

                <button
                    className="page-arrow page-arrow-up"
                    onClick={previousSection}
                >
                    ↑
                </button>

            )}

            {activeSection < 4 && (

                <button
                    className="page-arrow page-arrow-down"
                    onClick={nextSection}
                >
                    ↓
                </button>

            )}

        </div>

    );

}

export default Home;