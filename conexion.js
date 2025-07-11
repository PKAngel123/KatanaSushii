const mysql = require('mysql');
const connection = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT
});

conexion.connect(function(err){
    if(err){
        throw err;
    }else{
    console.log("conexion exitosa");
    }
});

module.exports = conexion;
