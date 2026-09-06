import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, Star, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Auth.css";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email.trim()) {
            setError("Please enter your email address.");
            return;
        }

        if (!formData.password) {
            setError("Please enter your password.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await api.post("/auth/login", {
                email: formData.email.trim(),
                password: formData.password
            });

            localStorage.setItem("token", response.data.token);

            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            const role = response.data.user.role;

            if (role === "admin") {
                navigate("/admin");
            } else if (role === "store_owner") {
                navigate("/owner");
            } else {
                navigate("/user");
            }
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to sign in. Please check your credentials."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="luxury-auth-page">

            <div className="auth-orbit orbit-one"></div>
            <div className="auth-orbit orbit-two"></div>
            <div className="auth-glow"></div>

            <div className="luxury-auth-card">

                <button
                    type="button"
                    className="back-home-button"
                    onClick={() => navigate("/")}
                >
                    <ArrowLeft size={15} />
                    Back to RATEORA
                </button>

                <div className="luxury-auth-brand">

                    <div className="luxury-auth-mark">
                        <Star size={17} fill="currentColor" />
                    </div>

                    <div className="brand-copy">
                        <strong>RATEORA</strong>
                        <span>STORE EXPERIENCE</span>
                    </div>

                </div>

                <div className="luxury-auth-header">

                    <span className="luxury-auth-eyebrow">
                        PRIVATE ACCESS
                    </span>

                    <h1>Welcome back</h1>

                    <p>
                        Sign in to continue to your account.
                    </p>

                </div>

                {error && (
                    <div className="luxury-auth-error">
                        {error}
                    </div>
                )}

                <form
                    className="luxury-auth-form"
                    onSubmit={handleSubmit}
                >

                    <div className="luxury-form-group">

                        <label htmlFor="email">
                            Email address
                        </label>

                        <div className="luxury-input-wrapper">

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

                    <div className="luxury-form-group">

                        <label htmlFor="password">
                            Password
                        </label>

                        <div className="luxury-input-wrapper">

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
                                placeholder="Enter your password"
                                autoComplete="current-password"
                            />

                            <button
                                type="button"
                                className="luxury-password-toggle"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                            >
                                {showPassword ? (
                                    <EyeOff size={17} />
                                ) : (
                                    <Eye size={17} />
                                )}
                            </button>

                        </div>

                    </div>

                    <button
                        type="submit"
                        className="luxury-signin-button"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="luxury-button-loader"></span>
                                Signing in
                            </>
                        ) : (
                            "Sign in"
                        )}
                    </button>

                </form>

                <div className="luxury-auth-divider">
                    <span></span>
                    <small>RATEORA</small>
                    <span></span>
                </div>

                <div className="luxury-auth-footer">

                    <span>
                        Don't have an account?
                    </span>

                    <Link to="/register">
                        Create account
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default Login;