import { useEffect, useState } from "react";
import {
    Search,
    Star,
    LogOut,
    Lock,
    User,
    MapPin
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./UserDashboard.css";

const ratingLabels = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Excellent"
};

function UserDashboard() {
    const navigate = useNavigate();

    const [stores, setStores] = useState([]);
    const [nameSearch, setNameSearch] = useState("");
    const [addressSearch, setAddressSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [ratingLoading, setRatingLoading] = useState(null);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const user = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    const fetchStores = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/stores", {
                params: {
                    name: nameSearch,
                    address: addressSearch
                }
            });

            setStores(response.data);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to load stores"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStores();
    }, [nameSearch, addressSearch]);

    const submitRating = async (storeId, rating) => {
        try {
            setRatingLoading(storeId);
            setError("");
            setMessage("");

            const response = await api.post("/ratings", {
                store_id: storeId,
                rating
            });

            setMessage(
                response.data?.message ||
                "Rating submitted successfully"
            );

            await fetchStores();

            setTimeout(() => {
                setMessage("");
            }, 2500);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to submit rating"
            );
        } finally {
            setRatingLoading(null);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

    const clearSearch = () => {
        setNameSearch("");
        setAddressSearch("");
    };

    return (
        <div className="user-page">
            <header className="user-header">
                <div className="user-brand">
                    <div className="user-brand-mark">
                        <Star size={17} fill="currentColor" />
                    </div>

                    <div>
                        <h1>RATEORA</h1>
                        <span>STORE EXPERIENCE</span>
                    </div>
                </div>

                <div className="user-header-actions">
                    <div className="user-profile">
                        <div className="user-profile-icon">
                            <User size={15} />
                        </div>

                        <div>
                            <span>WELCOME</span>
                            <strong>
                                {user.name || "User"}
                            </strong>
                        </div>
                    </div>

                    <button
                        className="user-header-button"
                        onClick={() =>
                            navigate("/user/password")
                        }
                    >
                        <Lock size={15} />
                        Update Password
                    </button>

                    <button
                        className="user-header-button"
                        onClick={logout}
                    >
                        <LogOut size={15} />
                        Logout
                    </button>
                </div>
            </header>

            <main className="user-main">
                <section className="user-intro">
                    <span className="user-eyebrow">
                        DISCOVER & RATE
                    </span>

                    <h2>Available Stores</h2>

                    <p>
                        Find stores and share your experience.
                    </p>
                </section>

                <section className="user-search-panel">
                    <div className="user-search-title">
                        <Search size={17} />
                        <span>Search stores</span>
                    </div>

                    <div className="user-search-grid">
                        <div className="user-search-field">
                            <Search size={17} />

                            <input
                                type="text"
                                placeholder="Store name"
                                value={nameSearch}
                                onChange={(e) =>
                                    setNameSearch(e.target.value)
                                }
                            />
                        </div>

                        <div className="user-search-field">
                            <MapPin size={17} />

                            <input
                                type="text"
                                placeholder="Address"
                                value={addressSearch}
                                onChange={(e) =>
                                    setAddressSearch(e.target.value)
                                }
                            />
                        </div>
                    </div>

                    {(nameSearch || addressSearch) && (
                        <button
                            className="user-clear-search"
                            onClick={clearSearch}
                        >
                            Clear search
                        </button>
                    )}
                </section>

                {message && (
                    <div className="user-success">
                        <Star size={15} fill="currentColor" />
                        {message}
                    </div>
                )}

                {error && (
                    <div className="user-error">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="user-loading">
                        <div className="user-spinner"></div>
                        <p>Loading stores...</p>
                    </div>
                ) : stores.length === 0 ? (
                    <div className="user-empty">
                        <div className="user-empty-icon">
                            <Search size={20} />
                        </div>

                        <h3>No stores found</h3>

                        <p>
                            Try changing your search criteria.
                        </p>
                    </div>
                ) : (
                    <section className="user-store-grid">
                        {stores.map((store, index) => {
                            const overallRating = Number(
                                store.overallRating || 0
                            );

                            const userRating = store.userRating
                                ? Number(store.userRating)
                                : 0;

                            return (
                                <article
                                    className="user-store-card"
                                    key={store.id}
                                >
                                    <div className="user-store-top">
                                        <div className="user-store-number">
                                            {String(index + 1).padStart(
                                                2,
                                                "0"
                                            )}
                                        </div>

                                        <div className="user-store-info">
                                            <h3>{store.name}</h3>

                                            <div className="user-store-address">
                                                <MapPin size={13} />
                                                <span>
                                                    {store.address}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="user-overall-badge">
                                            <Star
                                                size={14}
                                                fill="currentColor"
                                            />

                                            <span>
                                                {overallRating.toFixed(1)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="user-rating-summary">
                                        <div>
                                            <span>Overall Rating</span>

                                            <strong>
                                                {overallRating.toFixed(1)}
                                            </strong>

                                            <small>
                                                {overallRating > 0
                                                    ? ratingLabels[
                                                        Math.round(
                                                            overallRating
                                                        )
                                                    ] || "Rated"
                                                    : "Not Rated"}
                                            </small>
                                        </div>

                                        <div>
                                            <span>Your Rating</span>

                                            <strong>
                                                {userRating || "—"}
                                            </strong>

                                            <small>
                                                {userRating
                                                    ? ratingLabels[
                                                        userRating
                                                    ]
                                                    : "Not Rated"}
                                            </small>
                                        </div>
                                    </div>

                                    <div className="user-rating-area">
                                        <div className="user-rating-heading">
                                            <div>
                                                <span>
                                                    {userRating
                                                        ? "MODIFY YOUR RATING"
                                                        : "SUBMIT YOUR RATING"}
                                                </span>

                                                {userRating > 0 && (
                                                    <small>
                                                        Current:{" "}
                                                        {
                                                            ratingLabels[
                                                                userRating
                                                            ]
                                                        }
                                                    </small>
                                                )}
                                            </div>
                                        </div>

                                        <div className="rating-selector">
                                            {[1, 2, 3, 4, 5].map(
                                                (rating) => (
                                                    <button
                                                        key={rating}
                                                        type="button"
                                                        disabled={
                                                            ratingLoading ===
                                                            store.id
                                                        }
                                                        className={
                                                            userRating >=
                                                                rating
                                                                ? "rating-item active"
                                                                : "rating-item"
                                                        }
                                                        onClick={() =>
                                                            submitRating(
                                                                store.id,
                                                                rating
                                                            )
                                                        }
                                                        aria-label={`Rate ${rating} out of 5`}
                                                    >
                                                        <Star
                                                            size={21}
                                                            fill={
                                                                userRating >=
                                                                    rating
                                                                    ? "currentColor"
                                                                    : "none"
                                                            }
                                                        />

                                                        <strong>
                                                            {rating}
                                                        </strong>

                                                        <span>
                                                            {
                                                                ratingLabels[
                                                                rating
                                                                ]
                                                            }
                                                        </span>
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </section>
                )}
            </main>
        </div>
    );
}

export default UserDashboard;