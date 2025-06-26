const FinalModel = require('../models/expensesdata'); // Adjust the path as necessary

// Controller function to get the latest final booking details
const expenditure = (req, res) => {
    FinalModel.expenditure((err, expenses) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(expenses); // Send the latest final details as JSON
        console.log(expenses); // Optional: Log the data to the console
    });
};

module.exports = {
    expenditure
};
