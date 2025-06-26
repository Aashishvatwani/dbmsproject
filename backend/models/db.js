const mysql = require('mysql2');

// Create a connection to the database
const connection = mysql.createConnection({
    host: 'localhost', // Replace with your database host
    port: 3306, // Default MySQL port
    user: 'root',      // Replace with your database username
    password: 'bharatloveyash123#',      // Replace with your database password
    database: 'trip' // Replace with your database name
});

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        return;
    }
    console.log('Connected to the MySQL server.');
});

module.exports = connection;