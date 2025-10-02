import React from 'react';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const handleNavigate = () => {
    onClose();
  };

  return (
    <aside className={`sidebar ${open ? 'open' : ''}`} aria-hidden={!open}>
      <div className="sidebar-header">
        <h2>Menú</h2>
        <button className="sidebar-close" onClick={onClose} aria-label="Cerrar menú">✕</button>
      </div>
      <nav className="sidebar-nav">
        <a href="#" className="sidebar-link" onClick={handleNavigate}>Inicio</a>
        <a href="#productos" className="sidebar-link" onClick={handleNavigate}>Productos</a>
        <a href="#carrito" className="sidebar-link" onClick={handleNavigate}>Carrito</a>
        <a href="#about" className="sidebar-link" onClick={handleNavigate}>Acerca de</a>
      </nav>
      <div className="sidebar-footer">
        <small>v1.0</small>
      </div>
    </aside>
  );
};

export default Sidebar;


