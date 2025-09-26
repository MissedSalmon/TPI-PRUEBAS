import React from 'react';
import type { Producto } from '../services/api';

interface ProductoListProps {
  productos: Producto[];
  onEdit: (producto: Producto) => void;
  onDelete: (id: number) => void;
  isLoading: boolean;
}

export const ProductoList: React.FC<ProductoListProps> = ({
  productos,
  onEdit,
  onDelete,
  isLoading
}) => {
  const handleDelete = (id: number, nombre: string) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el producto "${nombre}"?`)) {
      onDelete(id);
    }
  };

  if (isLoading) {
    return (
      <div className="loading">
        <p>Cargando productos...</p>
      </div>
    );
  }

  if (productos.length === 0) {
    return (
      <div className="empty-state">
        <p>No hay productos disponibles.</p>
        <p>¡Agrega tu primer producto!</p>
      </div>
    );
  }

  return (
    <div className="producto-list">
      <h2>Lista de Productos</h2>
      
      <div className="productos-grid">
        {productos.map((producto) => (
          <div key={producto.id} className="producto-card">
            <div className="producto-header">
              <h3>{producto.nombre}</h3>
              <div className="producto-actions">
                <button
                  onClick={() => onEdit(producto)}
                  className="btn-edit"
                  title="Editar producto"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(producto.id, producto.nombre)}
                  className="btn-delete"
                  title="Eliminar producto"
                >
                  🗑️
                </button>
              </div>
            </div>
            
            {producto.descripcion && (
              <p className="producto-descripcion">{producto.descripcion}</p>
            )}
            
            <div className="producto-details">
              <div className="precio">
                <strong>${producto.precio.toFixed(2)}</strong>
              </div>
              <div className="stock">
                <span className={`stock-badge ${producto.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                  {producto.stock > 0 ? `Stock: ${producto.stock}` : 'Sin stock'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
