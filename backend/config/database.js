// config/database.js
const { Pool } = require('pg');
const dotenv = require('dotenv');
const { Sequelize } = require('sequelize');
const path = require('path');

// Load environment variables from backend directory
dotenv.config({ path: path.join(__dirname, '../.env') });
const sequelize = new Sequelize(
  process.env.DB_NAME,       // Database name
  process.env.DB_USER,       // Database username
  process.env.DB_PASSWORD,   // Database password
  {
    host: process.env.DB_HOST,   // Database host
    dialect: 'postgres',      // Or 'mysql', 'sqlite', 'mssql'
    port: process.env.DB_PORT,
    logging: false,// console.log,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
  }
);


// Database connection configuration
const pool = new Pool({
  user: process.env.DB_USER || 'soundwave_user',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'soundwave_db',
  password: process.env.DB_PASSWORD || 'soundwave_password',
  port: process.env.DB_PORT || 5432,
});

// Test the database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Database connected successfully:', res.rows[0].now);
  }
});

module.exports = {
  pool, 
  sequelize
};