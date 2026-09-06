const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const validatePassword = (password) => {
    return (
        password.length >= 8 &&
        password.length <= 16 &&
        /[A-Z]/.test(password) &&
        /[!@#$%^&*(),.?":{}|<>]/.test(password)
    );
};

const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const register = async (req, res) => {
    try {
        const {
            name,
            email,
            address,
            password
        } = req.body;

        if (!name || !email || !address || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const trimmedName = name.trim();
        const trimmedEmail = email.trim().toLowerCase();
        const trimmedAddress = address.trim();

        if (trimmedName.length < 20 || trimmedName.length > 60) {
            return res.status(400).json({
                message: "Name must be between 20 and 60 characters"
            });
        }

        if (trimmedAddress.length > 400) {
            return res.status(400).json({
                message: "Address cannot exceed 400 characters"
            });
        }

        if (!validateEmail(trimmedEmail)) {
            return res.status(400).json({
                message: "Invalid email address"
            });
        }

        if (!validatePassword(password)) {
            return res.status(400).json({
                message:
                    "Password must be 8-16 characters with at least one uppercase letter and one special character"
            });
        }

        const [existingUser] = await db.promise().query(
            "SELECT id FROM users WHERE email = ?",
            [trimmedEmail]
        );

        if (existingUser.length > 0) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.promise().query(
            `
            INSERT INTO users
            (name, email, address, password, role)
            VALUES (?, ?, ?, ?, ?)
            `,
            [
                trimmedName,
                trimmedEmail,
                trimmedAddress,
                hashedPassword,
                "user"
            ]
        );

        res.status(201).json({
            message: "Customer account created successfully"
        });
    } catch (error) {
        console.error("Registration error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const login = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const trimmedEmail = email.trim().toLowerCase();

        if (!validateEmail(trimmedEmail)) {
            return res.status(400).json({
                message: "Invalid email address"
            });
        }

        const [users] = await db.promise().query(
            `
            SELECT
                id,
                name,
                email,
                address,
                password,
                role
            FROM users
            WHERE email = ?
            `,
            [trimmedEmail]
        );

        if (users.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const user = users[0];

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                address: user.address,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const changePassword = async (req, res) => {
    try {
        const {
            currentPassword,
            newPassword
        } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message:
                    "Current password and new password are required"
            });
        }

        if (!validatePassword(newPassword)) {
            return res.status(400).json({
                message:
                    "Password must be 8-16 characters with at least one uppercase letter and one special character"
            });
        }

        const [users] = await db.promise().query(
            "SELECT password FROM users WHERE id = ?",
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const passwordMatch = await bcrypt.compare(
            currentPassword,
            users[0].password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Current password is incorrect"
            });
        }

        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        await db.promise().query(
            "UPDATE users SET password = ? WHERE id = ?",
            [hashedPassword, req.user.id]
        );

        res.json({
            message: "Password updated successfully"
        });
    } catch (error) {
        console.error("Change password error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    register,
    login,
    changePassword
};