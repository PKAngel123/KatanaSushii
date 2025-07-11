// public/js/bag.js
// Carrito de compras: mostrar, modificar, eliminar y finalizar compra

document.addEventListener('DOMContentLoaded', function() {
    renderCarrito();
});

function renderCarrito() {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const tbody = document.querySelector('.bag-table tbody');
    tbody.innerHTML = '';
    let subtotal = 0;
    carrito.forEach((item, idx) => {
        const sub = item.precio * item.cantidad;
        subtotal += sub;
        tbody.innerHTML += `
        <tr>
            <td><img src="${item.img}" alt="${item.nombre}"></td>
            <td>${item.nombre}</td>
            <td>
                <button onclick="cambiarCantidad(${idx}, -1)">-</button>
                <span style="margin:0 8px;">${item.cantidad}</span>
                <button onclick="cambiarCantidad(${idx}, 1)">+</button>
            </td>
            <td>$${item.precio.toFixed(2)}</td>
            <td>$${sub.toFixed(2)}</td>
            <td class="bag-actions">
                <button title="Eliminar" onclick="eliminarDelCarrito(${idx})"><i class="fas fa-trash-alt"></i></button>
            </td>
        </tr>`;
    });
    // Resumen
    const envio = carrito.length > 0 ? 3.00 : 0;
    document.querySelector('.bag-summary-detail span:last-child').textContent = `$${subtotal.toFixed(2)}`;
    document.querySelectorAll('.bag-summary-detail span')[3].textContent = `$${envio.toFixed(2)}`;
    document.querySelector('.bag-summary-total span:last-child').textContent = `$${(subtotal+envio).toFixed(2)}`;
}

function cambiarCantidad(idx, delta) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito[idx].cantidad += delta;
    if (carrito[idx].cantidad <= 0) carrito.splice(idx, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    renderCarrito();
}

function eliminarDelCarrito(idx) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.splice(idx, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    renderCarrito();
}

document.querySelector('.btn-checkout').addEventListener('click', finalizarCompra);

async function finalizarCompra() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario) {
        alert('Debes iniciar sesión para comprar.');
        return;
    }
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    if (carrito.length === 0) {
        alert('El carrito está vacío.');
        return;
    }
    // Método de pago
    const metodo = prompt('Método de pago (Efectivo/Tarjeta):', 'Efectivo');
    if (!metodo) return;
    // Info de envío del usuario
    const pedido = {
        cliente: usuario.nombre + ' ' + (usuario.apellido || ''),
        email: usuario.email,
        direccion: usuario.direccion,
        ciudad: usuario.ciudad,
        telefono: usuario.telefono,
        productos: carrito.map(p => `${p.nombre} x${p.cantidad}`).join(', '),
        total: carrito.reduce((sum, p) => sum + p.precio * p.cantidad, 0) + 3.00,
        metodo_pago: metodo
    };
    // Enviar al backend
    const res = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedido)
    });
    if (res.ok) {
        localStorage.removeItem('carrito');
        alert('¡Pedido realizado con éxito!');
        window.location.href = 'menu.html';
    } else {
        alert('Error al procesar el pedido.');
    }
}

// --- CONTADOR DINÁMICO DEL CARRITO Y POPUP LOGIN PERSISTENTE ---
function actualizarContadorCarrito() {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let total = carrito.reduce((sum, p) => sum + p.cantidad, 0);
    document.querySelectorAll('.bag-count').forEach(el => el.textContent = total);
}
document.addEventListener('DOMContentLoaded', actualizarContadorCarrito);

function actualizarPopupLogin() {
    const user = JSON.parse(localStorage.getItem('usuario'));
    const popup = document.querySelector('.popup-login');
    if (!popup) return;
    if (user) {
        popup.innerHTML = `<div class='login-title'>MI CUENTA</div>
            <div style='text-align:center;'>
                <span style='font-size:1.3rem;font-weight:bold;'>${user.nombre} ${(user.apellido||'')}</span><br>
                <span style='font-size:.95rem;color:#666;'>${user.email}</span><br>
                <span class='badge bg-success'>${user.rol==='admin'?'Administrador':'Cliente'}</span>
            </div>
            <hr>
            <button class='btn btn-danger btn-block w-100' onclick='logoutBag()' style='margin-top:8px;'>Cerrar sesión</button>`;
    }
}
document.addEventListener('DOMContentLoaded', actualizarPopupLogin);
window.logoutBag = function() {
    localStorage.removeItem('usuario');
    location.reload();
}
