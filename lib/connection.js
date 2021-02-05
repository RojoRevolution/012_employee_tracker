const mysql = require('mysql');
const cTable = require('console.table');

// Create Connection
const connection = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'squalus',
    database: 'employees_db',
};

module.exports = connection;