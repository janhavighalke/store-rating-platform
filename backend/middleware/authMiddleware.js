const jwt = require("jsonwebtoken");
const db = require("../config/db");

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Access token required"
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const [users] = await db.promise().query(
            "SELECT id, role FROM users WHERE id = ?",
            [decoded.id]
        );

        if (users.length === 0) {
            return res.status(401).json({
                message: "User account not found"
            });
        }

        req.user = {
            id: users[0].id,
            role: users[0].role
        };

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

module.exports = authenticateToken;