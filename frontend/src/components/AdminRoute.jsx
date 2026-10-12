import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminRoute({ children }) {

    const { user } = useAuth();

    // User is not logged in
    if (!user) {
        return <Navigate to="/login" />;
    }

    // User is logged in but is not an admin
    if (user.role !== "ADMIN") {
        return <Navigate to="/" />;
    }

    // User is an admin
    return children;
}

export default AdminRoute;