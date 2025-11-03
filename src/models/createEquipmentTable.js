import pool from "../utils/db.js";

async function createEquipmentTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS equipment (
      id SERIAL PRIMARY KEY,
      vendor_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(100) NOT NULL,
      category VARCHAR(50),
      price_per_day DECIMAL(10,2),
      location VARCHAR(100),
      specs TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(query);
    console.log("✅ Equipment table created successfully!");
  } catch (err) {
    console.error("❌ Error creating equipment table:", err);
  } finally {
    pool.end();
  }
}

createEquipmentTable();
