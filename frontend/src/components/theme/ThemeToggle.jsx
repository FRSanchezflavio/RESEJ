import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import './ThemeToggle.css';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button onClick={toggleTheme} className="theme-toggle-btn" title={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`}>
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
