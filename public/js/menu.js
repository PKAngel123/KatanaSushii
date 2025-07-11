// public/js/menu.js
// Cargar productos desde la base de datos y mostrar en el menú

document.addEventListener('DOMContentLoaded', async function() {
    const productos = await fetchProductos();
    let productosFiltrados = productos;
    renderMenu(productosFiltrados);
    actualizarContadorCarrito();
    // --- Filtro de búsqueda ---
    const searchBtn = document.querySelector('.center .menu-search:nth-child(2)');
    let searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Buscar platillo...';
    searchInput.style = 'margin-left:10px;padding:4px 10px;border-radius:7px;border:1px solid #ccc;';
    let searchActive = false;
    searchBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (!searchActive) {
            searchBtn.parentNode.appendChild(searchInput);
            searchInput.focus();
            searchActive = true;
        }
    });
    searchInput.addEventListener('input', function() {
        const val = searchInput.value.trim().toLowerCase();
        productosFiltrados = productos.filter(p => p.nombre.toLowerCase().includes(val));
        renderMenu(productosFiltrados);
    });
    // Eliminar búsqueda
    document.querySelector('.btn-danger').addEventListener('click', function() {
        searchInput.value = '';
        productosFiltrados = productos;
        renderMenu(productosFiltrados);
    });
    // --- POPUP LOGIN PERSISTENTE ---
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
                <button class='btn btn-danger btn-block w-100' onclick='logoutMenu()' style='margin-top:8px;'>Cerrar sesión</button>`;
        } else {
            // ...no logueado, dejar el form por defecto...
        }
    }
    actualizarPopupLogin();
    window.logoutMenu = function() {
        localStorage.removeItem('usuario');
        location.reload();
    }
    // --- ORDENAR POR ---
    const ordenarBtn = document.querySelector('.right .menu-search');
    let ordenarMenu = document.createElement('div');
    ordenarMenu.style = 'position:absolute;z-index:1000;background:#23201c;border:1px solid #f7c873;padding:8px 0;border-radius:8px;top:32px;right:0;min-width:160px;box-shadow:0 4px 16px #0005;display:none;';
    ordenarMenu.innerHTML = `
        <div style='padding:7px 18px;cursor:pointer;' data-ord='az'>A-Z</div>
        <div style='padding:7px 18px;cursor:pointer;' data-ord='za'>Z-A</div>
        <div style='padding:7px 18px;cursor:pointer;' data-ord='menor'>Precio menor</div>
        <div style='padding:7px 18px;cursor:pointer;' data-ord='mayor'>Precio mayor</div>
    `;
    ordenarBtn.style.position = 'relative';
    ordenarBtn.appendChild(ordenarMenu);
    ordenarBtn.addEventListener('click', function(e) {
        e.preventDefault();
        ordenarMenu.style.display = ordenarMenu.style.display === 'block' ? 'none' : 'block';
    });
    ordenarMenu.querySelectorAll('div').forEach(opt => {
        opt.addEventListener('click', function() {
            const ord = this.getAttribute('data-ord');
            if (ord === 'az') productosFiltrados.sort((a,b)=>a.nombre.localeCompare(b.nombre));
            if (ord === 'za') productosFiltrados.sort((a,b)=>b.nombre.localeCompare(a.nombre));
            if (ord === 'menor') productosFiltrados.sort((a,b)=>a.precio-b.precio);
            if (ord === 'mayor') productosFiltrados.sort((a,b)=>b.precio-a.precio);
            renderMenu(productosFiltrados);
            ordenarMenu.style.display = 'none';
        });
    });
    document.addEventListener('mousedown', function(e){
        if (!ordenarBtn.contains(e.target)) ordenarMenu.style.display = 'none';
    });
});

async function fetchProductos() {
    const res = await fetch('/api/productos');
    return await res.json();
}

function renderMenu(productos) {
    const contenedor = document.getElementById('menu-productos');
    contenedor.innerHTML = '';
    productos.forEach(p => {
        contenedor.innerHTML += `
        <div class="card shadow-1-strong">
            <img class="card-img-top" src="${p.img}" alt="${p.nombre}">
            <div class="card-body text-center">
                <h5 class="card-title font-weight-bold">${p.nombre}</h5>
                <p class="card-text lead"><span class="badge bg-secondary">$${p.precio.toFixed(2)} USD</span></p>
            </div>
            <div class="card-body text-center">
                <button type="button" class="btn btn-success btn-sm" onclick='agregarAlCarrito(${JSON.stringify(p)})'><i class="fas fa-shopping-bag fa-fw"></i> &nbsp; Agregar</button>
            </div>
        </div>`;
    });
}

function agregarAlCarrito(producto) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const idx = carrito.findIndex(x => x.id === producto.id);
    if (idx >= 0) {
        carrito[idx].cantidad += 1;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
    Swal.fire({
        icon: 'success',
        title: 'Agregado al carrito',
        timer: 900,
        showConfirmButton: false
    });
}

function actualizarContadorCarrito() {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let total = carrito.reduce((sum, p) => sum + p.cantidad, 0);
    document.querySelectorAll('.bag-count').forEach(el => el.textContent = total);
}
