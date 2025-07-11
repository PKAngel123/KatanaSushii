// public/js/index-platillos.js
// Script para platillos destacados en index.html

document.addEventListener('DOMContentLoaded', async function() {
    // Cargar productos desde la base de datos
    const productos = await fetch('/api/productos').then(r => r.json());
    const cards = document.querySelectorAll('.platillos-section .card');
    // Asignar datos reales a las cards (asume que hay 3 cards y al menos 3 productos)
    cards.forEach((card, i) => {
        const p = productos[i] || productos[0];
        card.querySelector('img').src = p.img;
        card.querySelector('img').alt = p.nombre;
        card.querySelector('.card-title').textContent = p.nombre;
        card.querySelector('.badge').textContent = `$${Number(p.precio).toFixed(2)} USD`;
        // Botón Agregar
        card.querySelector('.btn-success').onclick = () => {
            agregarAlCarrito(p);
            window.location.href = 'bag.html';
        };
        // Botón Detalles
        card.querySelector('.btn-info').onclick = (e) => {
            e.preventDefault();
            window.location.href = `details.html?id=${p.id}`;
        };
    });
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
