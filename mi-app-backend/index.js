const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { getConnection, sql } = require('./dbConfig');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('¡El servidor backend está funcionando!');
});

// ===== ENDPOINTS PARA PRODUCTOS =====

// GET - Obtener todos los productos
app.get('/api/productos', async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query('SELECT * FROM Productos ORDER BY id DESC');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error en el servidor al obtener los productos' });
  }
});

// GET - Obtener un producto por ID
app.get('/api/productos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getConnection();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Productos WHERE id = @id');
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ error: 'Error en el servidor al obtener el producto' });
  }
});

// POST - Crear un nuevo producto
app.post('/api/productos', async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock } = req.body;
    
    // Validación básica
    if (!nombre || !precio) {
      return res.status(400).json({ error: 'Nombre y precio son requeridos' });
    }
    
    const pool = await getConnection();
    const result = await pool.request()
      .input('nombre', sql.NVarChar, nombre)
      .input('descripcion', sql.NVarChar, descripcion || '')
      .input('precio', sql.Decimal(10, 2), precio)
      .input('stock', sql.Int, stock || 0)
      .query(`
        INSERT INTO Productos (nombre, descripcion, precio, stock) 
        OUTPUT INSERTED.*
        VALUES (@nombre, @descripcion, @precio, @stock)
      `);
    
    res.status(201).json(result.recordset[0]);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error en el servidor al crear el producto' });
  }
});

// PUT - Actualizar un producto
app.put('/api/productos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock } = req.body;
    
    const pool = await getConnection();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('nombre', sql.NVarChar, nombre)
      .input('descripcion', sql.NVarChar, descripcion || '')
      .input('precio', sql.Decimal(10, 2), precio)
      .input('stock', sql.Int, stock || 0)
      .query(`
        UPDATE Productos 
        SET nombre = @nombre, descripcion = @descripcion, precio = @precio, stock = @stock
        OUTPUT INSERTED.*
        WHERE id = @id
      `);
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: 'Error en el servidor al actualizar el producto' });
  }
});

// DELETE - Eliminar un producto
app.delete('/api/productos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getConnection();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Productos WHERE id = @id');
    
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error en el servidor al eliminar el producto' });
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});


