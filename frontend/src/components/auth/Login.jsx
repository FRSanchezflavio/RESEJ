import React, { useContext, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { loginRequest } from '../../api/api';
import api from '../../api/api';
import { AuthContext } from '../../context/AuthContext';
import { usePermisos } from '../../context/usePermisos';
import './Login.css';

export default function Login() {
  const { login } = useContext(AuthContext);
  const { actualizarPermisos } = usePermisos();
  const [searchParams] = useSearchParams();
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [validandoToken, setValidandoToken] = useState(false);
  const [infoToken, setInfoToken] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      validarTokenAcceso(token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const validarTokenAcceso = async token => {
    setValidandoToken(true);
    setInfoToken('Validando enlace de acceso temporal...');
    setErr('');

    try {
      console.log('🔗 Validando token de acceso:', token);
      const response = await api.post('/usuarios/validar-token-acceso', {
        token,
      });

      if (response.data.success && response.data.token_valido) {
        console.log('✅ Token válido, iniciando sesión automática');
        const jwtToken = response.data.jwt_token;
        const permisos = response.data.permisos;
        const usuarioData = response.data.usuario;

        // Guardar permisos
        if (permisos) {
          actualizarPermisos(permisos);
          console.log('Permisos del usuario:', permisos);
        }

        // Guardar usuario en localStorage
        if (usuarioData) {
          localStorage.setItem('usuario', JSON.stringify(usuarioData));
        }

        setInfoToken(
          `¡Bienvenido ${usuarioData?.username || 'Usuario'}! Redirigiendo...`
        );

        // Login automático
        setTimeout(() => {
          login(jwtToken);
        }, 1000);
      }
    } catch (error) {
      console.error('❌ Error al validar token:', error);
      const mensajeError =
        error.response?.data?.error ||
        'El enlace de acceso no es válido o ha expirado';
      setErr(mensajeError);
      setInfoToken('Por favor, inicia sesión con tu usuario y contraseña.');
      setValidandoToken(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setErr('');
    try {
      const res = await loginRequest(usuario, password);
      const token =
        res.data?.data?.accessToken ||
        res.data?.accessToken ||
        res.data?.data?.accessToken;
      if (!token) throw new Error('No token');

      // Guardar permisos si están disponibles
      const permisos = res.data?.data?.permisos;
      if (permisos) {
        actualizarPermisos(permisos);
        console.log('Permisos del usuario:', permisos);
      }

      // Guardar usuario completo en localStorage para referencia
      const usuarioData = res.data?.data?.usuario;
      if (usuarioData) {
        localStorage.setItem('usuario', JSON.stringify(usuarioData));
      }

      login(token);
    } catch (error) {
      setErr('Credenciales inválidas o error de servidor');
      console.error(error);
    }
  };

  if (validandoToken) {
    return (
      <div className="login-container">
        <div className="login-wrapper">
          <div className="login-header">
            <div className="login-logo">⚖️</div>
            <h1 className="login-title">RESEJ</h1>
            <p className="login-subtitle">Sistema Policial-Judicial</p>
          </div>

          <div className="login-card">
            <div className="token-validation">
              <div className="validation-spinner"></div>
              <h3 className="validation-message">{infoToken}</h3>
              <p className="validation-description">
                🔐 Estás accediendo con un enlace temporal de un solo uso
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-header">
          <div className="login-logo">⚖️</div>
          <h1 className="login-title">RESEJ</h1>
          <p className="login-subtitle">Sistema Policial-Judicial</p>
        </div>

        <div className="login-card">
          {err && <div className="login-alert error">⚠️ {err}</div>}
          {infoToken && !err && (
            <div className="login-alert info">ℹ️ {infoToken}</div>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group-login">
              <label className="form-label-login">Usuario</label>
              <input
                type="text"
                className="form-input-login"
                value={usuario}
                onChange={e => setUsuario(e.target.value)}
                placeholder="Ingrese su nombre de usuario"
                required
                autoComplete="username"
              />
            </div>

            <div className="form-group-login">
              <label className="form-label-login">Contraseña</label>
              <input
                type="password"
                className="form-input-login"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Ingrese su contraseña"
                required
                autoComplete="current-password"
              />
            </div>

            <div className="login-actions">
              <button type="submit" className="btn-login">
                🔐 Iniciar Sesión
              </button>
            </div>

            <div className="login-security-note">
              <span className="security-icon">🛡️</span>
              <p className="security-text">
                Todas las sesiones son monitoreadas y auditadas por razones de
                seguridad. Acceso exclusivo para personal autorizado.
              </p>
            </div>
          </form>

          <div className="login-footer">
            <div className="login-footer-text">
              <span className="login-footer-badge">🏛️ Policía de Tucumán</span>
              <span>© {new Date().getFullYear()} SanzTech & LJD</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
