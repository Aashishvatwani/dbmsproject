const db = require('./db');

const Restraurant = {
    getAllRestraurants: (callback) => {
        db.query('SELECT * FROM restaurants', callback);
    }
};

module.exports = Restraurant;