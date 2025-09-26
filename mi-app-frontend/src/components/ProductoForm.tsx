import React, { useState } from 'react';
import type { Producto, NuevoProducto } from '../services/api';

interface ProductoFormProps {
  producto?: Producto;
  onSubmit: (producto: NuevoProducto) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export const ProductoForm: React.FC<ProductoFormProps> = ({
  producto,
  onSubmit,
  onCancel,
  isLoading
}) => {
  const [formData, setFormData] = useState({
    nombre: producto?.nombre || '',
    descripcion: producto?.descripcion || '',
    precio: producto?.precio || 0,
    stock: producto?.stock || 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'precio' || name === 'stock' ? Number(value) : value
    }));
    
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (formData.precio <= 0) {
      newErrors.precio = 'El precio debe ser mayor a 0';
    }

    if (formData.stock < 0) {
      newErrors.stock = 'El stock no puede ser negativo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error al enviar formulario:', error);
    }
  };

  return (
    <div className="producto-form">
      <h2>{producto ? 'Editar Producto' : 'Nuevo Producto'}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre">Nombre *</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className={errors.nombre ? 'error' : ''}
            disabled={isLoading}
          />
          {errors.nombre && <span className="error-message">{errors.nombre}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows={3}
            disabled={isLoading}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="precio">Precio *</label>
            <input
              type="number"
              id="precio"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              min="0"
              step="0.01"
              className={errors.precio ? 'error' : ''}
              disabled={isLoading}
            />
            {errors.precio && <span className="error-message">{errors.precio}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="stock">Stock</label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              className={errors.stock ? 'error' : ''}
              disabled={isLoading}
            />
            {errors.stock && <span className="error-message">{errors.stock}</span>}
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel} disabled={isLoading}>
            Cancelar
          </button>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Guardando...' : (producto ? 'Actualizar' : 'Crear')}
          </button>
        </div>
      </form>
    </div>
  );
};
