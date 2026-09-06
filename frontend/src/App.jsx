import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";

import UserDashboard from "./pages/UserDashboard";
import UserPassword from "./pages/UserPassword";

import OwnerDashboard from "./pages/OwnerDashboard";
import OwnerPassword from "./pages/OwnerPassword";

import AdminDashboard from "./pages/AdminDashboard";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/"
                    element={<LandingPage />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/user"
                    element={
                        <ProtectedRoute allowedRoles={["user"]}>
                            <UserDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/user/password"
                    element={
                        <ProtectedRoute allowedRoles={["user"]}>
                            <UserPassword />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/owner"
                    element={
                        <ProtectedRoute allowedRoles={["store_owner"]}>
                            <OwnerDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/owner/password"
                    element={
                        <ProtectedRoute allowedRoles={["store_owner"]}>
                            <OwnerPassword />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;