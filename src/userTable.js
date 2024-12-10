const { dbConnection } = require('./config/db.js');
// GetDataForProfile

const GetDataForProfile = async (id) => {
  const getData = `SELECT name, username, email FROM users WHERE id = ${id}`;
  return dbConnection.execute(getData);
};

// Get User
const getUser = async (id, username) => {
  let SQLQuery;
  const queryParams = [];

  if (id) {
    SQLQuery = 'SELECT * FROM users WHERE id = ?';
    queryParams.push(id);
  } else if (username) {
    SQLQuery = 'SELECT * FROM users WHERE username = ?';
    queryParams.push(username);
  } else {
    throw new Error('Either id or name must be provided');
  }

  return dbConnection.execute(SQLQuery, queryParams);
};

// Create User
const createNewUser = (body) => {
  const SQLQuery = `INSERT INTO users (name, username, password) 
                      VALUE ('${body.name}', '${body.username}', '${body.password}')`;

  return dbConnection.execute(SQLQuery);
};

// Update User

const updateUser = (body) => {
  const SQLQuery = `UPDATE users SET name='${body.name}', email='${body.email}'
                      WHERE id =${body.id}`;

  return dbConnection.execute(SQLQuery);
};

// Delete User

const deleteUser = (id) => {
  const SQLQuery = `DELETE FROM users WHERE id=${id}`;

  return dbConnection.execute(SQLQuery);
};

module.exports = {
  getUser,
  createNewUser,
  updateUser,
  deleteUser,
  GetDataForProfile,
};
