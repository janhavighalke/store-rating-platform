const express = require("express");

const {
    getDashboardStats,
    getUsers,
    addUser,
    getUserDetails,
    deleteUser,
    addStore,
    getStores,
    getStoreRatings,
    deleteStore
} = require("../controllers/adminController");

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
    "/dashboard",
    authenticateToken,
    authorizeRoles("admin"),
    getDashboardStats
);

router.get(
    "/users",
    authenticateToken,
    authorizeRoles("admin"),
    getUsers
);

router.post(
    "/users",
    authenticateToken,
    authorizeRoles("admin"),
    addUser
);

router.get(
    "/users/:id",
    authenticateToken,
    authorizeRoles("admin"),
    getUserDetails
);

router.delete(
    "/users/:id",
    authenticateToken,
    authorizeRoles("admin"),
    deleteUser
);

router.get(
    "/stores",
    authenticateToken,
    authorizeRoles("admin"),
    getStores
);

router.post(
    "/stores",
    authenticateToken,
    authorizeRoles("admin"),
    addStore
);

router.get(
    "/stores/:id/ratings",
    authenticateToken,
    authorizeRoles("admin"),
    getStoreRatings
);

router.delete(
    "/stores/:id",
    authenticateToken,
    authorizeRoles("admin"),
    deleteStore
);

module.exports = router;