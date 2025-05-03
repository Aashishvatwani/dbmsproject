const db = require('../models/db');  // MySQL connection
const axios = require('axios');

// Generate a random price between min and max

// Create Package
exports.createPackage = async (req, res) => {
    const { city, restaurant , price, user_id} = req.body;  // city and restaurant from the request body

    try {
        // Generate a random package name
        const packageName = `${restaurant} - ${city} Package`;

        // Generate a random price for the package (e.g., between ₹2000 to ₹5000)
        

        // Insert package into database
        const query = `INSERT INTO packages (city, restaurant, package_name, price, user_id) VALUES (?, ?, ?, ?, ?)`;
        const values = [city, restaurant, packageName, price, user_id];

        db.query(query, values, (err, result) => {
            if (err) {
                console.error('Error creating package:', err);
                return res.status(500).send('Failed to create package');
            }
            res.status(201).json({
                message: 'Package created successfully!',
                package: {
                    city,
                    restaurant,
                    package_name: packageName,
                    price,
                    user_id,
                }
            });
        });
    } catch (error) {
        console.error('Error creating package:', error);
        res.status(500).send('Failed to create package');
    }
};
