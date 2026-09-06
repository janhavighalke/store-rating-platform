import { useEffect, useState } from "react";
import {
    Star,
    LogOut,
    Lock,
    User,
    Store,
    Mail,
    MapPin,
    CalendarDays,
    Users,
    RefreshCw
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./OwnerDashboard.css";

const getRatingDescription = (rating) => {
    const value = Number(rating);

    if (value >= 4.5) return "Excellent";
    if (value >= 3.5) return "Very Good";
    if (value >= 2.5) return "Good";
    if (value >= 1.5) return "Fair";
    if (value > 0) return "Poor";

    return "Not Rated";
};

const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "—";
    }

    return parsedDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
};

const getInitials = (name) => {
    if (!name) return "U";

    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((word) => word.charAt(0))
        .join("")
        .toUpperCase();
};

function OwnerDashboard() {
    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const user = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    const fetchDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                "/owner/dashboard"
            );

            const data = response.data || {};

            const ratings = Array.isArray(data.ratings)
                ? data.ratings
                : [];

            setDashboard({
                store: data.store || {},

                averageRating: Number(
                    data.averageRating ??
                        data.average_rating ??
                        0
                ),

                totalRatings: Number(
                    data.totalRatings ??
                        data.total_ratings ??
                        ratings.length
                ),

                ratings
            });
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    "Unable to load owner dashboard"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

    if (loading) {
        return (
            <div className="owner-page">
                <div className="owner-loading">
                    <div className="owner-spinner"></div>
                    <p>Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="owner-page">
                <header className="owner-header">
                    <div className="owner-brand">
                        <div className="owner-brand-mark">
                            <Star
                                size={18}
                                fill="currentColor"
                            />
                        </div>

                        <div>
                            <h1>RATEORA</h1>
                            <span>
                                STORE EXPERIENCE
                            </span>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="owner-header-button"
                        onClick={logout}
                    >
                        <LogOut size={15} />
                        Logout
                    </button>
                </header>

                <main className="owner-main">
                    <div className="owner-error">
                        <div className="owner-error-icon">
                            <RefreshCw size={21} />
                        </div>

                        <h2>
                            Unable to load dashboard
                        </h2>

                        <p>{error}</p>

                        <button
                            type="button"
                            className="owner-retry"
                            onClick={fetchDashboard}
                        >
                            Try Again
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    const store = dashboard?.store || {};

    const averageRating = Number(
        dashboard?.averageRating || 0
    );

    const ratings = Array.isArray(
        dashboard?.ratings
    )
        ? dashboard.ratings
        : [];

    const totalRatings = Number(
        dashboard?.totalRatings ?? ratings.length
    );

    return (
        <div className="owner-page">
            <header className="owner-header">
                <div className="owner-brand">
                    <div className="owner-brand-mark">
                        <Star
                            size={18}
                            fill="currentColor"
                        />
                    </div>

                    <div>
                        <h1>RATEORA</h1>
                        <span>STORE EXPERIENCE</span>
                    </div>
                </div>

                <div className="owner-header-actions">
                    <div className="owner-profile">
                        <div className="owner-profile-icon">
                            <User size={15} />
                        </div>

                        <div>
                            <span>WELCOME</span>

                            <strong>
                                {user.name ||
                                    "Store Owner"}
                            </strong>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="owner-header-button"
                        onClick={() =>
                            navigate(
                                "/owner/password"
                            )
                        }
                    >
                        <Lock size={15} />
                        Update Password
                    </button>

                    <button
                        type="button"
                        className="owner-header-button"
                        onClick={logout}
                    >
                        <LogOut size={15} />
                        Logout
                    </button>
                </div>
            </header>

            <main className="owner-main">
                <section className="owner-welcome">
                    <div>
                        <span className="owner-eyebrow">
                            STORE OWNER
                        </span>

                        <h2>
                            Welcome back,
                            <strong>
                                {user.name ||
                                    "Store Owner"}
                            </strong>
                        </h2>

                        <p>
                            Monitor your store's
                            customer experience from
                            one simple workspace.
                        </p>
                    </div>

                    <div className="owner-welcome-mark">
                        <Star
                            size={40}
                            fill="currentColor"
                        />
                    </div>
                </section>

                <section className="owner-store-card">
                    <div className="owner-store-icon">
                        <Store size={24} />
                    </div>

                    <div className="owner-store-info">
                        <span>YOUR STORE</span>

                        <h3>
                            {store.name ||
                                "Store"}
                        </h3>

                        <div className="owner-store-details">
                            <div>
                                <MapPin size={14} />

                                <span>
                                    {store.address ||
                                        "Address unavailable"}
                                </span>
                            </div>

                            <div>
                                <Mail size={14} />

                                <span>
                                    {store.email ||
                                        "Email unavailable"}
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="owner-stats">
                    <div className="owner-stat-card rating">
                        <div className="owner-stat-icon">
                            <Star
                                size={21}
                                fill="currentColor"
                            />
                        </div>

                        <div>
                            <span>
                                AVERAGE RATING
                            </span>

                            <strong>
                                {averageRating.toFixed(
                                    1
                                )}
                                <small>/ 5</small>
                            </strong>

                            <p>
                                {getRatingDescription(
                                    averageRating
                                )}
                            </p>
                        </div>
                    </div>

                    <div className="owner-stat-card">
                        <div className="owner-stat-icon">
                            <Users size={21} />
                        </div>

                        <div>
                            <span>
                                CUSTOMER RESPONSES
                            </span>

                            <strong>
                                {totalRatings}
                            </strong>

                            <p>
                                Submitted ratings
                            </p>
                        </div>
                    </div>
                </section>

                <section className="owner-activity">
                    <div className="owner-activity-header">
                        <div>
                            <span className="owner-eyebrow">
                                CUSTOMER ACTIVITY
                            </span>

                            <h3>
                                Customers who rated
                                your store
                            </h3>

                            <p>
                                Customers who have
                                shared their experience
                                with your store.
                            </p>
                        </div>

                        <div className="owner-activity-count">
                            <Users size={16} />

                            <strong>
                                {totalRatings}
                            </strong>
                        </div>
                    </div>

                    {ratings.length === 0 ? (
                        <div className="owner-empty">
                            <div className="owner-empty-icon">
                                <Star size={22} />
                            </div>

                            <h4>
                                No customer activity
                                yet
                            </h4>

                            <p>
                                No customer records were
                                returned for this store.
                            </p>
                        </div>
                    ) : (
                        <div className="owner-customer-list">
                            {ratings.map(
                                (rating, index) => (
                                    <div
                                        className="owner-customer-row"
                                        key={
                                            rating.id ||
                                            `${rating.userId}-${index}`
                                        }
                                    >
                                        <div className="owner-customer-info">
                                            <div className="owner-avatar">
                                                {getInitials(
                                                    rating.userName ||
                                                        rating.user_name
                                                )}
                                            </div>

                                            <div>
                                                <strong>
                                                    {rating.userName ||
                                                        rating.user_name ||
                                                        "Customer"}
                                                </strong>

                                                <span>
                                                    {rating.userEmail ||
                                                        rating.user_email ||
                                                        "Email unavailable"}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="owner-customer-meta">
                                            <div>
                                                <CalendarDays
                                                    size={14}
                                                />

                                                <span>
                                                    {formatDate(
                                                        rating.updatedAt ||
                                                            rating.updated_at ||
                                                            rating.createdAt ||
                                                            rating.created_at
                                                    )}
                                                </span>
                                            </div>

                                            <span className="owner-rated">
                                                Rated
                                            </span>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default OwnerDashboard;