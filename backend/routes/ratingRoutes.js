const express = require("express");
const {
    submitRating
} = require("../controllers/ratingController");
const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
    "/",
    authenticateToken,
    authorizeRoles("user"),
    submitRating
);

module.exports = router;