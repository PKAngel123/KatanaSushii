const mysql = require('mysql2');
const conexion = mysql.createConnection({
    host: process.env.MYSQLHOST || "localhost",
    database: process.env.MYSQLDATABASE || "servicios",
    user: process.env.MYSQLUSER || "root",
    password: process.env.MYSQLPASSWORD || "",
    port: process.env.MYSQLPORT || 3306
});

conexion.connect(function(err){
    if(err){
        throw err;
    }else{
        console.log("conexion exitosa");
    }
});

module.exports = conexion;
