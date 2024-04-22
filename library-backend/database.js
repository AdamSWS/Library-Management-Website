const { Pool } = require("pg");
require('dotenv').config(); // Loads environment variables from a .env file into process.env

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE
});

module.exports = pool;
