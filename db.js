
const mysql = require('mysql2/promise');

// Create MySQL connection pool
const pool = mysql.createPool({
  host: '10.101.43.1',
  user: 'node-user',
  password: 'welcome',
  database: 'production',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;

