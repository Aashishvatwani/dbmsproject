const db = require('./db');

const user = {
    userdata: (callback) => {
        db.query('SELECT * FROM userdata', callback);
    }
};

module.exports = user;