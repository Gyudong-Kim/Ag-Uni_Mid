var mariadb = require('mariadb');


// mariadb config object
var config = { 
    //host: "192.168.1.50",
    host: "192.168.0.9",
    user: "root",           // 사용자
    password: "a28a01a!", // DB 비번
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
