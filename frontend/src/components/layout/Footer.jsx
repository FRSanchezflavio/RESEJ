import React from 'react';
import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-info">
          <div className="footer-logo">⚖️</div>
          <span className="footer-text">
            Desarrollado por{' '}
            <span className="footer-brand">SanzTech & LJD</span>
          </span>
        </div>

        <div className="footer-meta">
          <div className="footer-status">
            <span className="status-dot"></span>
            <span>Sistema Operativo</span>
          </div>
          <div className="footer-copyright">
            © <span className="footer-year">{currentYear}</span> Todos los
            derechos reservados
          </div>
        </div>
      </div>
    </footer>
  );
}
