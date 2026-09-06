const bcrypt = require("bcryptjs");
const db = require("../config/db");

const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validatePassword = (password) => {
    return (
        password.length >= 8 &&
        password.length <= 16 &&
        /[A-Z]/.test(password) &&
        /[!@#$%^&*(),.?":{}|<>]/.test(password)
    );
};

const getDashboardStats = async (req, res) => {
    try {
        const [[users]] = await db.promise().query(
            "SELECT COUNT(*) AS totalUsers FROM users"
        );

        const [[stores]] = await db.promise().query(
            "SELECT COUNT(*) AS totalStores FROM stores"
        );

        const [[ratings]] = await db.promise().query(
            "SELECT COUNT(*) AS totalRatings FROM ratings"
        );

        res.json({
            totalUsers: Number(users.totalUsers),
            totalStores: Number(stores.totalStores),
            totalRatings: Number(ratings.totalRatings)
        });
    } catch (error) {
        console.error("Dashboard stats error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const getUsers = async (req, res) => {
    try {
        const {
            name,
            email,
            address,
            role,
            sortBy = "name",
            order = "asc"
        } = req.query;

        const allowedSortFields = {
            name: "name",
            email: "email",
            address: "address",
            role: "role"
        };

        const sortField =
            allowedSortFields[sortBy] || "name";

        const sortOrder =
            String(order).toLowerCase() === "desc"
                ? "DESC"
                : "ASC";

        let query = `
            SELECT
                id,
                name,
                email,
                address,
                role
            FROM users
            WHERE 1 = 1
        `;

        const values = [];

        if (name) {
            query += " AND name LIKE ?";
            values.push(`%${name}%`);
        }

        if (email) {
            query += " AND email LIKE ?";
            values.push(`%${email}%`);
        }

        if (address) {
            query += " AND address LIKE ?";
            values.push(`%${address}%`);
        }

        if (role) {
            query += " AND role = ?";
            values.push(role);
        }

        query += ` ORDER BY ${sortField} ${sortOrder}`;

        const [users] = await db.promise().query(
            query,
            values
        );

        res.json(users);
    } catch (error) {
        console.error("Get users error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const addUser = async (req, res) => {
    try {
        const {
            name,
            email,
            address,
            password,
            role
        } = req.body;

        if (
            !name ||
            !email ||
            !address ||
            !password ||
            !role
        ) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const trimmedName = name.trim();
        const trimmedEmail = email.trim().toLowerCase();
        const trimmedAddress = address.trim();

        if (
            trimmedName.length < 20 ||
            trimmedName.length > 60
        ) {
            return res.status(400).json({
                message:
                    "Name must be between 20 and 60 characters"
            });
        }

        if (trimmedAddress.length > 400) {
            return res.status(400).json({
                message:
                    "Address cannot exceed 400 characters"
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

        const allowedRoles = [
            "user",
            "admin",
            "store_owner"
        ];

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                message: "Invalid user role"
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

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

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
                role
            ]
        );

        res.status(201).json({
            message: "User added successfully"
        });
    } catch (error) {
        console.error("Add user error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const getUserDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const [users] = await db.promise().query(
            `
            SELECT
                id,
                name,
                email,
                address,
                role,
                created_at
            FROM users
            WHERE id = ?
            `,
            [id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const user = users[0];

        if (user.role === "store_owner") {
            const [stores] = await db.promise().query(
                `
                SELECT
                    s.id,
                    s.name,
                    s.email,
                    s.address,
                    COALESCE(
                        ROUND(AVG(r.rating), 1),
                        0
                    ) AS rating
                FROM stores s
                LEFT JOIN ratings r
                    ON s.id = r.store_id
                WHERE s.owner_id = ?
                GROUP BY
                    s.id,
                    s.name,
                    s.email,
                    s.address
                ORDER BY s.name ASC
                `,
                [id]
            );

            return res.json({
                ...user,
                stores
            });
        }

        res.json(user);
    } catch (error) {
        console.error("Get user details error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const deleteUser = async (req, res) => {
    const connection =
        await db.promise().getConnection();

    try {
        const { id } = req.params;
        const userId = Number(id);

        if (!Number.isInteger(userId) || userId <= 0) {
            return res.status(400).json({
                message: "Invalid user id"
            });
        }

        if (Number(req.user.id) === userId) {
            return res.status(400).json({
                message:
                    "You cannot delete your own admin account"
            });
        }

        await connection.beginTransaction();

        const [users] = await connection.query(
            `
            SELECT id, role
            FROM users
            WHERE id = ?
            `,
            [userId]
        );

        if (users.length === 0) {
            await connection.rollback();

            return res.status(404).json({
                message: "User not found"
            });
        }

        const [stores] = await connection.query(
            `
            SELECT id
            FROM stores
            WHERE owner_id = ?
            `,
            [userId]
        );

        let deletedRatings = 0;

        for (const store of stores) {
            const [ratingResult] =
                await connection.query(
                    "DELETE FROM ratings WHERE store_id = ?",
                    [store.id]
                );

            deletedRatings +=
                ratingResult.affectedRows;
        }

        const [userRatings] =
            await connection.query(
                "DELETE FROM ratings WHERE user_id = ?",
                [userId]
            );

        deletedRatings +=
            userRatings.affectedRows;

        const [storeResult] =
            await connection.query(
                "DELETE FROM stores WHERE owner_id = ?",
                [userId]
            );

        await connection.query(
            "DELETE FROM users WHERE id = ?",
            [userId]
        );

        await connection.commit();

        res.json({
            message: "User deleted successfully",
            deletedStores:
                storeResult.affectedRows,
            deletedRatings
        });
    } catch (error) {
        await connection.rollback();

        console.error("Delete user error:", error);

        res.status(500).json({
            message: "Unable to delete user"
        });
    } finally {
        connection.release();
    }
};

const addStore = async (req, res) => {
    try {
        const {
            name,
            email,
            address,
            owner_id
        } = req.body;

        if (
            !name ||
            !email ||
            !address ||
            owner_id === undefined ||
            owner_id === null ||
            owner_id === ""
        ) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const trimmedName = name.trim();
        const trimmedEmail = email.trim().toLowerCase();
        const trimmedAddress = address.trim();
        const ownerId = Number(owner_id);

        if (
            trimmedName.length < 20 ||
            trimmedName.length > 60
        ) {
            return res.status(400).json({
                message:
                    "Store name must be between 20 and 60 characters"
            });
        }

        if (trimmedAddress.length > 400) {
            return res.status(400).json({
                message:
                    "Address cannot exceed 400 characters"
            });
        }

        if (!validateEmail(trimmedEmail)) {
            return res.status(400).json({
                message: "Invalid email address"
            });
        }

        if (
            !Number.isInteger(ownerId) ||
            ownerId <= 0
        ) {
            return res.status(400).json({
                message: "Invalid store owner"
            });
        }

        const [owners] = await db.promise().query(
            `
            SELECT id
            FROM users
            WHERE id = ?
            AND role = 'store_owner'
            `,
            [ownerId]
        );

        if (owners.length === 0) {
            return res.status(400).json({
                message: "Invalid store owner"
            });
        }

        await db.promise().query(
            `
            INSERT INTO stores
            (name, email, address, owner_id)
            VALUES (?, ?, ?, ?)
            `,
            [
                trimmedName,
                trimmedEmail,
                trimmedAddress,
                ownerId
            ]
        );

        res.status(201).json({
            message: "Store added successfully"
        });
    } catch (error) {
        console.error("Add store error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const getStores = async (req, res) => {
    try {
        const {
            name,
            email,
            address,
            sortBy = "name",
            order = "asc"
        } = req.query;

        const allowedSortFields = {
            name: "s.name",
            email: "s.email",
            address: "s.address",
            rating: "rating"
        };

        const sortField =
            allowedSortFields[sortBy] ||
            "s.name";

        const sortOrder =
            String(order).toLowerCase() === "desc"
                ? "DESC"
                : "ASC";

        let query = `
            SELECT
                s.id,
                s.name,
                s.email,
                s.address,
                s.owner_id,
                u.name AS owner_name,
                COALESCE(
                    ROUND(AVG(r.rating), 1),
                    0
                ) AS rating
            FROM stores s
            INNER JOIN users u
                ON s.owner_id = u.id
            LEFT JOIN ratings r
                ON s.id = r.store_id
            WHERE 1 = 1
        `;

        const values = [];

        if (name) {
            query += " AND s.name LIKE ?";
            values.push(`%${name}%`);
        }

        if (email) {
            query += " AND s.email LIKE ?";
            values.push(`%${email}%`);
        }

        if (address) {
            query += " AND s.address LIKE ?";
            values.push(`%${address}%`);
        }

        query += `
            GROUP BY
                s.id,
                s.name,
                s.email,
                s.address,
                s.owner_id,
                u.name
        `;

        query += `
            ORDER BY ${sortField} ${sortOrder}
        `;

        const [stores] = await db.promise().query(
            query,
            values
        );

        res.json(stores);
    } catch (error) {
        console.error("Get stores error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const getStoreRatings = async (req, res) => {
    try {
        const { id } = req.params;

        const [stores] = await db.promise().query(
            `
            SELECT
                s.id,
                s.name,
                s.email,
                s.address,
                s.owner_id,
                u.name AS owner_name
            FROM stores s
            INNER JOIN users u
                ON s.owner_id = u.id
            WHERE s.id = ?
            `,
            [id]
        );

        if (stores.length === 0) {
            return res.status(404).json({
                message: "Store not found"
            });
        }

        const [ratings] = await db.promise().query(
            `
            SELECT
                r.id,
                u.id AS userId,
                u.name AS userName,
                u.email AS userEmail,
                r.rating,
                r.updated_at
            FROM ratings r
            INNER JOIN users u
                ON r.user_id = u.id
            WHERE r.store_id = ?
            ORDER BY r.updated_at DESC
            `,
            [id]
        );

        res.json({
            store: stores[0],
            ratings
        });
    } catch (error) {
        console.error(
            "Get store ratings error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};

const deleteStore = async (req, res) => {
    const connection =
        await db.promise().getConnection();

    try {
        const { id } = req.params;
        const storeId = Number(id);

        if (
            !Number.isInteger(storeId) ||
            storeId <= 0
        ) {
            return res.status(400).json({
                message: "Invalid store id"
            });
        }

        await connection.beginTransaction();

        const [stores] = await connection.query(
            `
            SELECT id
            FROM stores
            WHERE id = ?
            `,
            [storeId]
        );

        if (stores.length === 0) {
            await connection.rollback();

            return res.status(404).json({
                message: "Store not found"
            });
        }

        const [ratingResult] =
            await connection.query(
                "DELETE FROM ratings WHERE store_id = ?",
                [storeId]
            );

        await connection.query(
            "DELETE FROM stores WHERE id = ?",
            [storeId]
        );

        await connection.commit();

        res.json({
            message: "Store deleted successfully",
            deletedRatings:
                ratingResult.affectedRows
        });
    } catch (error) {
        await connection.rollback();

        console.error(
            "Delete store error:",
            error
        );

        res.status(500).json({
            message: "Unable to delete store"
        });
    } finally {
        connection.release();
    }
};

module.exports = {
    getDashboardStats,
    getUsers,
    addUser,
    getUserDetails,
    deleteUser,
    addStore,
    getStores,
    getStoreRatings,
    deleteStore
};