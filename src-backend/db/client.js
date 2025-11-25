import pg from "pg";

// connects to the postgresSQL DB
const db = new pg.Client(process.env.DATABASE_URL);
await db.connect();
// exports it so it can run queries in other files
export default db;

// TESTING GIT HUB BRANCHING AND MERGING
