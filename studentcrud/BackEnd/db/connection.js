const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',       // Database host
  user: 'root',            // Database username
  password: '',            // Database password
  database: 'event_management_system' // Database name
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
    process.exit(1);
  }
  console.log('Connected to MySQL database');
});

module.exports = connection;
