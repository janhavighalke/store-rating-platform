import { useState } from "react";
import {
    ArrowLeft,
    Eye,
    EyeOff,
    Lock,
    Mail,
    MapPin,
    Star,
    UserRound
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Register.css";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        setError("");
        setSuccess("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        const name = formData.name.trim();
        const email = formData.email.trim();
        const address = formData.address.trim();

        if (!name) {
            setError("Please enter your full name.");
            return;
        }

        if (name.length < 20 || name.length > 60) {
            setError("Name must be between 20 and 60 characters.");
            return;
        }

        if (!email) {
            setError("Please enter your email address.");
            return;
        }

        if (!address) {
            setError("Please enter your address.");
            return;
        }

        if (address.length > 400) {
            setError("Address cannot exceed 400 characters.");
            return;
        }

        if (!formData.password) {
            setError("Please enter a password.");
            return;
        }

        if (
            formData.password.length < 8 ||
            formData.password.length > 16 ||
            !/[A-Z]/.test(formData.password) ||
            !/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
        ) {
            setError(
                "Password must be 8–16 characters with at least one uppercase letter and one special character."
            );
            return;
        }

        try {
            setLoading(true);

            const response = await api.post("/auth/register", {
                name,
                email,
                address,
                password: formData.password
            });

            setSuccess(
                response.data?.message ||
                "Customer account created successfully."
            );

            setFormData({
                name: "",
                email: "",
                address: "",
                password: ""
            });

            setTimeout(() => {
                navigate("/login");
            }, 1200);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to create your account. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">
            <div className="register-orbit register-orbit-one"></div>
            <div className="register-orbit register-orbit-two"></div>
            <div className="register-glow"></div>

            <div className="register-card">
                <button
                    type="button"
                    className="register-back"
                    onClick={() => navigate("/")}
                >
                    <ArrowLeft size={15} />
                    Back to RATEORA
                </button>

                <div className="register-brand">
                    <div className="register-brand-mark">
                        <Star size={17} fill="currentColor" />
                    </div>

                    <div>
                        <strong>RATEORA</strong>
                        <span>STORE EXPERIENCE</span>
                    </div>
                </div>

                <div className="register-header">
                    <span>JOIN RATEORA</span>

                    <h1>Create your account</h1>

                    <p>
                        Create a customer account and start sharing
                        your store experiences.
                    </p>
                </div>

                <div className="register-account-type">
                    <div className="register-account-icon">
                        <UserRound size={18} />
                    </div>

                    <div>
                        <span>ACCOUNT TYPE</span>
                        <strong>Customer</strong>
                    </div>

                    <div className="register-account-status">
                        Personal account
                    </div>
                </div>

                {error && (
                    <div className="register-error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="register-success">
                        {success}
                    </div>
                )}

                <form
                    className="register-form"
                    onSubmit={handleSubmit}
                >
                    <div className="register-field">
                        <label htmlFor="name">
                            Full name
                        </label>

                        <div className="register-input">
                            <UserRound size={16} />

                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                autoComplete="name"
                            />
                        </div>

                        <small>
                            20–60 characters
                        </small>
                    </div>

                    <div className="register-field">
                        <label htmlFor="email">
                            Email address
                        </label>

                        <div className="register-input">
                            <Mail size={16} />

                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                autoComplete="email"
                            />
                        </div>
                    </div>

                    <div className="register-field">
                        <label htmlFor="address">
                            Address
                        </label>

                        <div className="register-input register-textarea">
                            <MapPin size={16} />

                            <textarea
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Enter your address"
                            />
                        </div>

                        <small>
                            Maximum 400 characters
                        </small>
                    </div>

                    <div className="register-field">
                        <label htmlFor="password">
                            Password
                        </label>

                        <div className="register-input">
                            <Lock size={16} />

                            <input
                                id="password"
                                name="password"
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="8–16 characters"
                                autoComplete="new-password"
                            />

                            <button
                                type="button"
                                className="register-password-toggle"
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                            >
                                {showPassword ? (
                                    <EyeOff size={17} />
                                ) : (
                                    <Eye size={17} />
                                )}
                            </button>
                        </div>

                        <small>
                            8–16 characters · uppercase · special character
                        </small>
                    </div>

                    <button
                        type="submit"
                        className="register-submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="register-loader"></span>
                                Creating account
                            </>
                        ) : (
                            "Create customer account"
                        )}
                    </button>
                </form>

                <div className="register-divider">
                    <span></span>
                    <small>RATEORA</small>
                    <span></span>
                </div>

                <div className="register-login">
                    <span>
                        Already have an account?
                    </span>

                    <Link to="/login">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Register;