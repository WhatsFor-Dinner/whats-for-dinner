import pg from "pg";

// connects to the postgresSQL DB
const db = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// exports it so it can run queries in other files
export default db;
