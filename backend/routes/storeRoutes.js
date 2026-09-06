const express = require("express");
const { getStoresForUser } = require("../controllers/storeController");
const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
    "/",
    authenticateToken,
    authorizeRoles("user"),
    getStoresForUser
);

module.exports = router;