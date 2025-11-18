import express from "express";
import db from "./src-backend/db/client.js";

// turns on node server
const PORT = process.env.PORT ?? 3000;

const app = express();
app.use(express.json());

let dbAvailable = false;
try {
  // try connecting once at startup; if it fails we'll serve mock data
  await db.connect();
  dbAvailable = true;
  console.log("Connected to database");
} catch (err) {
  console.warn(
    "Database connection failed, falling back to mock data:",
    err.message
  );
}

app.get("/api/top-recipes", async (req, res) => {
  if (dbAvailable) {
    try {
      const result = await db.query(
        "SELECT id, name FROM recipes ORDER BY id DESC LIMIT 6"
      );
      return res.json({ recipes: result.rows });
    } catch (err) {
      console.error("DB query failed for top recipes:", err);
      // fall through to mock
    }
  }

  // Mock data fallback
  return res.json({
    recipes: [
      { id: 1, name: "Spaghetti Bolognese" },
      { id: 2, name: "Tacos" },
      { id: 3, name: "Chicken Stir Fry" },
    ],
  });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
