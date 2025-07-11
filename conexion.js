const mysql = require('mysql2');
let conexion;
if (process.env.MYSQL_URL) {
    // Railway u otras plataformas pueden proveer la URL completa
    conexion = mysql.createConnection(process.env.MYSQL_CON);
} else {
    conexion = mysql.createConnection({
        host: process.env.DB_HOST || "localhost",
        database: process.env.DB_NAME || "servicios",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || ""
    });
}

conexion.connect(function(err){
    if(err){
        throw err;
    }else{
    console.log("conexion exitosa");
    }
});

module.exports = conexion;
