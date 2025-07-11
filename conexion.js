const mysql = require('mysql');
const conexion = mysql.createConnection({
    host: "localhost",
    database: "servicios",
    user: "root",
    password: ""
});

conexion.connect(function(err){
    if(err){
        throw err;
    }else{
    console.log("conexion exitosa");
    }
});

module.exports = conexion;