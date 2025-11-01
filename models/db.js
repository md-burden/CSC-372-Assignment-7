// Name: Matthew Burden
// Date: 11/01/2025
// CSC 372-01

// This is the database connection module.
require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});
module.exports = pool;