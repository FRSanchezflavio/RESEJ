import React, { useContext } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { PermisosProvider } from './context/PermisosContext';
import { usePermisos } from './context/usePermisos';
import { ThemeProvider } from './context/ThemeContext';

import AppNavbar from './components/layout/AppNavbar';
import Footer from './components/layout/Footer';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import Registros from './components/registros/Registros';
import UploadForm from './components/registros/UploadForm';
import UsersManagement from './components/usuarios/UsersManagement';
// import EnlacesCompartidos from './pages/EnlacesCompartidos'; // TODO: Implementar
// import VistaEnlacePublico from './pages/VistaEnlacePublico'; // TODO: Implementar
// import Diagnostico from './pages/Diagnostico'; // TODO: Implementar

function AppInner() {
  const { user } = useContext(AuthContext);
  const { permisos } = usePermisos();

  const isAdmin = user?.rol === 'administrador';
  const puedeCargar = permisos.puede_crear || isAdmin;

  return (
    <Router>
      <div className="app-shell">
        <AppNavbar />

        <main className="app-main">
          <Routes>
            {/* Ruta raíz */}
            <Route
              path="/"
              element={user ? <Navigate to="/dashboard" /> : <Login />}
            />

            {/* Dashboard */}
            <Route
              path="/dashboard"
              element={user ? <Dashboard /> : <Navigate to="/" />}
            />

            {/* Módulos */}
            <Route
              path="/registros"
              element={user ? <Registros /> : <Navigate to="/" />}
            />
            <Route
              path="/cargar"
              element={
                puedeCargar ? <UploadForm /> : <Navigate to="/dashboard" />
              }
            />
            <Route
              path="/usuarios"
              element={
                isAdmin ? <UsersManagement /> : <Navigate to="/dashboard" />
              }
            />

            {/* Enlaces Compartidos - TODO: Implementar */}
            {/* <Route
              path="/enlaces"
              element={user ? <EnlacesCompartidos /> : <Navigate to="/" />}
            /> */}

            {/* Diagnóstico - TODO: Implementar */}
            {/* <Route path="/diagnostico" element={<Diagnostico />} /> */}

            {/* Vista pública de enlace - TODO: Implementar */}
            {/* <Route path="/enlace/:token" element={<VistaEnlacePublico />} /> */}

            {/* Cualquier ruta no válida → redirige */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PermisosProvider>
          <AppInner />
        </PermisosProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
