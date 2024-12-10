require('dotenv').config();
const mysql = require('mysql2');

const dbConnection = mysql.createConnection({
  host: '34.101.90.135',
  user: 'root',
  password: 'planetku123',
  database: 'db_planetku',
  port: 3306,
});

async function executeQueryWithParams(query, params) {
  const [results] = await dbConnection.execute(query, params);
  return results;
}

dbConnection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

module.exports = dbConnection.promise();

module.exports = {
  executeQueryWithParams,
};
