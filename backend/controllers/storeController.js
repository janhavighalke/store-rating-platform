const db = require("../config/db");

const getStoresForUser = async (req, res) => {
    try {
        const {
            name,
            address,
            sortBy = "name",
            order = "asc"
        } = req.query;

        const allowedSortFields = {
            name: "s.name",
            address: "s.address",
            rating: "overallRating"
        };

        const sortField = allowedSortFields[sortBy] || "s.name";
        const sortOrder = order.toLowerCase() === "desc" ? "DESC" : "ASC";

        let query = `
            SELECT
                s.id,
                s.name,
                s.address,
                COALESCE(AVG(all_ratings.rating), 0) AS overallRating,
                user_rating.rating AS userRating
            FROM stores s
            LEFT JOIN ratings all_ratings
                ON s.id = all_ratings.store_id
            LEFT JOIN ratings user_rating
                ON s.id = user_rating.store_id
                AND user_rating.user_id = ?
            WHERE 1 = 1
        `;

        const values = [req.user.id];

        if (name) {
            query += " AND s.name LIKE ?";
            values.push(`%${name}%`);
        }

        if (address) {
            query += " AND s.address LIKE ?";
            values.push(`%${address}%`);
        }

        query += `
            GROUP BY s.id, s.name, s.address, user_rating.rating
            ORDER BY ${sortField} ${sortOrder}
        `;

        const [stores] = await db.promise().query(query, values);

        res.json(stores);
    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    getStoresForUser
};