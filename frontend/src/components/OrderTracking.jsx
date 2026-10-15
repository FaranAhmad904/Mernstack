// ==========================================
// IMPORTS
// ==========================================

import {
    CheckCircle2,
    Circle,
    Package,
    Truck,
    XCircle
} from "lucide-react";

import "../styles/OrderTracking.css";


// ==========================================
// ORDER TRACKING COMPONENT
// ==========================================

function OrderTracking({ order, onCancel, cancelling })
{
    const statuses = [
        {
            name: "Pending",
            description: "Your order has been received.",
            icon: Package
        },
        {
            name: "Processing",
            description: "Your order is being prepared.",
            icon: Package
        },
        {
            name: "Shipped",
            description: "Your order is on its way.",
            icon: Truck
        },
        {
            name: "Delivered",
            description: "Your order has been delivered.",
            icon: CheckCircle2
        }
    ];


    const currentIndex = statuses.findIndex(
        (item) => item.name === order.status
    );


    // ESTIMATED DELIVERY: FIVE DAYS AFTER ORDER PLACEMENT

    const estimatedDelivery = new Date(order.createdAt);

    estimatedDelivery.setDate(
        estimatedDelivery.getDate() + 5
    );


    const formattedDeliveryDate = estimatedDelivery.toLocaleDateString(
        "en-PK",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );


    const canCancel = [
        "Pending",
        "Processing"
    ].includes(order.status);


    // CANCELLED ORDER VIEW

    if (order.status === "Cancelled")
    {
        return (

            <div className="order-tracking-panel">

                <div className="tracking-cancelled">

                    <XCircle size={23} />

                    <div>

                        <strong>
                            Order Cancelled
                        </strong>

                        <p>
                            This order has been cancelled.
                        </p>

                    </div>

                </div>

            </div>

        );
    }


    // TRACKING TIMELINE

    return (

        <div className="order-tracking-panel">


            {/* TRACKING HEADER */}

            <div className="tracking-header">

                <div>

                    <h3>
                        <Truck size={20} />

                        Track Your Order
                    </h3>

                    <p>
                        Follow your order's progress.
                    </p>

                </div>

                <span className="tracking-status">
                    {order.status}
                </span>

            </div>


            {/* TIMELINE */}

            <div className="tracking-timeline">

                {statuses.map((status, index) =>
                {
                    const Icon = status.icon;

                    const completed = currentIndex >= index;

                    const current = currentIndex === index;


                    return (

                        <div
                            className={`tracking-step ${
                                completed
                                    ? "tracking-step-completed"
                                    : ""
                            } ${
                                current
                                    ? "tracking-step-current"
                                    : ""
                            }`}
                            key={status.name}
                        >

                            <div className="tracking-step-marker">

                                {completed
                                    ? <Icon size={18} />
                                    : <Circle size={18} />
                                }

                            </div>


                            <div className="tracking-step-content">

                                <strong>
                                    {status.name}
                                </strong>

                                <p>
                                    {status.description}
                                </p>

                            </div>

                        </div>

                    );
                })}

            </div>


            {/* DELIVERY ESTIMATE */}

            {order.status !== "Delivered" && (

                <div className="tracking-estimate">

                    <Package size={20} />

                    <div>

                        <span>
                            Estimated delivery
                        </span>

                        <strong>
                            {formattedDeliveryDate}
                        </strong>

                    </div>

                </div>

            )}


            {/* CANCELLATION */}

            {canCancel && (

                <div className="tracking-cancel-section">

                    <p>
                        Changed your mind? You can cancel before the order ships.
                    </p>

                    <button
                        type="button"
                        className="tracking-cancel-button"
                        onClick={onCancel}
                        disabled={cancelling}
                    >

                        <XCircle size={17} />

                        {cancelling
                            ? "Cancelling..."
                            : "Cancel Order"
                        }

                    </button>

                </div>

            )}

        </div>

    );
}


export default OrderTracking;