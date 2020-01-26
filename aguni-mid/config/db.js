var mariadb = require('mariadb');


// mariadb config object
var config = {
    host: "192.168.0.19",
    //host: "192.168.0.43",
    user: "root",
    password: "tkddnjs234",
    database: "aguni_mid",
    connectionLimit: 5
}


// create db connection pool 
var pool = mariadb.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
    connectionLimit: config.connectionLimit
});


module.exports = {
    pool: pool
}