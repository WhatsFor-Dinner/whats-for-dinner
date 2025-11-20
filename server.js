import app from "./app.js";
import db from "./src-backend/db/client.js";

// turns on node server
const PORT = process.env.PORT ?? 3000;

await db.connect();

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
