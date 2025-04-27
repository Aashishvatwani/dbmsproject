const db = require('./db');

const Booking = {
    getAllbookings: (callback) => {
        db.query('SELECT * FROM bookings', callback);
    }
};

module.exports = Booking;