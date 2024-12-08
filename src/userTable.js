const dbConnection = require('./config/db.js')

const getUser = async (id, name) => {
    let SQLQuery;
    const queryParams = [];

    if (id) {
        SQLQuery = 'SELECT * FROM users WHERE id = ?';
        queryParams.push(id);
    } else if (name) {
        SQLQuery = 'SELECT * FROM users WHERE name = ?';
        queryParams.push(name);
    } else {
        throw new Error('Either id or name must be provided');
    }

    return dbConnection.execute(SQLQuery, queryParams);
};

const createNewUser = (body) => {
    const SQLQuery = `INSERT INTO users (name, username, password) 
                      VALUE ('${body.name}', '${body.username}', '${body.password}')`;

    return dbConnection.execute(SQLQuery);
}

const updateUser = (body, id) => {
    const SQLQuery = `UPDATE users SET name='${body.name}', email='${body.email}', password=${body.password}
                      WHERE id =${body.id}`;

    return dbConnection.execute(SQLQuery);
}

const deleteUser = (id) => {
    const SQLQuery = `DELETE FROM users WHERE id=${id}`;

    return dbConnection.execute(SQLQuery);
}

module.exports = {
    getUser,
    createNewUser,
    updateUser,
    deleteUser,
}