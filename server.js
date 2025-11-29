import app from "./app.js";
import db from "./src-backend/db/client.js";

// turns on node server
const PORT = process.env.PORT || 3000;
  app.listen(PORT);

const startServer = async () => {
  console.log("Starting server...");

  try {
    console.log("Connecting to DB.");
    await db.connect();
    console.log("DB Connected.");

    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}...`);
    });
  } catch (e) {
    console.warn("Failed to start server.");
    console.error(e);

    throw e;
  }
};

startServer();
