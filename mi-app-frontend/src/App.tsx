import React, { useState, useEffect } from 'react';
import type { Producto, NuevoProducto, ReservaInput } from './services/api';
import { apiService } from './services/api';
import { ProductoList } from './components/ProductoList';
import { ProductoForm } from './components/ProductoForm';
import { Sidebar } from './components/layout/Sidebar';
import './App.css';

// Nuevo componente para mostrar el carrito
const Carrito: React.FC<{
  carrito: Map<number, { producto: Producto; cantidad: number }>;
  onConfirmar: () => void;
  onVaciar: () => void;
  isLoading: boolean;
}> = ({ carrito, onConfirmar, onVaciar, isLoading }) => {
  if (carrito.size === 0) {
    return null;
  }

  const total = Array.from(carrito.values()).reduce((sum, item) => sum + item.producto.precio * item.cantidad, 0);

  return (
    <div className="carrito-card">
      <h2>🛒 Carrito de Reserva</h2>
      <ul>
        {Array.from(carrito.values()).map(({ producto, cantidad }) => (
          <li key={producto.id}>
            <span>{producto.nombre} (x{cantidad})</span>
            <span>${(producto.precio * cantidad).toFixed(2)}</span>
          </li>
        ))}
      </ul>
      <div className="carrito-total">
        <strong>Total: ${total.toFixed(2)}</strong>
      </div>
      <div className="carrito-actions">
        <button onClick={onVaciar} disabled={isLoading}>Vaciar</button>
        <button onClick={onConfirmar} disabled={isLoading}>
          {isLoading ? 'Confirmando...' : 'Confirmar Reserva'}
        </button>
      </div>
    </div>
  );
};


function App() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [carrito, setCarrito] = useState<Map<number, { producto: Producto; cantidad: number }>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProducto, setEditingProducto] = useState<Producto | undefined>();
  const [error, setError] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Cargar productos al iniciar la aplicación
  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setIsLoading(true);
      setError('');
      const productosData = await apiService.getProductos();
      setProductos(productosData);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      setError('Error al cargar los productos. Verifica que el backend esté ejecutándose.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCrearProducto = async (nuevoProducto: NuevoProducto) => {
    try {
      setIsLoading(true);
      setError('');
      const producto = await apiService.crearProducto(nuevoProducto);
      setProductos(prev => [producto, ...prev]);
      setShowForm(false);
    } catch (error) {
      console.error('Error al crear producto:', error);
      setError('Error al crear el producto');
    } finally {
      setIsLoading(false);
    }
  };

  const handleActualizarProducto = async (productoActualizado: NuevoProducto) => {
    if (!editingProducto) return;

    try {
      setIsLoading(true);
      setError('');
      const producto = await apiService.actualizarProducto(editingProducto.id, productoActualizado);
      setProductos(prev => 
        prev.map(p => p.id === producto.id ? producto : p)
      );
      setEditingProducto(undefined);
      setShowForm(false);
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      setError('Error al actualizar el producto');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEliminarProducto = async (id: number) => {
    try {
      setIsLoading(true);
      setError('');
      await apiService.eliminarProducto(id);
      setProductos(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      setError('Error al eliminar el producto');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToReserve = (producto: Producto) => {
    setCarrito(prev => {
      const newCarrito = new Map(prev);
      const item = newCarrito.get(producto.id) || { producto, cantidad: 0 };
      
      if (item.cantidad < producto.stock) {
        item.cantidad += 1;
        newCarrito.set(producto.id, item);
      } else {
        alert(`No hay más stock disponible para "${producto.nombre}".`);
      }
      return newCarrito;
    });
  };

  const handleConfirmReservation = async () => {
    if (carrito.size === 0) return;

    // Para este ejemplo, usamos IDs fijos. En una app real, vendrían del usuario logueado.
    const reservaData: ReservaInput = {
      idCompra: `compra-${Date.now()}`, // ID de compra único para el ejemplo
      usuarioId: 1, // ID de usuario de ejemplo
      productos: Array.from(carrito.values()).map(({ producto, cantidad }) => ({
        idProducto: producto.id,
        cantidad,
      })),
    };

    try {
      setIsLoading(true);
      setError('');
      const reservaConfirmada = await apiService.reservarStock(reservaData);
      alert(`¡Reserva #${reservaConfirmada.idReserva} confirmada con éxito!`);
      setCarrito(new Map()); // Limpiar carrito
      await cargarProductos(); // Recargar productos para ver el stock actualizado
    } catch (error: any) {
      console.error('Error al confirmar la reserva:', error);
      setError(error.message || 'Error al confirmar la reserva.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleVaciarCarrito = () => {
    setCarrito(new Map());
  };

  const handleEdit = (producto: Producto) => {
    setEditingProducto(producto);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProducto(undefined);
  };

  const handleSubmit = editingProducto 
    ? handleActualizarProducto 
    : handleCrearProducto;

  return (
    <div className="app">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
      <header className="app-header">
        <button
          className="hamburger-btn"
          aria-label="Abrir menú"
          onClick={() => setSidebarOpen(true)}
        >
          ☰
        </button>
        <h1>🏪 Gestión de Productos</h1>
        <p>Sistema de gestión de productos con React y Node.js</p>
      </header>

      <main className="app-main">
        {error && (
          <div className="error-banner">
            <p>{error}</p>
            <button onClick={() => setError('')}>✕</button>
          </div>
        )}

        {!showForm ? (
          <div>
            <div className="actions-bar" id="productos">
              <button 
                onClick={() => setShowForm(true)}
                className="btn-primary"
                disabled={isLoading}
              >
                ➕ Nuevo Producto
              </button>
              <button 
                onClick={cargarProductos}
                className="btn-secondary"
                disabled={isLoading}
              >
                🔄 Actualizar
              </button>
            </div>

            <Carrito
              carrito={carrito}
              onConfirmar={handleConfirmReservation}
              onVaciar={handleVaciarCarrito}
              isLoading={isLoading}
            />

            <div id="carrito" />

            <ProductoList
              productos={productos}
              onEdit={handleEdit}
              onDelete={handleEliminarProducto}
              onReserve={handleAddToReserve}
              isLoading={isLoading}
            />
          </div>
        ) : (
          <ProductoForm
            producto={editingProducto}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>Desarrollado con React + TypeScript + Node.js + SQL Server</p>
      </footer>
    </div>
  );
}

export default App;
