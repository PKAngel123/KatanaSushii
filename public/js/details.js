// public/js/details.js
// Script para mostrar detalles dinámicos del platillo

document.addEventListener('DOMContentLoaded', async function() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) return;
    const producto = await fetch(`/api/productos`).then(r => r.json()).then(arr => arr.find(p => p.id == id));
    if (!producto) return;
    document.querySelector('.details-img').src = producto.img;
    document.querySelector('.details-img').alt = producto.nombre;
    document.querySelector('.details-title').textContent = producto.nombre;
    document.querySelector('.details-price').textContent = `$${Number(producto.precio).toFixed(2)} USD`;
    document.querySelector('.details-desc').textContent = producto.detalles || 'Sin descripción.';
    // Botón agregar al carrito
    document.querySelector('.btn-add').onclick = () => {
        agregarAlCarrito(producto);
        window.location.href = 'bag.html';
    };
    actualizarContadorCarrito();
    actualizarPopupLogin();
});

function agregarAlCarrito(producto) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const idx = carrito.findIndex(x => x.id === producto.id);
    if (idx >= 0) {
        carrito[idx].cantidad += 1;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function actualizarContadorCarrito() {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let total = carrito.reduce((sum, p) => sum + p.cantidad, 0);
    document.querySelectorAll('.bag-count').forEach(el => el.textContent = total);
}

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
            <button class='btn btn-danger btn-block w-100' onclick='logoutDetails()' style='margin-top:8px;'>Cerrar sesión</button>`;
    }
}
window.logoutDetails = function() {
    localStorage.removeItem('usuario');
    location.reload();
}
