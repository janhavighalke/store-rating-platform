const express = require("express");
const {
    register,
    login,
    changePassword
} = require("../controllers/authController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get(
    "/profile",
    authenticateToken,
    (req, res) => {
        res.json({
            message: "Authentication successful",
            user: req.user
        });
    }
);

router.put(
    "/password",
    authenticateToken,
    changePassword
);

module.exports = router;