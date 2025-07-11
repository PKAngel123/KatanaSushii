// restore-db.js
// Restaura la base de datos desde backup.sql

const fs = require('fs');
const mysql = require('mysql');
const path = require('path');

const sqlFile = path.join(__dirname, 'backup.sql');
const sql = fs.readFileSync(sqlFile, 'utf8');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Cambia si tu usuario es diferente
  password: '', // Cambia si tienes contraseña
  multipleStatements: true
});

connection.connect();

connection.query(sql, function(err, results) {
  if (err) {
    console.error('Error restaurando la base de datos:', err);
  } else {
    console.log('Base de datos restaurada correctamente.');
  }
  connection.end();
});
