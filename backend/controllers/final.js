const FinalModel = require('../models/final_booking_details'); // Adjust the path as necessary

// Controller function to get the latest final booking details
const getfinals = (req, res) => {
    FinalModel.getLatestFinal((err, finals) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(finals); // Send the latest final details as JSON
        console.log(finals); // Optional: Log the data to the console
    });
};

module.exports = {
    getfinals
};
