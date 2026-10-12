// ==========================================
// IMPORTS
// ==========================================

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";

import "../styles/AdminProducts.css";


// ==========================================
// ADMIN PRODUCTS COMPONENT
// ==========================================

function AdminProducts() {

    const navigate = useNavigate();

    // ------------------------------------------
    // PRODUCTS STATE
    // ------------------------------------------

    const [products, setProducts] = useState([]);


    // ------------------------------------------
    // LOADING STATE
    // ------------------------------------------

    const [loading, setLoading] = useState(true);


    // ------------------------------------------
    // ERROR STATE
    // ------------------------------------------

    const [error, setError] = useState("");


    // ==========================================
    // GET PRODUCTS FROM BACKEND
    // ==========================================

    useEffect(() => {

        const fetchProducts = async () => {

            try {

                const response = await api.get(
                    "/products"
                );

                setProducts(response.data);

            } catch (error) {

                console.log(
                    "ADMIN PRODUCTS ERROR:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load products"
                );

            } finally {

                setLoading(false);

            }

        };


        fetchProducts();

    }, []);


    // ==========================================
    // LOADING SCREEN
    // ==========================================

    if (loading) {

        return (
            <div className="admin-products">

                <h2>
                    Loading products...
                </h2>

            </div>
        );
    }


    // ==========================================
    // ERROR SCREEN
    // ==========================================

    if (error) {

        return (
            <div className="admin-products">

                <h2>
                    {error}
                </h2>

            </div>
        );
    }









    //deletefunction
    const handleDelete = async(id) =>
    {
        const confirmed = window.confirm("are you sure u wnat to delete this product");

        if(!confirmed)
        {
            return;
        }

        try
        {
            await api.delete(`/products/${id}`)

            setProducts((currentProducts)=>currentProducts.filter((product)=>product._id!==id))
        }catch(error)
        {
            console.log(error);
            alert( error.response?.data?.message ||
            "Failed to delete product")
        }
    }



    // ==========================================
    // MAIN UI
    // ==========================================

    return (

        <div className="admin-products">


            {/* ==================================
                PAGE HEADER
            ================================== */}

            <div className="admin-products-header">

                <div>

                    <p className="admin-page-label">
                        STORE MANAGEMENT
                    </p>

                    <h1>
                        Products
                    </h1>

                    <span>
                        Manage all products in your store
                    </span>

                </div>


                {/* ---------- ADD PRODUCT ---------- */}

                <Link
                    to="/admin/products/new"
                    className="add-product-button"
                >
                    + Add Product
                </Link>

            </div>


            {/* ==================================
                PRODUCTS TABLE
            ================================== */}

            <div className="products-table-container">

                {products.length === 0 ? (

                    <div className="empty-products">

                        <h2>
                            No Products Yet
                        </h2>

                        <p>
                            Add your first product to
                            start building your store.
                        </p>

                        <Link
                            to="/admin/products/new"
                            className="add-product-button"
                        >
                            + Add Product
                        </Link>

                    </div>

                ) : (

                    <table className="products-table">

                        <thead>

                            <tr>

                                <th>
                                    Product
                                </th>

                                <th>
                                    Category
                                </th>

                                <th>
                                    Price
                                </th>

                                <th>
                                    Stock
                                </th>

                                <th>
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {products.map((product) => (

                                <tr
                                    key={product._id}
                                >

                                    {/* PRODUCT */}

                                    <td>

                                        <div className="admin-product-name">

                                            <div className="admin-product-image">

                                                {product.image ? (

                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                    />

                                                ) : (

                                                    <span>
                                                        📦
                                                    </span>

                                                )}

                                            </div>


                                            <div>

                                                <strong>
                                                    {product.name}
                                                </strong>

                                                <small>
                                                    {product.description}
                                                </small>

                                            </div>

                                        </div>

                                    </td>


                                    {/* CATEGORY */}

                                    <td>
                                        {product.category}
                                    </td>


                                    {/* PRICE */}

                                    <td>
                                        Rs. {product.price}
                                    </td>


                                    {/* STOCK */}

                                    <td>

                                        <span className="stock-badge">
                                            {product.stock}
                                        </span>

                                    </td>


                                    {/* ACTIONS */}

                                    <td>

                                        <div className="product-actions">

                                           <button
    onClick={() =>
        navigate(
            `/admin/products/edit/${product._id}`
        )
    }
>
                                                Edit
                                            </button>

                                            <button onClick={()=>handleDelete(product._id)}>
                                                Delete
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                )}

            </div>

        </div>
    );
}

export default AdminProducts;