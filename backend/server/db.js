const Pool = require("pg").Pool;

require("dotenv").config(); // Loading environment variables from a .env file
const PORT = process.env.DB_PORT; // Getting the port number from the environment variables
const PASS = process.env.DB_USER_PASS;
const USER = process.env.DB_USER;
const HOST = process.env.DB_HOST;
const DB = process.env.DB_NAME;

//console.log(PORT + " " + PASS + " " + USER + " " + HOST + " " + DB);
//new pool creates a DB connection using the params
const pool = new Pool({
  user: USER,
  password: PASS,
  host: HOST,
  port: PORT,
  database: DB,
});

pool.on("error", (err) => {
  console.error("Unexpected DB error", err);
  process.exit(-1);
});

module.exports = { pool };
