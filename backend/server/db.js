import pg from 'pg'
const Pool = pg.Pool;

import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

const PORT = process.env.DB_PORT; // Getting the port number from the environment variables
const PASS = process.env.DB_USER_PASS;
const USER = process.env.DB_USER;
const HOST = process.env.DB_HOST;
const DB = process.env.DB_NAME;
const DB_URL = process.env.URL;
const env = process.env.NODE_ENV;

let isDev = process.env.NODE_ENV === 'dev'
let pool = new Pool({})
if(isDev){
    pool = new Pool({
        user: USER,
        password: PASS,
        host: HOST,
        port: PORT,
        database: DB,
    });
}else{
     pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
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
            'SELECT assigned_by_prsn_rk FROM athlete_event_assignment LIMIT 1;'
        );
        console.log('Connected to Supabase! Sample row:', res.rows);
        client.release();
    } catch (err) {
        console.error('Failed to connect to Supabase:', err);
    }
}

await testConnection();

module.exports = { pool };
