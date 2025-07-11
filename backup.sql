-- backup.sql: Estructura y datos iniciales para Katana Sushi

CREATE DATABASE IF NOT EXISTS katana_sushi;
USE katana_sushi;

-- Tabla productos
CREATE TABLE IF NOT EXISTS productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  img VARCHAR(255),
  detalles TEXT
);

INSERT INTO productos (nombre, precio, img, detalles) VALUES
('Sushi Especial Katana', 25.00, './assets/platillos/platillo.jpg', 'Rollos de salmón, palta y queso crema, cubiertos con salsa especial Katana. Acompañado de jengibre y wasabi.'),
('Tempura Clásico', 25.00, './assets/img/img_not_found.jpg', 'Tempura de vegetales y camarones, crujiente y dorado.'),
('Ramen Tradicional', 25.00, './assets/platillos/platillo.jpg', 'Ramen con caldo de cerdo, fideos frescos y toppings japoneses.');

-- Tabla pedidos
CREATE TABLE IF NOT EXISTS pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente VARCHAR(100),
  email VARCHAR(100),
  direccion VARCHAR(255),
  ciudad VARCHAR(100),
  telefono VARCHAR(30),
  productos TEXT,
  total DECIMAL(10,2),
  metodo_pago VARCHAR(50),
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla detalle_pedido
CREATE TABLE IF NOT EXISTS detalle_pedido (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT,
  producto_id INT,
  cantidad INT,
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
  FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- Tabla usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100),
  apellido VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  rol VARCHAR(20) DEFAULT 'cliente',
  telefono VARCHAR(30),
  direccion VARCHAR(255),
  ciudad VARCHAR(100)
);

-- Usuario admin por defecto
INSERT IGNORE INTO usuarios (nombre, apellido, email, password, rol) VALUES ('Admin', 'Principal', 'admin@katana.com', '$2b$10$123456789012345678901u', 'admin');
