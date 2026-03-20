const mysql = require('mysql2/promise')

const pool = mysql.createPool({
  host: 'localhost',
  user: 'weatheruser',
  password: 'weather123',
  database: 'weatherapp',
  waitForConnections: true,
  connectionLimit: 10
})

module.exports = pool