const { Pool } = require("pg");
require("dotenv").config({ path: "../../.env" });

const PORT = process.env.DB_PORT;
const PASS = process.env.DB_USER_PASS;
const USER = process.env.DB_USER;
const HOST = process.env.DB_HOST;
const DB = process.env.DB_NAME;
const DB_URL = process.env.DB_URL;
const env = process.env.NODE_ENV;

let isDev = env === "dev";
let pool = new Pool({});
if (isDev) {
  pool = new Pool({
    user: USER,
    password: PASS,
    host: HOST,
    port: PORT,
    database: DB,
  });
} else {
  pool = new Pool({
    connectionString: DB_URL,
    ssl: { rejectUnauthorized: false },
  });
}

pool.on("error", (err) => {
  console.error("Unexpected DB error", err);
  process.exit(-1);
});

async function testConnection() {
  try {
    const client = await pool.connect();
    const res = await client.query(
      "SELECT * FROM athlete_event_assignment LIMIT 1;"
    );
    console.log("Connected to Supabase! Sample row:", res.rows);
    client.release();
  } catch (err) {
    console.error("Failed to connect to Supabase:", err);
  }
}

testConnection();

module.exports = { pool };
