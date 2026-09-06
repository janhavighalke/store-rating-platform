import { useState } from "react";
import {
    Lock,
    Eye,
    EyeOff,
    ArrowLeft,
    Star
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./UserPassword.css";

function UserPassword() {
    const navigate = useNavigate();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const updatePassword = async (e) => {
        e.preventDefault();

        setError("");
        setMessage("");

        if (
            !currentPassword ||
            !newPassword ||
            !confirmPassword
        ) {
            setError("All fields are required");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("New passwords do not match");
            return;
        }

        if (
            newPassword.length < 8 ||
            newPassword.length > 16 ||
            !/[A-Z]/.test(newPassword) ||
            !/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)
        ) {
            setError(
                "Password must be 8-16 characters with at least one uppercase letter and one special character"
            );
            return;
        }

        try {
            setLoading(true);

            const response = await api.put(
                "/auth/password",
                {
                    currentPassword,
                    newPassword
                }
            );

            setMessage(
                response.data?.message ||
                    "Password updated successfully"
            );

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    "Unable to update password"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="user-password-page">
            <div className="user-password-card">
                <button
                    className="user-password-back"
                    onClick={() => navigate("/user")}
                >
                    <ArrowLeft size={15} />
                    Back to Dashboard
                </button>

                <div className="user-password-brand">
                    <div>
                        <Star
                            size={18}
                            fill="currentColor"
                        />
                    </div>

                    <section>
                        <h1>RATEORA</h1>
                        <span>STORE EXPERIENCE</span>
                    </section>
                </div>

                <div className="user-password-heading">
                    <span>ACCOUNT SECURITY</span>

                    <h2>Update Password</h2>

                    <p>
                        Change your password to keep your account
                        secure.
                    </p>
                </div>

                {error && (
                    <div className="user-password-error">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="user-password-success">
                        {message}
                    </div>
                )}

                <form onSubmit={updatePassword}>
                    <div className="user-password-field">
                        <label>Current Password</label>

                        <div className="user-password-input">
                            <Lock size={15} />

                            <input
                                type={
                                    showCurrent
                                        ? "text"
                                        : "password"
                                }
                                value={currentPassword}
                                onChange={(e) =>
                                    setCurrentPassword(
                                        e.target.value
                                    )
                                }
                                placeholder="Current password"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowCurrent(
                                        !showCurrent
                                    )
                                }
                            >
                                {showCurrent ? (
                                    <EyeOff size={16} />
                                ) : (
                                    <Eye size={16} />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="user-password-field">
                        <label>New Password</label>

                        <div className="user-password-input">
                            <Lock size={15} />

                            <input
                                type={
                                    showNew
                                        ? "text"
                                        : "password"
                                }
                                value={newPassword}
                                onChange={(e) =>
                                    setNewPassword(
                                        e.target.value
                                    )
                                }
                                placeholder="New password"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowNew(!showNew)
                                }
                            >
                                {showNew ? (
                                    <EyeOff size={16} />
                                ) : (
                                    <Eye size={16} />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="user-password-field">
                        <label>Confirm New Password</label>

                        <div className="user-password-input">
                            <Lock size={15} />

                            <input
                                type={
                                    showConfirm
                                        ? "text"
                                        : "password"
                                }
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(
                                        e.target.value
                                    )
                                }
                                placeholder="Confirm new password"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirm(
                                        !showConfirm
                                    )
                                }
                            >
                                {showConfirm ? (
                                    <EyeOff size={16} />
                                ) : (
                                    <Eye size={16} />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="user-password-rules">
                        <strong>Password requirements</strong>
                        <span>8–16 characters</span>
                        <span>One uppercase letter</span>
                        <span>One special character</span>
                    </div>

                    <button
                        type="submit"
                        className="user-password-submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Updating..."
                            : "Update Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default UserPassword;