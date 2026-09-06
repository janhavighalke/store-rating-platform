import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
        return <Navigate to="/" replace />;
    }

    const user = JSON.parse(userData);

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        if (user.role === "admin") {
            return <Navigate to="/admin" replace />;
        }

        if (user.role === "store_owner") {
            return <Navigate to="/owner" replace />;
        }

        return <Navigate to="/user" replace />;
    }

    return children;
}

export default ProtectedRoute;