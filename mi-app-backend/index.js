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
  res.send('¡El servidor backend está VIVOOOOOO!');
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

    const request = pool.request().input('id', sql.Int, parseInt(id));

    // Verificar si el producto tiene reservas asociadas
    const checkReservas = await request.query('SELECT COUNT(*) as count FROM ReservasProductos WHERE productoId = @id');
    if (checkReservas.recordset[0].count > 0) {
      return res.status(409).json({ 
        error: 'Conflicto: No se puede eliminar el producto porque tiene reservas asociadas.' 
      });
    }

    // Si no hay reservas, proceder a eliminar
    const result = await request.query('DELETE FROM Productos WHERE id = @id');
    
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    // Manejar el error de FK por si acaso, aunque la comprobación previa debería evitarlo
    if (error.number === 547) {
      return res.status(409).json({ 
        error: 'Conflicto: No se puede eliminar el producto porque tiene reservas asociadas.' 
      });
    }
    res.status(500).json({ error: 'Error en el servidor al eliminar el producto' });
  }
});

// ===== ENDPOINTS PARA STOCK =====

// POST - Reservar stock para una compra
app.post('/api/stock/reservar', async (req, res) => {
  const { idCompra, usuarioId, productos } = req.body;

  // Validación de entrada
  if (!idCompra || !usuarioId || !productos || !Array.isArray(productos) || productos.length === 0) {
    return res.status(400).json({ error: 'Datos de entrada inválidos para la reserva.' });
  }

  const pool = await getConnection();
  if (!pool) {
    return res.status(503).json({ error: 'Servicio de base de datos no disponible' });
  }

  // Iniciamos una transacción
  const transaction = new sql.Transaction(pool);
  try {
    await transaction.begin();
    const request = new sql.Request(transaction);

    let productosInfo = [];
    // 1. Verificar stock y bloquear filas de productos
    for (const item of productos) {
      const result = await request.input(`p${item.idProducto}`, sql.Int, item.idProducto)
        .query(`SELECT * FROM Productos WITH (UPDLOCK) WHERE id = @p${item.idProducto}`);
      
      const productoDB = result.recordset[0];
      if (!productoDB) {
        throw new Error(`Producto con ID ${item.idProducto} no encontrado.`);
      }
      if (productoDB.stock < item.cantidad) {
        throw new Error(`Stock insuficiente para el producto ${productoDB.nombre}. Solicitado: ${item.cantidad}, Disponible: ${productoDB.stock}`);
      }
      productosInfo.push({ ...productoDB, cantidad: item.cantidad });
    }

    // 2. Crear la reserva
    const reservaResult = await request
      .input('idCompra', sql.NVarChar, idCompra)
      .input('usuarioId', sql.Int, usuarioId)
      .query(`
        INSERT INTO Reservas (idCompra, usuarioId)
        OUTPUT INSERTED.id, INSERTED.createdAt
        VALUES (@idCompra, @usuarioId)
      `);
    const { id: reservaId, createdAt: fechaCreacion } = reservaResult.recordset[0];

    // 3. Actualizar stock y registrar en ReservasProductos
    for (const p of productosInfo) {
      // Descontar stock
      await request
        .input(`stock${p.id}`, sql.Int, p.cantidad)
        .input(`prodId${p.id}`, sql.Int, p.id)
        .query(`UPDATE Productos SET stock = stock - @stock${p.id} WHERE id = @prodId${p.id}`);
      
      // Insertar en tabla de unión
      await request
        .input(`reservaId${p.id}`, sql.Int, reservaId)
        .input(`productoId${p.id}`, sql.Int, p.id)
        .input(`cantidad${p.id}`, sql.Int, p.cantidad)
        .input(`precio${p.id}`, sql.Decimal(10, 2), p.precio)
        .query(`
          INSERT INTO ReservasProductos (reservaId, productoId, cantidad, precioUnitario)
          VALUES (@reservaId${p.id}, @productoId${p.id}, @cantidad${p.id}, @precio${p.id})
        `);
    }

    await transaction.commit();
    res.status(200).json({
      idReserva: reservaId,
      idCompra: idCompra,
      usuarioId: usuarioId,
      estado: 'confirmado',
      fechaCreacion: fechaCreacion
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error al reservar stock:', error);
    // Error de clave única duplicada para idCompra
    if (error.number === 2601 || error.number === 2627) {
        return res.status(409).json({ error: `La reserva para la compra ID '${idCompra}' ya existe.` });
    }
    res.status(400).json({ error: error.message || 'Error en el servidor al reservar stock.' });
  }
});

// POST - Liberar stock de una reserva
app.post('/api/stock/liberar', async (req, res) => {
    const { idReserva, usuarioId } = req.body;

    if (!idReserva || !usuarioId) {
        return res.status(400).json({ error: 'idReserva y usuarioId son requeridos.' });
    }

    const pool = await getConnection();
    if (!pool) {
        return res.status(503).json({ error: 'Servicio de base de datos no disponible' });
    }

    const transaction = new sql.Transaction(pool);
    try {
        await transaction.begin();
        const request = new sql.Request(transaction);

        // 1. Buscar la reserva y verificar su estado
        const reservaResult = await request
            .input('idReserva', sql.Int, idReserva)
            .input('usuarioId', sql.Int, usuarioId)
            .query('SELECT * FROM Reservas WHERE id = @idReserva AND usuarioId = @usuarioId');

        const reserva = reservaResult.recordset[0];
        if (!reserva) {
            return res.status(404).json({ error: 'Reserva no encontrada o no pertenece al usuario.' });
        }
        if (reserva.estado !== 'confirmado') {
            return res.status(400).json({ error: `No se puede liberar una reserva en estado '${reserva.estado}'.` });
        }

        // 2. Obtener los productos de la reserva
        const productosReservados = await request
            .input('reservaId', sql.Int, idReserva)
            .query('SELECT * FROM ReservasProductos WHERE reservaId = @reservaId');

        // 3. Devolver el stock
        for (const item of productosReservados.recordset) {
            await request
                .input(`cantidad${item.productoId}`, sql.Int, item.cantidad)
                .input(`productoId${item.productoId}`, sql.Int, item.productoId)
                .query(`UPDATE Productos SET stock = stock + @cantidad${item.productoId} WHERE id = @productoId${item.productoId}`);
        }

        // 4. Actualizar el estado de la reserva a 'liberado'
        await request
            .input('reservaIdUpdate', sql.Int, idReserva)
            .query("UPDATE Reservas SET estado = 'liberado', updatedAt = SYSUTCDATETIME() WHERE id = @reservaIdUpdate");

        await transaction.commit();
        res.status(200).json({
            mensaje: 'Stock liberado correctamente.',
            idReserva: idReserva,
            estado: 'liberado'
        });

    } catch (error) {
        await transaction.rollback();
        console.error('Error al liberar stock:', error);
        res.status(500).json({ error: 'Error en el servidor al liberar stock.' });
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


