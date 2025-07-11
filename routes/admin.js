const express = require('express');
const router = express.Router();
const conexion = require('../conexion');

// --- PRODUCTOS ---
router.get('/productos', (req, res) => {
    conexion.query('SELECT * FROM productos', (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

router.post('/productos', (req, res) => {
    const { nombre, precio, img } = req.body;
    conexion.query('INSERT INTO productos (nombre, precio, img) VALUES (?, ?, ?)', [nombre, precio, img], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ success: true, id: result.insertId });
    });
});

router.put('/productos/:id', (req, res) => {
    const { nombre, precio, img } = req.body;
    conexion.query('UPDATE productos SET nombre=?, precio=?, img=? WHERE id=?', [nombre, precio, img, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ success: true });
    });
});

router.delete('/productos/:id', (req, res) => {
    conexion.query('DELETE FROM productos WHERE id=?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ success: true });
    });
});

// --- PEDIDOS ---
router.get('/pedidos', (req, res) => {
    let sql = 'SELECT * FROM pedidos';
    const params = [];
    if (req.query.estado) {
        sql += ' WHERE estado=?';
        params.push(req.query.estado);
    }
    conexion.query(sql, params, (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

router.put('/pedidos/:id/completar', (req, res) => {
    conexion.query('UPDATE pedidos SET estado="Completado" WHERE id=?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ success: true });
    });
});

// Puedes agregar más endpoints según lo necesites

module.exports = router;
