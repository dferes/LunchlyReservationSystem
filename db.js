const { Client } = require('pg');

// Use dev database, testing database, or via env var, production database
function getDatabaseUri() {
  return (process.env.NODE_ENV === "test")
    ? "lunchly_test"
    : process.env.DATABASE_URL || "lunchly";
}

if( process.env.NODE_ENV === 'production') {
  db = new Client({
    connectionString: getDatabaseUri(),
    ssl: {
      rejectUnauthorized: false
    }  
  });  
} else  db = new Client({ connectionString: getDatabaseUri()});
// let DB_URI = process.env.NODE_ENV === 'test' ? 'postgresql:///lunchly_test' : 'postgresql:///lunchly';

// let db = new Client({
//     connectionString: DB_URI
// });

db.connect();

module.exports = db;