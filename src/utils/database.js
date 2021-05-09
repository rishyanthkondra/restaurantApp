const { Pool } = require('pg');

const pool = new Pool({
    user: 'restaurantAdmin',     //your postgres username
    host: 'localhost', 
    database: 'restaurant', //your local database 
    password: 'restaurant', //your postgres user password
    port: 5432, //your postgres running port
});

pool.connect();


module.exports = pool;
