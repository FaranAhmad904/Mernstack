// ==========================================
// IMPORTS
// ==========================================

import {
    useEffect,
    useRef,
    useState
} from "react";

import {
    Link
} from "react-router-dom";

import {
    ArrowRight,
    ShoppingBag,
    ChevronDown,
    ShieldCheck,
    Truck,
    Star,
    Zap
} from "lucide-react";

import api from "../services/api";

import Navbar from "../components/Navbar";

import "../styles/Home.css";


// ==========================================
// HOME COMPONENT
// ==========================================

function Home()
{
    // ==========================================
    // STATES
    // ==========================================

    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [activeSection, setActiveSection] = useState(0);

    const [heroIndex, setHeroIndex] = useState(0);

    const containerRef = useRef(null);


    // ==========================================
    // HERO SLIDES
    // ==========================================

    const heroSlides = [
        {
            title: "Upgrade Your Everyday",
            subtitle: "Smart tech and gadgets for work, play and everything between",
            image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1200&q=90",
            position: "center 50%"
        },

        {
            title: "Details That Stand Out",
            subtitle: "Accessories that finish every look",
            image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1600&q=90",
            position: "center 50%"
        },

        {
            title: "Walk Your Own Way",
            subtitle: "Comfort and confidence in every step",
            image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=2400&q=90",
            position: "center 55%"
        },

        {
            title: "New Season Arrivals",
            subtitle: "Fresh styles and everyday favorites, just landed",
            image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=90",
            position: "center 50%"
        },

        {
            title: "Made for Modern Life",
            subtitle: "Wearable tech that keeps up with you",
            image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=90",
            position: "center 50%"
        }
    ];


    // ==========================================
    // CATEGORIES
    // ==========================================

    const categories = [
        {
            name: "Electronics",
            image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=90",
            description: "Technology for everyday life"
        },

        {
            name: "Clothing",
            image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=90",
            description: "Find your personal style"
        },

        {
            name: "Shoes",
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=90",
            description: "Step out with confidence"
        },

        {
            name: "Accessories",
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=90",
            description: "Complete your look"
        }
    ];


    // ==========================================
    // FETCH PRODUCTS FROM BACKEND
    // ==========================================

    useEffect(() =>
    {
        const fetchProducts = async () =>
        {
            try
            {
                setLoading(true);

                const response = await api.get("/products");

                const productData = Array.isArray(response.data)
                    ? response.data
                    : response.data.products || [];

                setProducts(productData);

                setError("");
            }
            catch (err)
            {
                console.error("Error fetching products:", err);

                setError("Unable to load products. Please try again later.");
            }
            finally
            {
                setLoading(false);
            }
        };

        fetchProducts();

    }, []);


    // ==========================================
    // OBSERVE ACTIVE SLIDE
    // ==========================================

    useEffect(() =>
    {
        const container = containerRef.current;

        if (!container)
        {
            return;
        }

        const sections = container.querySelectorAll(".snap-section");

        const observer = new IntersectionObserver(
            (entries) =>
            {
                entries.forEach((entry) =>
                {
                    if (entry.isIntersecting)
                    {
                        setActiveSection(
                            Number(entry.target.dataset.index)
                        );
                    }
                });
            },
            {
                root: container,
                threshold: 0.55
            }
        );

        sections.forEach((section) =>
        {
            observer.observe(section);
        });

        return () =>
        {
            observer.disconnect();
        };

    }, []);


    // ==========================================
    // AUTO CHANGE HERO IMAGE
    // ==========================================

    useEffect(() =>
    {
        const timer = setTimeout(() =>
        {
            setHeroIndex((current) => (current + 1) % heroSlides.length);
        }, 5500);

        return () =>
        {
            clearTimeout(timer);
        };

    }, [heroIndex, heroSlides.length]);


    // ==========================================
    // FEATURED PRODUCTS
    // ==========================================

    const featuredProducts = products.slice(0, 4);


    // ==========================================
    // FORMAT PRICE
    // ==========================================

    const formatPrice = (price) =>
    {
        return Number(price || 0).toLocaleString("en-PK");
    };


    // ==========================================
    // SCROLL TO SPECIFIC SLIDE
    // ==========================================

    const goToSection = (index) =>
    {
        const container = containerRef.current;

        if (!container)
        {
            return;
        }

        const section = container.querySelector(
            `[data-index="${index}"]`
        );

        if (section)
        {
            section.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    };


    // ==========================================
    // NEXT AND PREVIOUS SLIDES
    // ==========================================

    const nextSection = () =>
    {
        goToSection(Math.min(activeSection + 1, 4));
    };

    const previousSection = () =>
    {
        goToSection(Math.max(activeSection - 1, 0));
    };


    // ==========================================
    // HOME PAGE UI
    // ==========================================

    return (
        <div className="home-page">

            {/* ======================================
                NAVBAR
            ====================================== */}

            <Navbar
                overlay
                transparent={activeSection === 0}
            />


            {/* ======================================
                HOME SLIDES
            ====================================== */}

            <main
                className="home-snap-container"
                ref={containerRef}
            >

                {/* ======================================
                    SLIDE 1 - FULL SCREEN CATEGORY HERO
                ====================================== */}

                <section
                    className="snap-section hero-section"
                    data-index="0"
                >

                    <div className="hero-banner">

                        {heroSlides.map((slide, index) => (

                            <div
                                key={slide.title}
                                className={
                                    heroIndex === index
                                        ? "hero-slide active"
                                        : "hero-slide"
                                }
                                aria-hidden={heroIndex !== index}
                            >

                                <img
                                    className="hero-slide-image"
                                    src={slide.image}
                                    alt={slide.title}
                                    style={{ objectPosition: slide.position }}
                                    loading={index === 0 ? "eager" : "lazy"}
                                />

                                <div className="hero-banner-overlay"></div>


                                {/* Centered text only */}

                                <div className="hero-slide-content">

                                    <h1>
                                        {slide.title}
                                    </h1>

                                    <p>
                                        {slide.subtitle}
                                    </p>

                                </div>

                            </div>

                        ))}


                        {/* Dots */}

                        <div className="hero-dots">

                            {heroSlides.map((slide, index) => (

                                <button
                                    key={slide.title}
                                    className={
                                        heroIndex === index
                                            ? "hero-dot active"
                                            : "hero-dot"
                                    }
                                    onClick={() => setHeroIndex(index)}
                                    aria-label={`Show slide ${index + 1}`}
                                />

                            ))}

                        </div>

                    </div>

                </section>


                {/* ======================================
                    SLIDE 2 - CATEGORIES
                ====================================== */}

                <section
                    className={`snap-section categories-section${activeSection === 1 ? " is-active" : ""}`}
                    data-index="1"
                >

                    <div className="section-header reveal">

                        <div className="section-header-text">

                            <h2>
                                Shop by category
                            </h2>

                            <p>
                                Find the things you love, all in one place.
                            </p>

                        </div>

                        <Link
                            to="/products"
                            className="btn btn-outline btn-sm"
                        >
                            View all products

                            <ArrowRight size={17} />
                        </Link>

                    </div>


                    <div className="categories-grid">

                        {categories.map((category, index) => (

                            <Link
                                to={`/products?category=${encodeURIComponent(category.name)}`}
                                className="category-card reveal"
                                style={{ "--i": index + 1 }}
                                key={category.name}
                            >

                                <div className="category-media">

                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="category-image"
                                    />

                                </div>

                                <div className="category-caption">

                                    <div>

                                        <h3>
                                            {category.name}
                                        </h3>

                                        <p>
                                            {category.description}
                                        </p>

                                    </div>

                                    <span className="category-arrow">
                                        <ArrowRight size={19} />
                                    </span>

                                </div>

                            </Link>

                        ))}

                    </div>

                </section>


                {/* ======================================
                    SLIDE 3 - FEATURED PRODUCTS
                ====================================== */}

                <section
                    className={`snap-section products-section${activeSection === 2 ? " is-active" : ""}`}
                    data-index="2"
                >

                    <div className="section-header reveal">

                        <div className="section-header-text">

                            <h2>
                                Featured products
                            </h2>

                            <p>
                                Take a look at some of our latest products.
                            </p>

                        </div>

                        <Link
                            to="/products"
                            className="btn btn-outline btn-sm"
                        >
                            View all products

                            <ArrowRight size={17} />
                        </Link>

                    </div>


                    {loading ? (

                        <div className="products-message reveal">
                            <div className="loading-spinner"></div>

                            <p>
                                Loading products...
                            </p>
                        </div>

                    ) : error ? (

                        <div className="products-message error-message reveal">
                            <p>{error}</p>
                        </div>

                    ) : featuredProducts.length > 0 ? (

                        <div className="products-grid">

                            {featuredProducts.map((product, index) => (

                                <Link
                                    to={`/products/${product._id}`}
                                    className="product-card reveal"
                                    style={{ "--i": index + 1 }}
                                    key={product._id}
                                >

                                    <div className="product-media">

                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="product-image"
                                        />

                                        <span className="product-badge">
                                            New
                                        </span>

                                        <span className="product-cta">
                                            View product

                                            <ArrowRight size={17} />
                                        </span>

                                    </div>


                                    <div className="product-details">

                                        <span className="product-category">
                                            {product.category}
                                        </span>

                                        <h3>
                                            {product.name}
                                        </h3>

                                        <p className="product-price">
                                            <span>PKR</span>{" "}
                                            {formatPrice(product.price)}
                                        </p>

                                    </div>

                                </Link>

                            ))}

                        </div>

                    ) : (

                        <div className="products-message reveal">
                            <ShoppingBag size={35} />

                            <h3>
                                Products are coming soon
                            </h3>

                            <p>
                                Check back later to explore our collection.
                            </p>
                        </div>

                    )}

                </section>


                {/* ======================================
                    SLIDE 4 - SHOPPING EXPERIENCE
                ====================================== */}

                <section
                    className={`snap-section experience-section${activeSection === 3 ? " is-active" : ""}`}
                    data-index="3"
                >

                    <div className="experience-top reveal">

                        <div>

                            <span className="dark-label">
                                The ShopHub experience
                            </span>

                            <h2>
                                Shopping made simple.
                            </h2>

                        </div>


                        <div className="experience-top-text">

                            <p>
                                Everything you need for a smooth and
                                enjoyable shopping experience, from
                                browsing to checkout.
                            </p>

                            <Link
                                to="/products"
                                className="btn btn-light"
                            >
                                Explore Products

                                <ArrowRight size={19} />
                            </Link>

                        </div>

                    </div>


                    <div className="experience-grid">

                        <div
                            className="experience-item reveal"
                            style={{ "--i": 1 }}
                        >

                            <Zap size={30} strokeWidth={1.6} />

                            <h3>
                                Easy Shopping
                            </h3>

                            <p>
                                Explore categories and discover products
                                with a simple, convenient experience.
                            </p>

                        </div>


                        <div
                            className="experience-item reveal"
                            style={{ "--i": 2 }}
                        >

                            <ShieldCheck size={30} strokeWidth={1.6} />

                            <h3>
                                Your Account
                            </h3>

                            <p>
                                Access your account and manage your
                                shopping activity in one place.
                            </p>

                        </div>


                        <div
                            className="experience-item reveal"
                            style={{ "--i": 3 }}
                        >

                            <Star size={30} strokeWidth={1.6} />

                            <h3>
                                Quality Collection
                            </h3>

                            <p>
                                Browse a growing collection of products
                                across different categories.
                            </p>

                        </div>


                        <div
                            className="experience-item reveal"
                            style={{ "--i": 4 }}
                        >

                            <Truck size={30} strokeWidth={1.6} />

                            <h3>
                                Shop with Ease
                            </h3>

                            <p>
                                Find what you need without the hassle
                                of searching across multiple stores.
                            </p>

                        </div>

                    </div>

                </section>


                {/* ======================================
                    SLIDE 5 - FINAL BANNER + FOOTER
                ====================================== */}

                <section
                    className={`snap-section final-section${activeSection === 4 ? " is-active" : ""}`}
                    data-index="4"
                >

                    <div className="final-banner reveal">

                        <img
                            className="final-banner-image"
                            src="https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=2000&q=90"
                            alt="Shop the latest collection"
                        />

                        <div className="final-banner-overlay"></div>

                        <div className="final-banner-content">

                            <span className="dark-label">
                                Your next favorite is waiting
                            </span>

                            <h2>
                                Ready to find something amazing?
                            </h2>

                            <p>
                                Explore our collection and find products
                                that fit your style and everyday needs.
                            </p>

                            <Link
                                to="/products"
                                className="btn btn-light"
                            >
                                Start Shopping

                                <ArrowRight size={19} />
                            </Link>

                        </div>

                    </div>


                    {/* Footer */}

                    <footer
                        className="home-footer reveal"
                        style={{ "--i": 2 }}
                    >

                        <div className="footer-top">

                            <div className="footer-about">

                                <Link
                                    to="/"
                                    className="footer-brand"
                                >
                                    <ShoppingBag size={22} />

                                    <span>
                                        Shop<span>Hub</span>
                                    </span>
                                </Link>

                                <p>
                                    Discover more. Shop better.
                                </p>

                            </div>


                            <div className="footer-column">

                                <h4>Shop</h4>

                                {categories.map((category) => (

                                    <Link
                                        key={category.name}
                                        to={`/products?category=${encodeURIComponent(category.name)}`}
                                    >
                                        {category.name}
                                    </Link>

                                ))}

                            </div>


                            <div className="footer-column">

                                <h4>Account</h4>

                                <Link to="/my-orders">
                                    My Orders
                                </Link>

                                <Link to="/wishlist">
                                    Wishlist
                                </Link>

                                <Link to="/cart">
                                    Cart
                                </Link>

                            </div>

                        </div>


                        <div className="footer-bottom">

                            <span>
                                © {new Date().getFullYear()} ShopHub.
                                All rights reserved.
                            </span>

                        </div>

                    </footer>

                </section>

            </main>


            {/* ======================================
                SLIDE NAVIGATION
            ====================================== */}

            <div className="home-section-navigation">

                {[
                    "Home",
                    "Categories",
                    "Products",
                    "Experience",
                    "Shop"
                ].map((label, index) => (

                    <button
                        key={label}
                        className={
                            activeSection === index
                                ? "section-nav-dot active"
                                : "section-nav-dot"
                        }
                        onClick={() => goToSection(index)}
                        aria-label={`Go to ${label}`}
                        title={label}
                    >

                        <span className="section-nav-tooltip">
                            {label}
                        </span>

                    </button>

                ))}

            </div>


            {/* ======================================
                PREVIOUS / NEXT NAVIGATION
            ====================================== */}

            <div className="home-arrow-navigation">

                <button
                    onClick={previousSection}
                    disabled={activeSection === 0}
                    aria-label="Previous slide"
                    title="Previous slide"
                >
                    <ChevronDown
                        size={20}
                        className="arrow-up"
                    />
                </button>

                <button
                    onClick={nextSection}
                    disabled={activeSection === 4}
                    aria-label="Next slide"
                    title="Next slide"
                >
                    <ChevronDown size={20} />
                </button>

            </div>

        </div>
    );
}


// ==========================================
// EXPORT HOME COMPONENT
// ==========================================

export default Home;