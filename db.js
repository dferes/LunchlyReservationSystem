const { Client } = require('pg');

let DB_URI = process.env.NODE_ENV === 'test' ? 'postgresql:///lunchly_test' : 'postgresql:///lunchly';

let db = new Client({
    connectionString: DB_URI
});

db.connect();

module.exports = db;