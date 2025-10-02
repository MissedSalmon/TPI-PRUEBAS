import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Bloquear scroll al abrir sidebar (observe clase opcional en body)
const observer = new MutationObserver(() => {
  const overlay = document.querySelector('.sidebar-overlay');
  if (overlay) {
    document.body.style.overflow = 'hidden';
    overlay.addEventListener('click', () => {
      document.body.style.overflow = '';
    }, { once: true });
  } else {
    document.body.style.overflow = '';
  }
});

observer.observe(document.body, { childList: true, subtree: true });