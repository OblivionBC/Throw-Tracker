//pg is the module for postgres
const Pool = require("pg").Pool;

require("dotenv").config(); // Loading environment variables from a .env file
const PORT = process.env.DB_PORT; // Getting the port number from the environment variables
const PASS = process.env.DB_USER_PASS;

//new pool creates a DB connection using the params
const pool = new Pool({
  user: "postgres",
  password: "pokemonbeach1",
  host: "localhost",
  port: 5432,
  database: "trackapp",
});

module.exports = { pool };
