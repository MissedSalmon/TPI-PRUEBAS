-- Script SQL para crear la base de datos y tabla de productos
-- Ejecutar este script en SQL Server Management Studio

-- Crear base de datos (opcional, si no existe)
-- CREATE DATABASE MiAppDB;
-- GO

-- Usar la base de datos
-- USE MiAppDB;
-- GO

-- Crear tabla de productos
CREATE TABLE Productos (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(100) NOT NULL,
    descripcion NVARCHAR(500),
    precio DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    fecha_creacion DATETIME DEFAULT GETDATE()
);
GO

-- Insertar datos de ejemplo
INSERT INTO Productos (nombre, descripcion, precio, stock) VALUES
('Laptop Dell', 'Laptop para desarrollo con 16GB RAM', 1200.00, 5),
('Mouse Inalámbrico', 'Mouse óptico inalámbrico USB', 25.99, 20),
('Teclado Mecánico', 'Teclado mecánico RGB para gaming', 89.99, 15),
('Monitor 24"', 'Monitor Full HD 1920x1080', 199.99, 8),
('Auriculares', 'Auriculares con cancelación de ruido', 149.99, 12);
GO

-- Verificar que los datos se insertaron correctamente
SELECT * FROM Productos;
GO
