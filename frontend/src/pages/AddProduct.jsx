import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

import "../styles/AddProduct.css";


function AddProduct()
{
    const navigate = useNavigate();

     const [formData, setFormData] = useState({

        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        image: ""

    });

     const [message, setMessage] = useState("");

    const [error, setError] = useState("");

    const handleChange = (e) =>
    {
        setFormData({
            ...formData,

            [e.target.name]:e.target.value
        })
    }


    const handleSubmit = async (e) =>
    {
        e.preventDefault();

        setMessage("");
        setError("");

        try{
            const response = await api.post("/products",
                {
                    name: formData.name,
                    description: formData.description,
                    price: Number(formData.price),
                    category: formData.category,
                    stock: Number(formData.stock),
                    image: formData.image

                }
            );
            console.log("Product Created",response.data);

            setMessage("Product added successfully")


            setFormData({
                 name: "",
                description: "",
                price: "",
                category: "",
                stock: "",
                image: ""
            })

            setTimeout(()=>
            {
                navigate("/admin/products");

            },1000);
        }catch(error)
        {
            console.log("ADD PRODUCT ERROR:",error)
             setError(

                error.response?.data?.message ||

                "Failed to add product"

            );
        }
    }

    return (
        <div className="add-product-page">
            <div className="add-product-header">
                <div>
                    <p className="admin-page-label">
                        STORE MANAGEMENT
                    </p>

                    <h1>
                        Add Product
                    </h1>

                    <span>
                        Add a new product to your store
                    </span>
                </div>

                <button className="back-button" onClick={()=>navigate("/admin/products")}>Back to Products</button>
            </div>

            <form className="add-product-form" onSubmit={handleSubmit}>

                <div className="form-group">
                    <label htmlFor="name">Product Name</label>
                    <input type="text" id="name" name="name" placeholder="Enter product name" value={formData.name} onChange={handleChange} required/>
                </div>

                <div className="form-group">
                    <label htmlFor="description">
                        Description
                    </label>
                     <textarea
                        id="description"
                        name="description"
                        placeholder="Enter product description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="5"
                        required
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="price">Price</label>
                        
                         <input
                            id="price"
                            type="number"
                            name="price"
                            placeholder="Enter price"
                            value={formData.price}
                            onChange={handleChange}
                            min="0"
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
                <div className="form-group">

                    <label htmlFor="stock">
                        Stock
                    </label>

                    <input
                        id="stock"
                        type="number"
                        name="stock"
                        placeholder="Enter available stock"
                        value={formData.stock}
                        onChange={handleChange}
                        min="0"
                        required
                    />

                </div>

                  <div className="form-group">

                    <label htmlFor="image">
                        Image URL
                    </label>

                    <input
                        id="image"
                        type="text"
                        name="image"
                        placeholder="https://example.com/product.jpg"
                        value={formData.image}
                        onChange={handleChange}
                    />

                </div>

                {message && (

                    <p className="success-message">
                        {message}
                    </p>

                )}

                  {error && (

                    <p className="error-message">
                        {error}
                    </p>

                )}

            <button type="submit" className="submit-product-button">
                Add Product
            </button>
            </form>
        </div>
    );
}
export default AddProduct;