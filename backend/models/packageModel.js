const db = require('./db');

const Package = {
    getAllPackages: (callback) => {
        db.query('SELECT * FROM packages', callback);
    }
};

module.exports = Package;