import express from "express";
import { verifyToken } from "../middleware/auth.js";
import pool from "../utils/db.js"; // connect to the database

const router = express.Router();

// 🧪 Public test route
router.get("/", (req, res) => {
  res.send("Equipment route is working ✅");
});

// 🔐 Protected test route
router.get("/protected", verifyToken, (req, res) => {
  res.json({
    message: "Welcome, you’re authorized ✅",
    user: req.user,
  });
});

// 📦 Public route: view all equipment
router.get("/all", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM equipment ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching equipment");
  }
});

// ➕ Protected route: add new equipment
router.post("/add", verifyToken, async (req, res) => {
  const { name, category, price_per_day, location, specs } = req.body;

  try {
    // Only vendors can add equipment
    if (req.user.role !== "vendor") {
      return res.status(403).json({ error: "Only vendors can add equipment" });
    }

    const result = await pool.query(
      `INSERT INTO equipment (vendor_id, name, category, price_per_day, location, specs)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [req.user.id, name, category, price_per_day, location, specs]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add equipment" });
  }
});

export default router;
