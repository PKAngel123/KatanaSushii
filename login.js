document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const email = document.getElementById('login_email').value;
  const password = document.getElementById('login_password').value;
  const msg = document.getElementById('login_msg');
  msg.textContent = "Procesando...";

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok) {
      msg.textContent = data.message;
      // Guarda el usuario en localStorage/sessionStorage
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      // Redirige según el rol
      if (data.usuario.rol === 'admin') {
        window.location.href = 'admin.html';
      } else {
        window.location.href = 'cliente.html';
      }
    } else {
      msg.textContent = data.message;
    }
  } catch (err) {
    msg.textContent = "Error de conexión con el servidor";
  }
});