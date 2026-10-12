import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/OrderSuccess.css";

function OrderSuccess() {

    const { orderId } = useParams();

    return (
        <>
            <Navbar />

            <div className="order-success-page">

                <div className="success-card">

                    <div className="success-icon">
                        ✓
                    </div>

                    <h1>Order Placed Successfully!</h1>

                    <p className="success-message">
                        Thank you for your order. Your order has been
                        successfully placed.
                    </p>

                    <div className="order-info">

                        <p>
                            <strong>Order ID:</strong>
                        </p>

                        <span>
                            {orderId}
                        </span>

                    </div>

                    <p className="cod-message">
                        Payment Method: <strong>Cash on Delivery</strong>
                    </p>

                    <div className="success-buttons">

                        <Link
                            to="/products"
                            className="continue-shopping"
                        >
                            Continue Shopping
                        </Link>

                        <Link
                            to="/"
                            className="back-home"
                        >
                            Back to Home
                        </Link>

                    </div>

                </div>

            </div>
        </>
    );
}

export default OrderSuccess;