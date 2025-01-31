require("dotenv").config(); // Load .env file

const mysql = require("mysql2");

// ✅ Create Database Connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306 // Default MySQL port
});

// ✅ Connect to Database
connection.connect((err) => {
  if (err) {
    console.error("❌ Database Connection Failed:", err.message);
    process.exit(1); // Stop execution if DB connection fails
  } else {
    console.log("✅ Connected to MySQL Database");
  }
});

module.exports = connection;
