var mariadb = require('mariadb');


// mariadb config object
var config = {
    host: "192.168.0.19",   
    user: "root",           // 사용자
    password: "tkddnjs234", // DB 비번
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