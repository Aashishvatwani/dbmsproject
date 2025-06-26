const db = require('../models/db'); // MySQL connection

exports.expenseUser = (req, res) => {
    const { name, for_what, amount } = req.body;

    const query = `
        INSERT INTO expenditure (student_name, for_what, amount)
        VALUES (?, ?, ?)
    `;
    const values = [name, for_what, amount];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error inserting user:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        const userId = result.insertId;
        res.status(201).json({
            message: 'User created successfully',
            
        });
    });
};
