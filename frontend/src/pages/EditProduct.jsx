// ==========================================
// IMPORTS
// ==========================================

import { useEffect, useState } from "react";
import {
    useNavigate,
    useParams
} from "react-router-dom";

import api from "../services/api";

import "../styles/AddProduct.css";


// ==========================================
// EDIT PRODUCT COMPONENT
// ==========================================

function EditProduct() {

    // Get product ID from URL
    const { id } = useParams();

    // Used for navigation
    const navigate = useNavigate();


    // ==========================================
    // FORM STATE
    // ==========================================

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        image: ""
    });


    // ==========================================
    // PAGE STATES
    // ==========================================

    const [loading, setLoading] = useState(true);

    const [message, setMessage] = useState("");

    const [error, setError] = useState("");


    // ==========================================
    // GET PRODUCT
    // ==========================================

    useEffect(() => {

        const fetchProduct = async () => {

            try {

                const response = await api.get(
                    `/products/${id}`
                );

                const product = response.data;


                // Put existing product data
                // into the form
                setFormData({
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    category: product.category,
                    stock: product.stock,
                    image: product.image || ""
                });

            } catch (error) {

                console.log(
                    "EDIT PRODUCT ERROR:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load product"
                );

            } finally {

                setLoading(false);

            }
        };


        fetchProduct();

    }, [id]);


    // ==========================================
    // HANDLE INPUT CHANGES
    // ==========================================

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });

    };


    // ==========================================
    // UPDATE PRODUCT
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");


        try {

            const response = await api.put(
                `/products/${id}`,
                {
                    name: formData.name,
                    description: formData.description,
                    price: Number(formData.price),
                    category: formData.category,
                    stock: Number(formData.stock),
                    image: formData.image
                }
            );


            console.log(
                "PRODUCT UPDATED:",
                response.data
            );


            setMessage(
                "Product updated successfully!"
            );


            // Go back to products page
            setTimeout(() => {

                navigate("/admin/products");

            }, 1000);


        } catch (error) {

            console.log(
                "UPDATE PRODUCT ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to update product"
            );

        }

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <div className="add-product-page">

                <h2>
                    Loading product...
                </h2>

            </div>
        );

    }


    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="add-product-page">

            {/* PAGE HEADER */}

            <div className="add-product-header">

                <div>

                    <p className="admin-page-label">
                        STORE MANAGEMENT
                    </p>

                    <h1>
                        Edit Product
                    </h1>

                    <span>
                        Update product information
                    </span>

                </div>


                {/* BACK BUTTON */}

                <button
                    className="back-button"
                    onClick={() =>
                        navigate("/admin/products")
                    }
                >
                    ← Back to Products
                </button>

            </div>


            {/* ERROR */}

            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}


            {/* FORM */}

            <form
                className="add-product-form"
                onSubmit={handleSubmit}
            >

                {/* PRODUCT NAME */}

                <div className="form-group">

                    <label htmlFor="name">
                        Product Name
                    </label>

                    <input
                        id="name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />

                </div>


                {/* DESCRIPTION */}

                <div className="form-group">

                    <label htmlFor="description">
                        Description
                    </label>

                    <textarea
                        id="description"
                        name="description"
                        rows="5"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />

                </div>


                {/* PRICE + CATEGORY */}

                <div className="form-row">

                    <div className="form-group">

                        <label htmlFor="price">
                            Price
                        </label>

                        <input
                            id="price"
                            type="number"
                            name="price"
                            min="0"
                            value={formData.price}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label htmlFor="category">
                            Category
                        </label>

                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >

                            <option value="">
                                Select Category
                            </option>

                            <option value="Electronics">
                                Electronics
                            </option>

                            <option value="Clothing">
                                Clothing
                            </option>

                            <option value="Shoes">
                                Shoes
                            </option>

                            <option value="Accessories">
                                Accessories
                            </option>

                        </select>

                    </div>

                </div>


                {/* STOCK */}

                <div className="form-group">

                    <label htmlFor="stock">
                        Stock
                    </label>

                    <input
                        id="stock"
                        type="number"
                        name="stock"
                        min="0"
                        value={formData.stock}
                        onChange={handleChange}
                        required
                    />

                </div>


                {/* IMAGE */}

                <div className="form-group">

                    <label htmlFor="image">
                        Image URL
                    </label>

                    <input
                        id="image"
                        type="text"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                    />

                </div>


                {/* SUCCESS MESSAGE */}

                {message && (
                    <p className="success-message">
                        {message}
                    </p>
                )}


                {/* UPDATE BUTTON */}

                <button
                    type="submit"
                    className="submit-product-button"
                >
                    Update Product
                </button>

            </form>

        </div>
    );
}

export default EditProduct;