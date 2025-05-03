const db = require('../models/db'); // MySQL connection

exports.createUser = (req, res) => {
    const { email, name, firebaseUid } = req.body;

    const query = `
        INSERT INTO userdata (email, username, id)
        VALUES (?, ?, ?)
    `;
    const values = [email, name, firebaseUid];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error inserting user:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        const userId = result.insertId;
        res.status(201).json({
            message: 'User created successfully',
            user_id: userId
        });
    });
};
