import React, { useContext } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';

import AppNavbar from './components/layout/AppNavbar';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import Registros from './components/registros/Registros';
import UploadForm from './components/registros/UploadForm';
import UsersManagement from './components/usuarios/UsersManagement';
import EnlacesCompartidos from './pages/EnlacesCompartidos';
import VistaEnlacePublico from './pages/VistaEnlacePublico';
import Diagnostico from './pages/Diagnostico';

function AppInner() {
  const { user } = useContext(AuthContext);

  const isAdmin = user?.rol === 'administrador';

  return (
    <Router>
      <AppNavbar />
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
          element={isAdmin ? <UploadForm /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/usuarios"
          element={isAdmin ? <UsersManagement /> : <Navigate to="/dashboard" />}
        />

        {/* Enlaces Compartidos */}
        <Route
          path="/enlaces"
          element={user ? <EnlacesCompartidos /> : <Navigate to="/" />}
        />

        {/* Diagnóstico */}
        <Route path="/diagnostico" element={<Diagnostico />} />

        {/* Vista pública de enlace (sin autenticación) */}
        <Route path="/enlace/:token" element={<VistaEnlacePublico />} />

        {/* Cualquier ruta no válida → redirige */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
