const express = require("express");

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    getOwnerDashboard
} = require("../controllers/ownerController");

const router = express.Router();

router.get(
    "/dashboard",
    authenticateToken,
    authorizeRoles("store_owner"),
    getOwnerDashboard
);

module.exports = router;