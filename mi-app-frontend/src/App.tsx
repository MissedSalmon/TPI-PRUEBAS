import React, { useState, useEffect } from 'react';
import type { Producto, NuevoProducto } from './services/api';
import { apiService } from './services/api';
import { ProductoList } from './components/ProductoList';
import { ProductoForm } from './components/ProductoForm';
import './App.css';

function App() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProducto, setEditingProducto] = useState<Producto | undefined>();
  const [error, setError] = useState<string>('');

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
      <header className="app-header">
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
            <div className="actions-bar">
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

            <ProductoList
              productos={productos}
              onEdit={handleEdit}
              onDelete={handleEliminarProducto}
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
