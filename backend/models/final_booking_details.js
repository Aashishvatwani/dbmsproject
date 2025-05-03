// In final_booking_details.js (model)
const db = require('./db');  // Assuming db is your MySQL connection

const getLatestFinal = (callback) => {
    // Query the database for the latest final booking record using the id or created_at column
    db.query('SELECT * FROM final_booking_details ORDER BY created_at DESC LIMIT 1', (err, results) => {
        if (err) {
            console.error("Error fetching final booking details: ", err);  // Log the error for debugging
            callback(err, null);
        } else {
            callback(null, results);  // Return the results to the callback
        }
    });
};

module.exports = {
    getLatestFinal
};
