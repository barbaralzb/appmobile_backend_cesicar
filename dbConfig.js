// const mysql = require('mysql2');
require('dotenv').config();

// const connection = mysql.createPool({
//     host: process.env.MYSQL_HOST,
//     port: process.env.MYSQL_PORT,
//     user: process.env.MYSQL_USER,
//     password: process.env.MYSQL_PASSWORD,
//     database: process.env.MYSQL_DATABASE
// });

// module.exports = connection;

const mysql = require('mysql2');
const { Sequelize } = require('sequelize');

const db = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    dialect: 'mysql',
});


// Sincroniza los modelos con la base de datos
(async () => {
    try {
        // await db.sync({ force: true }); // Usa { force: true } solo en desarrollo para recrear las tablas
        console.log('Database synchronized successfully');
    } catch (error) {
        console.error('Error synchronizing database:', error);
    }
})();

module.exports = db;
