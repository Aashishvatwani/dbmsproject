const db = require('./db');

const City = {
    getAllCities: (callback) => {
        db.query('SELECT * FROM cities', callback);
    }
};

module.exports = City;
