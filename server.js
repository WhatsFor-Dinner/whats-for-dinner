import app from "./app.js";
import db from "./src-backend/db/client.js";

// turns on node server
const PORT = process.env.PORT ?? 3000;

// Try to connect to database, but continue if it fails
try {
  await db.connect();
  console.log("Database connected successfully");
} catch (err) {
  console.warn("⚠️  Database connection failed:", err.message);
  console.warn(
    "Server will run without database—API queries may return mock data or fail gracefully"
  );
}

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
