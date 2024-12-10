require('dotenv').config();
const mysql = require('mysql2');

const dbConnection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: 3306,
});

dbConnection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

async function executeQueryWithParams(query, params) {
  const [results] = await dbConnection.promise().query(query, params);
  return results;
}

module.exports = {
  dbConnection: dbConnection.promise(),
  executeQueryWithParams,
};
