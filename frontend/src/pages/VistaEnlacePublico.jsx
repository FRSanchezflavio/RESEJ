import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { enlacesApi } from '../services/enlacesApi';
import '../styles/EnlacesCompartidos.css';

const VistaEnlacePublico = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [enlace, setEnlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [password, setPassword] = useState('');
  const [requiresPassword, setRequiresPassword] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  // Cargar enlace público
  const cargarEnlace = useCallback(
    async (pass = null) => {
      try {
        setLoading(true);
        setError(null);

        // Obtener enlace público
        const response = await enlacesApi.obtenerEnlacePublico(token, pass);

        if (response.requiere_contrasena && !pass) {
          setRequiresPassword(true);
          setLoading(false);
          return;
        }

        setEnlace(response);
        setAuthenticated(true);
        setRequiresPassword(false);

        // Registrar acceso
        try {
          await enlacesApi.registrarAccesoEnlace(token);
        } catch (err) {
          console.error('Error registrando acceso:', err);
        }
      } catch (err) {
        setError(err.message || 'No se pudo acceder al enlace');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  // Cargar enlace al montar o cambiar token
  useEffect(() => {
    if (token) {
      cargarEnlace();
    }
  }, [token, cargarEnlace]);

  // Manejar envío de contraseña
  const handlePasswordSubmit = e => {
    e.preventDefault();
    cargarEnlace(password);
  };

  if (loading) {
    return (
      <div className="public-link-container">
        <div className="spinner">Cargando enlace...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="public-link-container">
        <div className="alert alert-danger">
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={() => navigate('/')} className="btn btn-primary">
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  if (requiresPassword && !authenticated) {
    return (
      <div className="public-link-container">
        <div className="password-form">
          <h3>Este enlace está protegido</h3>
          <form onSubmit={handlePasswordSubmit}>
            <input
              type="password"
              placeholder="Ingresa la contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary">
              Acceder
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!enlace) {
    return (
      <div className="public-link-container">
        <div className="alert alert-warning">Enlace no disponible</div>
      </div>
    );
  }

  return (
    <div className="public-link-container">
      <div className="enlace-content">
        <h2>{enlace.titulo || 'Contenido Compartido'}</h2>

        {enlace.descripcion && (
          <p className="enlace-descripcion">{enlace.descripcion}</p>
        )}

        {enlace.tipo === 'persona' && enlace.datos && (
          <div className="persona-details">
            <h4>Información de la Persona</h4>
            <div className="details-grid">
              {enlace.datos.nombre && (
                <div className="detail-row">
                  <span className="label">Nombre:</span>
                  <span className="value">{enlace.datos.nombre}</span>
                </div>
              )}
              {enlace.datos.apellido && (
                <div className="detail-row">
                  <span className="label">Apellido:</span>
                  <span className="value">{enlace.datos.apellido}</span>
                </div>
              )}
              {enlace.datos.numero_documento && (
                <div className="detail-row">
                  <span className="label">Documento:</span>
                  <span className="value">{enlace.datos.numero_documento}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {enlace.tipo === 'registro' && enlace.datos && (
          <div className="registro-details">
            <h4>Registro de Secuestro</h4>
            <div className="details-grid">
              {enlace.datos.fecha && (
                <div className="detail-row">
                  <span className="label">Fecha:</span>
                  <span className="value">
                    {new Date(enlace.datos.fecha).toLocaleDateString()}
                  </span>
                </div>
              )}
              {enlace.datos.ubicacion && (
                <div className="detail-row">
                  <span className="label">Ubicación:</span>
                  <span className="value">{enlace.datos.ubicacion}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="enlace-metadata">
          <p className="metadata-text">
            Accesos: <strong>{enlace.accesos || 0}</strong>
          </p>
          {enlace.fecha_expiracion && (
            <p className="metadata-text">
              Expira:{' '}
              <strong>
                {new Date(enlace.fecha_expiracion).toLocaleDateString()}
              </strong>
            </p>
          )}
        </div>

        <button onClick={() => navigate('/')} className="btn btn-secondary">
          Volver
        </button>
      </div>
    </div>
  );
};

export default VistaEnlacePublico;
