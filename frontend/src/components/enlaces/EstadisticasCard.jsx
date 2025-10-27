import React from 'react';
import { Link2, Eye, Lock } from 'lucide-react';

const EstadisticasCard = ({ stats }) => {
  if (!stats) {
    return null;
  }

  return (
    <div className="estadisticas-container">
      <div className="stat-card">
        <div className="stat-icon">
          <Link2 />
        </div>
        <div className="stat-info">
          <span className="stat-label">Enlaces Totales</span>
          <span className="stat-value">{stats.total}</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon active">
          <Eye />
        </div>
        <div className="stat-info">
          <span className="stat-label">Enlaces Activos</span>
          <span className="stat-value">{stats.activos}</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">
          <Lock />
        </div>
        <div className="stat-info">
          <span className="stat-label">Total de Accesos</span>
          <span className="stat-value">{stats.totalAccesos}</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">
          <Link2 />
        </div>
        <div className="stat-info">
          <span className="stat-label">Promedio de Accesos</span>
          <span className="stat-value">{stats.promedio.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
};

export default EstadisticasCard;
