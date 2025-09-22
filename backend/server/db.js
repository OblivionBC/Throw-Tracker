require("dotenv").config();
const { Pool } = require("pg");

// Production-safe logging
const isDevelopment = process.env.NODE_ENV === 'development';
const Logger = {
  log: (...args) => isDevelopment && console.log(...args),
  error: (...args) => isDevelopment && console.error(...args),
  warn: (...args) => isDevelopment && console.warn(...args),
  info: (...args) => isDevelopment && console.info(...args),
  debug: (...args) => isDevelopment && console.debug(...args),
  critical: (...args) => console.error(...args) // Always log critical errors
};


const PORT = process.env.DB_PORT;
const PASS = process.env.DB_USER_PASS;
const USER = process.env.DB_USER;
const HOST = process.env.DB_HOST;
const DB = process.env.DB_NAME;
const DB_URL = process.env.DB_URL;
const env = process.env.NODE_ENV;

let pool;
if (isDevelopment) {
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

(async () => {
    try {
        const res = await pool.query("SELECT NOW()");
        console.log("Supabase connected! Server time:", res.rows[0]);
        process.exit(0);
    } catch (err) {
        console.error("Failed to connect to Supabase:", err);
        process.exit(1);
    }
})();

pool.on("error", (err) => {
  Logger.error("Unexpected DB error", err);
  process.exit(-1);
});

module.exports = { pool };
