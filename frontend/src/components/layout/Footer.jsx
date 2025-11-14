import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Sistema RE.SE.J - Todos los derechos reservados</p>
      </div>
    </footer>
  );
}
