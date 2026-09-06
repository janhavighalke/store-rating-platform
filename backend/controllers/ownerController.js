const db = require("../config/db");

const getOwnerDashboard = async (req, res) => {
    try {
        const ownerId = Number(req.user.id);

        if (!Number.isInteger(ownerId) || ownerId <= 0) {
            return res.status(400).json({
                message: "Invalid store owner"
            });
        }

        const [stores] = await db.promise().query(
            `
            SELECT
                id,
                name,
                email,
                address
            FROM stores
            WHERE owner_id = ?
            LIMIT 1
            `,
            [ownerId]
        );

        if (stores.length === 0) {
            return res.status(404).json({
                message: "No store is assigned to this owner"
            });
        }

        const store = stores[0];

        const [summary] = await db.promise().query(
            `
            SELECT
                COUNT(*) AS totalRatings,
                COALESCE(AVG(rating), 0) AS averageRating
            FROM ratings
            WHERE store_id = ?
            `,
            [store.id]
        );

        const [ratings] = await db.promise().query(
            `
            SELECT
                r.id,
                r.user_id AS userId,
                u.name AS userName,
                u.email AS userEmail,
                r.created_at AS createdAt,
                r.updated_at AS updatedAt
            FROM ratings r
            LEFT JOIN users u
                ON u.id = r.user_id
            WHERE r.store_id = ?
            ORDER BY r.updated_at DESC
            `,
            [store.id]
        );

        const customerRatings = ratings.map(
            (rating) => ({
                id: rating.id,
                userId: rating.userId,
                userName:
                    rating.userName ||
                    "Customer",
                userEmail:
                    rating.userEmail ||
                    "Email unavailable",
                createdAt: rating.createdAt,
                updatedAt: rating.updatedAt
            })
        );

        res.json({
            store: {
                id: store.id,
                name: store.name,
                email: store.email,
                address: store.address
            },
            averageRating: Number(
                summary[0]?.averageRating || 0
            ),
            totalRatings: Number(
                summary[0]?.totalRatings || 0
            ),
            ratings: customerRatings
        });
    } catch (error) {
        console.error(
            "Owner dashboard error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    getOwnerDashboard
};