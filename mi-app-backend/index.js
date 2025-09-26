import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { getConnection, sql } from './dbConfig.js';
import { initSchema } from './schemaInit.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.send('¡El servidor backend está funcionando!');
});

// Endpoint de salud que no requiere base de datos
app.get('/health', (_req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// ===== ENDPOINTS PARA PRODUCTOS =====

// GET - Obtener todos los productos
app.get('/api/productos', async (_req, res) => {
  try {
    const pool = await getConnection();
    if (!pool) {
      return res.status(503).json({ error: 'Servicio de base de datos no disponible' });
    }
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
    
    // Validación del ID
    if (!id || isNaN(id) || !Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({ error: 'ID debe ser un número entero positivo' });
    }
    
    const pool = await getConnection();
    if (!pool) {
      return res.status(503).json({ error: 'Servicio de base de datos no disponible' });
    }
    const result = await pool.request()
      .input('id', sql.Int, parseInt(id))
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
    
    // Validación robusta
    if (!nombre || typeof nombre !== 'string' || nombre.trim().length === 0) {
      return res.status(400).json({ error: 'Nombre es requerido y debe ser una cadena no vacía' });
    }
    
    if (!precio || isNaN(precio) || parseFloat(precio) < 0) {
      return res.status(400).json({ error: 'Precio es requerido y debe ser un número positivo' });
    }
    
    if (descripcion && typeof descripcion !== 'string') {
      return res.status(400).json({ error: 'Descripción debe ser una cadena de texto' });
    }
    
    if (stock !== undefined && (isNaN(stock) || !Number.isInteger(Number(stock)) || Number(stock) < 0)) {
      return res.status(400).json({ error: 'Stock debe ser un número entero no negativo' });
    }
    
    const pool = await getConnection();
    if (!pool) {
      return res.status(503).json({ error: 'Servicio de base de datos no disponible' });
    }
    const result = await pool.request()
      .input('nombre', sql.NVarChar(255), nombre.trim())
      .input('descripcion', sql.NVarChar(sql.MAX), descripcion ? descripcion.trim() : '')
      .input('precio', sql.Decimal(10, 2), parseFloat(precio))
      .input('stock', sql.Int, stock !== undefined ? parseInt(stock) : 0)
      .query(`
        INSERT INTO Productos (nombre, descripcion, precio, stock) 
        OUTPUT INSERTED.*
        VALUES (@nombre, @descripcion, @precio, @stock)
      `);
    
    res.status(201).json(result.recordset[0]);
  } catch (error) {
    console.error('Error al crear producto:', error);
    if (error.code === 'EREQUEST' && error.number === 2627) {
      return res.status(409).json({ error: 'Ya existe un producto con ese nombre' });
    }
    res.status(500).json({ error: 'Error en el servidor al crear el producto' });
  }
});

// PUT - Actualizar un producto
app.put('/api/productos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock } = req.body;
    
    // Validación del ID
    if (!id || isNaN(id) || !Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({ error: 'ID debe ser un número entero positivo' });
    }
    
    // Validación de campos
    if (nombre !== undefined && (typeof nombre !== 'string' || nombre.trim().length === 0)) {
      return res.status(400).json({ error: 'Nombre debe ser una cadena no vacía' });
    }
    
    if (precio !== undefined && (isNaN(precio) || parseFloat(precio) < 0)) {
      return res.status(400).json({ error: 'Precio debe ser un número positivo' });
    }
    
    if (descripcion !== undefined && typeof descripcion !== 'string') {
      return res.status(400).json({ error: 'Descripción debe ser una cadena de texto' });
    }
    
    if (stock !== undefined && (isNaN(stock) || !Number.isInteger(Number(stock)) || Number(stock) < 0)) {
      return res.status(400).json({ error: 'Stock debe ser un número entero no negativo' });
    }
    
    const pool = await getConnection();
    if (!pool) {
      return res.status(503).json({ error: 'Servicio de base de datos no disponible' });
    }
    const result = await pool.request()
      .input('id', sql.Int, parseInt(id))
      .input('nombre', sql.NVarChar(255), nombre ? nombre.trim() : null)
      .input('descripcion', sql.NVarChar(sql.MAX), descripcion !== undefined ? descripcion.trim() : null)
      .input('precio', sql.Decimal(10, 2), precio !== undefined ? parseFloat(precio) : null)
      .input('stock', sql.Int, stock !== undefined ? parseInt(stock) : null)
      .query(`
        UPDATE Productos 
        SET nombre = ISNULL(@nombre, nombre), 
            descripcion = ISNULL(@descripcion, descripcion), 
            precio = ISNULL(@precio, precio), 
            stock = ISNULL(@stock, stock)
        OUTPUT INSERTED.*
        WHERE id = @id
      `);
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    if (error.code === 'EREQUEST' && error.number === 2627) {
      return res.status(409).json({ error: 'Ya existe un producto con ese nombre' });
    }
    res.status(500).json({ error: 'Error en el servidor al actualizar el producto' });
  }
});

// DELETE - Eliminar un producto
app.delete('/api/productos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validación del ID
    if (!id || isNaN(id) || !Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({ error: 'ID debe ser un número entero positivo' });
    }
    
    const pool = await getConnection();
    if (!pool) {
      return res.status(503).json({ error: 'Servicio de base de datos no disponible' });
    }
    const result = await pool.request()
      .input('id', sql.Int, parseInt(id))
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

// Inicializar esquema y arrancar servidor
(async () => {
  try {
    await initSchema();
  } catch (e) {
    console.error('Continuando pese al error de initSchema. Los endpoints devolverán 503 si DB no está disponible.');
  }
  app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
  });
})();


