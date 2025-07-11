document.getElementById('registerForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const tipo_documento = document.getElementById('tipo_documento').value;
  const documento = document.getElementById('documento').value;
  const nombre = document.getElementById('nombre').value;
  const apellido = document.getElementById('apellido').value;
  const telefono = document.getElementById('telefono').value;
  const direccion = document.getElementById('direccion').value;
  const ciudad = document.getElementById('ciudad').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const res = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      tipo_documento, 
      documento, 
      nombre, 
      apellido, 
      telefono, 
      direccion, 
      ciudad, 
      email, 
      password 
    })
  });

  const data = await res.json();
  alert(data.message);
});