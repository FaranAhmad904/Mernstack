import { useEffect, useState } from "react";
import {
    Link,
    useNavigate,
    useParams
} from "react-router-dom";

import api from "../services/api";

import "../styles/ProductDetails.css"
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";



function ProductDetails()
{
    const {id} = useParams();
     // Used to go back
    const navigate = useNavigate();

    const { dispatch } = useCart();


    // ==========================================
    // STATES
    // ==========================================

    const [product, setProduct] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    useEffect(()=>
    {
        const fetchProduct = async ()=>
        {
            try{
                const response = await api.get(`/products/${id}`)

                setProduct(response.data)
            }catch(error)
            {
                 console.log(
        "PRODUCT DETAILS ERROR:",
        error
    );

    setError(
        error.response?.data?.message ||
        "Failed to load product"
    );
            }finally
            {
                setLoading(false)
            }
        };
        fetchProduct();
    },[id]);

    if(loading)
    {
        return (
            <div className="product-details-page">
                <h2>Loading Products</h2>
            </div>
        )
    }

    if(error)
    {
        return(
            <div className="product-details-page">

                <h2>
                    {error}
                </h2>

                <button
                    onClick={() =>
                        navigate("/products")
                    }
                >
                    ← Back to Products
                </button>

            </div>
        )

    }

    const handleAddToCart = async () => {

    try {

        // ==========================================
        // SEND PRODUCT TO BACKEND
        // ==========================================

        const response = await api.post(
            "/cart",
            {
                productId: product._id,
                quantity: 1
            }
        );


        // ==========================================
        // UPDATE REACT CART STATE
        // ==========================================

        dispatch({
            type: "SET_CART",
            payload: response.data.cart
        });


        // ==========================================
        // SUCCESS MESSAGE
        // ==========================================

        alert("Product added to cart!");

    } catch (error) {

        // ==========================================
        // ERROR
        // ==========================================

        console.error(
            "ADD TO CART ERROR:",
            error
        );

        alert(
            error.response?.data?.message ||
            "Unable to add product to cart"
        );
    }
};


   // ==========================================
// UI
// ==========================================

return (

    <>

        {/* NAVBAR */}

        <Navbar />


        {/* PRODUCT DETAILS */}

        <div className="product-details-page">

            {/* BREADCRUMB */}

            <div className="product-breadcrumb">

                <Link to="/">
                    Home
                </Link>

                <span> / </span>

                <Link to="/products">
                    Products
                </Link>

                <span> / </span>

                <strong>
                    {product.name}
                </strong>

            </div>


            {/* BACK BUTTON */}

            <button
                className="details-back-button"
                onClick={() =>
                    navigate("/products")
                }
            >
                Back to Products
            </button>


            {/* PRODUCT */}

            <div className="product-details-container">

                {/* IMAGE */}

                <div className="product-details-image">

                    {product.image ? (

                        <img
                            src={product.image}
                            alt={product.name}
                        />

                    ) : (

                        <span>
                            No Image
                        </span>

                    )}

                </div>


                {/* INFORMATION */}

                <div className="product-details-info">

                    <p className="details-category">
                        {product.category}
                    </p>


                    <h1>
                        {product.name}
                    </h1>


                    <p className="details-description">
                        {product.description}
                    </p>


                    <div className="details-price">
                        Rs. {product.price}
                    </div>


                    <div className="details-stock">

                        {product.stock > 0 ? (

                            <span className="in-stock">
                                ✓ In Stock ({product.stock} available)
                            </span>

                        ) : (

                            <span className="out-of-stock">
                                ✕ Out of Stock
                            </span>

                        )}

                    </div>


                    <button
                        className="add-to-cart-button"
                        disabled={product.stock === 0}
                        onClick={handleAddToCart}
                    >
                         Add to Cart
                    </button>

                </div>

            </div>


            {/* PRODUCT INFORMATION SECTION */}

            <div className="product-extra-section">

                <h2>
                    Product Information
                </h2>

                <p>
                    Shop confidently with ShopHub.
                    This product is available for
                    purchase while stock lasts.
                </p>

            </div>


            {/* FOOTER */}

            <footer className="shop-footer">

                <h2>
                    Shop<span>Hub</span>
                </h2>

                <p>
                    Your simple and reliable online store.
                </p>

                <div>
                    © 2026 ShopHub. All rights reserved.
                </div>

            </footer>

        </div>

    </>

);
}
export default ProductDetails