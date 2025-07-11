const express = require('express');
const router = express.Router();
const conexion = require('../conexion'); // Ajusta el path si es necesario

router.post('/register', (req, res) => {
    const { username, password, email } = req.body;
    // Reemplaza 'usuarios' por el nombre de tu tabla si es diferente
    const sql = 'INSERT INTO usuarios (username, password, email) VALUES (?, ?, ?)';
    conexion.query(sql, [username, password, email], (err, result) => {
        if(err){
            return res.status(500).json({ success: false, message: 'Error al registrar usuario' });
        }
        res.json({ success: true, message: 'Usuario registrado correctamente' });
    });
});

module.exports = router;