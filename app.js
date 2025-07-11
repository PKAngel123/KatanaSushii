const express = require('express');
const app = express();
const conexion = require('./conexion'); // Tu módulo para conexión a la base de datos
const adminRoutes = require('./routes/admin'); // Rutas de administración (productos y pedidos)

app.use(express.json());
app.use(express.static('public')); // Sirve tu frontend desde la carpeta 'public'

// REGISTRO
app.post('/api/register', (req, res) => {
    console.log("¡Recibí una petición de registro!");
    const { tipo_documento, documento, nombre, apellido, telefono, direccion, ciudad, email, password } = req.body;

    if (!tipo_documento || !documento || !nombre || !apellido || !direccion || !ciudad || !email || !password) {
        return res.status(400).json({ success: false, message: 'Faltan campos obligatorios.' });
    }

    // Por defecto, todos los usuarios serán 'cliente'
    const sql = `INSERT INTO usuarios 
        (tipo_documento, documento, nombre, apellido, telefono, direccion, ciudad, email, password, rol) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    conexion.query(sql, [tipo_documento, documento, nombre, apellido, telefono, direccion, ciudad, email, password, 'cliente'], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Error al registrar usuario.', error: err });
        }
        res.json({ success: true, message: 'Usuario registrado correctamente.' });
    });
});

// LOGIN
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Faltan campos obligatorios.' });
    }

    const sql = "SELECT * FROM usuarios WHERE email = ?";
    conexion.query(sql, [email], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Error en el servidor.' });
        }
        if (results.length === 0) {
            return res.status(401).json({ success: false, message: 'Usuario no encontrado.' });
        }
        const usuario = results[0];
        // Comparación simple (mejorar con hash en producción)
        if (usuario.password !== password) {
            return res.status(401).json({ success: false, message: 'Contraseña incorrecta.' });
        }
        // No enviar la contraseña al frontend
        delete usuario.password;
        res.json({ success: true, message: 'Inicio de sesión exitoso.', usuario });
    });
});

// Endpoint para guardar pedidos
app.post('/api/pedidos', (req, res) => {
    const { cliente, email, direccion, ciudad, telefono, productos, total, metodo_pago } = req.body;
    if (!cliente || !productos || !total) {
        return res.status(400).json({ success: false, message: 'Faltan datos del pedido.' });
    }
    const sql = 'INSERT INTO pedidos (cliente, total, estado, fecha) VALUES (?, ?, ?, NOW())';
    conexion.query(sql, [cliente, total, 'Pendiente'], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: 'Error al guardar pedido.', error: err });
        const pedidoId = result.insertId;
        // Guardar detalle (opcional, aquí solo como texto en la tabla pedidos)
        // Si tienes tabla detalle_pedido, aquí puedes hacer un insert múltiple
        // Actualizar la tabla pedidos para guardar productos, email, direccion, ciudad, telefono, metodo_pago
        const updateSql = 'UPDATE pedidos SET productos=?, email=?, direccion=?, ciudad=?, telefono=?, metodo_pago=? WHERE id=?';
        conexion.query(updateSql, [productos, email, direccion, ciudad, telefono, metodo_pago, pedidoId], (err2) => {
            if (err2) return res.status(500).json({ success: false, message: 'Error al guardar detalles.', error: err2 });
            res.json({ success: true, id: pedidoId });
        });
    });
});

app.use('/api', adminRoutes); // Exponer los endpoints de administración al frontend

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});