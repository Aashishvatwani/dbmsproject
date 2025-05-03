const db = require('../models/db');  // MySQL connection

// Utility function to format date to MySQL DATETIME format (YYYY-MM-DD HH:MM:SS)
const formatDateForMySQL = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

exports.createBooking = async (req, res) => {
    const { fromdate, todate, mediam, fromcity ,user_id} = req.body;  // Extracting data from request body

    try {
        // Format the fromdate and todate to MySQL DATETIME format
        const formattedFromDate = formatDateForMySQL(fromdate);
        const formattedToDate = formatDateForMySQL(todate);

        // Generate a random package name and price (if required)
        // Example: Random price generation between ₹2000 and ₹5000
        const randomPrice = Math.floor(Math.random() * (5000 - 2000 + 1)) + 2000;

        // Insert booking into the database
        const query = `INSERT INTO booking (fromdate, todate, mediam, fromcity,user_id) VALUES (?, ?, ?, ?,?)`;
        const values = [formattedFromDate, formattedToDate, mediam, fromcity,user_id];

        db.query(query, values, (err, result) => {
            if (err) {
                console.error('Error creating booking:', err);
                return res.status(500).send('Failed to create booking');
            }
            res.status(201).json({
                message: 'Booking created successfully!',
                booking: {
                    fromdate: formattedFromDate,
                    todate: formattedToDate,
                    mediam,
                    fromcity,
                    user_id // Sending random price as part of response (if needed)
                }
            });
        });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).send('Failed to create booking');
    }
};
