import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './style.css'; // Asegúrate de que los estilos globales se importen

const rootElement = document.getElementById('app');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("No se pudo encontrar el elemento raíz con id 'app'");
}