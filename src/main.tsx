/**
 * Este archivo arranca la aplicacion React en el navegador.
 * Inicializa los estilos globales, la traduccion y el soporte offline antes de montar la app.
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './lib/i18n';
import { setupOffline } from './lib/offline';

setupOffline();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
