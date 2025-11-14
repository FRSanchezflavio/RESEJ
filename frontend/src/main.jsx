import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import './App.css';
import './styles/shared-styles.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
