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

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
