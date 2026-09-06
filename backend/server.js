require("dotenv").config();

const express = require("express");
const cors = require("cors");

const db = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const storeRoutes = require("./routes/storeRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const ownerRoutes = require("./routes/ownerRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/owner", ownerRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Store Rating API is running"
    });
});

app.get("/api/test-db", (req, res) => {
    db.query("SELECT 1", (err) => {
        if (err) {
            return res.status(500).json({
                message: "Database connection failed"
            });
        }

        res.json({
            message: "Database connection successful"
        });
    });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(
        `Server running on port ${PORT}`
    );
});