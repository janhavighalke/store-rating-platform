import { useState } from "react";
import {
    Lock,
    Eye,
    EyeOff,
    ArrowLeft,
    ShieldCheck,
    CheckCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./OwnerPassword.css";

function OwnerPassword() {
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

    const updatePassword = async (event) => {
        event.preventDefault();

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
        <div className="owner-password-page">
            <div className="owner-password-card">
                <button
                    type="button"
                    className="owner-password-back"
                    onClick={() => navigate("/owner")}
                >
                    <ArrowLeft size={15} />
                    Back to Dashboard
                </button>

                <div className="owner-password-brand">
                    <div className="owner-password-logo">
                        <span>R</span>
                    </div>

                    <div>
                        <h1>RATEORA</h1>
                        <span>STORE EXPERIENCE</span>
                    </div>
                </div>

                <div className="owner-password-heading">
                    <span>ACCOUNT SECURITY</span>

                    <h2>Update password</h2>

                    <p>
                        Keep your store account secure with a
                        strong and private password.
                    </p>
                </div>

                {error && (
                    <div className="owner-password-message error">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="owner-password-message success">
                        <CheckCircle size={15} />
                        {message}
                    </div>
                )}

                <form
                    className="owner-password-form"
                    onSubmit={updatePassword}
                >
                    <div className="owner-password-field">
                        <label>Current password</label>

                        <div className="owner-password-input">
                            <Lock size={16} />

                            <input
                                type={
                                    showCurrent
                                        ? "text"
                                        : "password"
                                }
                                value={currentPassword}
                                onChange={(event) =>
                                    setCurrentPassword(
                                        event.target.value
                                    )
                                }
                                placeholder="Enter current password"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowCurrent(
                                        (value) => !value
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

                    <div className="owner-password-field">
                        <label>New password</label>

                        <div className="owner-password-input">
                            <Lock size={16} />

                            <input
                                type={
                                    showNew
                                        ? "text"
                                        : "password"
                                }
                                value={newPassword}
                                onChange={(event) =>
                                    setNewPassword(
                                        event.target.value
                                    )
                                }
                                placeholder="Enter new password"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowNew(
                                        (value) => !value
                                    )
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

                    <div className="owner-password-field">
                        <label>Confirm new password</label>

                        <div className="owner-password-input">
                            <Lock size={16} />

                            <input
                                type={
                                    showConfirm
                                        ? "text"
                                        : "password"
                                }
                                value={confirmPassword}
                                onChange={(event) =>
                                    setConfirmPassword(
                                        event.target.value
                                    )
                                }
                                placeholder="Confirm new password"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirm(
                                        (value) => !value
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

                    <div className="owner-password-rules">
                        <ShieldCheck size={18} />

                        <div>
                            <strong>
                                Password requirements
                            </strong>

                            <p>
                                8–16 characters with at least
                                one uppercase letter and one
                                special character.
                            </p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="owner-password-submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Updating..."
                            : "Update password"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default OwnerPassword;