const { Pool } = require("pg");
require('dotenv').config();
// Create a new pool here using the connection string above
// You can also use pool.query to run SQL queries
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE
});

module.exports = pool;
