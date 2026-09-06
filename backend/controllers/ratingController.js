const db = require("../config/db");

const submitRating = async (req, res) => {
    try {
        const { store_id, rating } = req.body;
        const user_id = req.user.id;

        if (!store_id || rating === undefined) {
            return res.status(400).json({
                message: "Store ID and rating are required"
            });
        }

        if (!Number.isInteger(Number(rating)) || Number(rating) < 1 || Number(rating) > 5) {
            return res.status(400).json({
                message: "Rating must be between 1 and 5"
            });
        }

        const [store] = await db.promise().query(
            "SELECT id FROM stores WHERE id = ?",
            [store_id]
        );

        if (store.length === 0) {
            return res.status(404).json({
                message: "Store not found"
            });
        }

        const [existingRating] = await db.promise().query(
            "SELECT id FROM ratings WHERE user_id = ? AND store_id = ?",
            [user_id, store_id]
        );

        if (existingRating.length > 0) {
            await db.promise().query(
                "UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?",
                [rating, user_id, store_id]
            );

            return res.json({
                message: "Rating updated successfully"
            });
        }

        await db.promise().query(
            "INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)",
            [user_id, store_id, rating]
        );

        res.status(201).json({
            message: "Rating submitted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    submitRating
};