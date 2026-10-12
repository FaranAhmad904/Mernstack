// ==========================================
// IMPORTS
// ==========================================

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api";
import Navbar from "../components/Navbar";

import "../styles/Products.css";


// ==========================================
// PRODUCTS PAGE
// ==========================================

function Products() {

    // ==========================================
    // STATE
    // ==========================================

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // ==========================================
    // FETCH PRODUCTS
    // ==========================================

    useEffect(() => {

        const fetchProducts = async () => {

            try {

                setLoading(true);
                setError("");

                const response = await api.get("/products");

                console.log("PRODUCTS RESPONSE:", response.data);

                // Handle both possible backend response formats
                if (Array.isArray(response.data)) {

                    setProducts(response.data);

                } else if (Array.isArray(response.data.products)) {

                    setProducts(response.data.products);

                } else {

                    setProducts([]);

                }

            } catch (error) {

                console.error("PRODUCTS ERROR:", error);

                setError(
                    error.response?.data?.message ||
                    "Failed to load products."
                );

            } finally {

                setLoading(false);

            }

        };

        fetchProducts();

    }, []);


    // ==========================================
    // PRICE FORMAT
    // ==========================================

    const formatPrice = (price) => {

        return Number(price || 0).toLocaleString("en-PK");

    };


    // ==========================================
    // RETURN
    // ==========================================

    return (

        <div className="products-page">

            <Navbar />


            {/* ==========================================
                PAGE HEADER
            ========================================== */}

            <section className="products-header">

                <div>

                    <p className="products-label">
                        SHOPHUB COLLECTION
                    </p>

                    <h1>
                        All Products
                    </h1>

                    <p>
                        Explore our complete collection
                        and find something you love.
                    </p>

                </div>

            </section>


            {/* ==========================================
                PRODUCTS CONTENT
            ========================================== */}

            <main className="products-container">

                {/* LOADING */}

                {loading && (

                    <div className="products-message">

                        <h2>
                            Loading products...
                        </h2>

                        <p>
                            Please wait while we load the
                            latest products.
                        </p>

                    </div>

                )}


                {/* ERROR */}

                {!loading && error && (

                    <div className="products-message error">

                        <h2>
                            Unable to load products
                        </h2>

                        <p>
                            {error}
                        </p>

                    </div>

                )}


                {/* NO PRODUCTS */}

                {!loading &&
                    !error &&
                    products.length === 0 && (

                    <div className="products-message">

                        <h2>
                            No products found
                        </h2>

                        <p>
                            There are currently no products
                            available.
                        </p>

                    </div>

                )}


                {/* PRODUCTS */}

                {!loading &&
                    !error &&
                    products.length > 0 && (

                    <div className="products-grid">

                        {products.map((product) => (

                            <article
                                className="shop-product-card"
                                key={product._id}
                            >

                                {/* IMAGE */}

                                <Link
                                    to={`/products/${product._id}`}
                                    className="shop-product-image"
                                >

                                    {product.image ? (

                                        <img
                                            src={product.image}
                                            alt={product.name}
                                        />

                                    ) : (

                                        <div className="shop-no-image">
                                            No Image
                                        </div>

                                    )}

                                </Link>


                                {/* INFO */}

                                <div className="shop-product-info">

                                    <span className="shop-product-category">
                                        {product.category}
                                    </span>

                                    <h2>
                                        {product.name}
                                    </h2>

                                    <p>
                                        {product.description}
                                    </p>


                                    <div className="shop-product-bottom">

                                        <strong>
                                            Rs.{" "}
                                            {formatPrice(product.price)}
                                        </strong>

                                        <Link
                                            to={`/products/${product._id}`}
                                            className="shop-view-button"
                                        >
                                            View Product
                                        </Link>

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

export default Products;