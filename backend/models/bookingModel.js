const db = require('./db');

const Booking = {
    getAllbookings: (callback) => {
        db.query('SELECT * FROM booking', callback);
    }
};

module.exports = Booking;