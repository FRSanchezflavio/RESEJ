import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";

import AppNavbar from "./components/layout/AppNavbar";
import Login from "./components/auth/Login";
import Dashboard from "./components/dashboard/Dashboard";
import Registros from "./components/registros/Registros";
import UploadForm from "./components/registros/UploadForm";
import UsersManagement from "./components/usuarios/UsersManagement";
import SharedLinks from "./components/enlaces/SharedLinks";
import PublicLinkViewer from "./components/enlaces/PublicLinkViewer";
import TemporalAccess from "./components/enlaces/TemporalAccess";

const CORE_ROLES = ["administrador", "usuario_consulta"];
const TEMPORAL_ROLE = "usuario_temporal";

function AppRoutes() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const isAdmin = user?.rol === "administrador";
  const isCoreRole = user ? CORE_ROLES.includes(user.rol) : false;
  const isTemporalUser = user?.rol === TEMPORAL_ROLE;
  const defaultAuthenticatedRoute = isCoreRole
    ? "/dashboard"
    : isTemporalUser
    ? "/acceso-temporal"
    : "/registros";
  const hideNav = location.pathname.startsWith("/enlace/");

  return (
    <>
      {!hideNav && (
        <AppNavbar
          isLimitedUser={user ? !isCoreRole : false}
          isTemporalUser={isTemporalUser}
        />
      )}
      <Routes>
        <Route path="/enlace/:token" element={<PublicLinkViewer />} />

        <Route
          path="/"
          element={
            user ? <Navigate to={defaultAuthenticatedRoute} /> : <Login />
          }
        />

        <Route
          path="/dashboard"
          element={
            user ? (
              isCoreRole ? <Dashboard /> : <Navigate to={defaultAuthenticatedRoute} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/registros"
          element={
            user ? (
              isCoreRole ? <Registros /> : <Navigate to={defaultAuthenticatedRoute} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/acceso-temporal"
          element={
            user ? (
              isTemporalUser || isCoreRole ? (
                <TemporalAccess />
              ) : (
                <Navigate to={defaultAuthenticatedRoute} />
              )
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/enlaces"
          element={
            user ? (
              isCoreRole ? <SharedLinks /> : <Navigate to="/registros" />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/cargar"
          element={isAdmin ? <UploadForm /> : <Navigate to={defaultAuthenticatedRoute} />}
        />
        <Route
          path="/usuarios"
          element={isAdmin ? <UsersManagement /> : <Navigate to={defaultAuthenticatedRoute} />}
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

function AppInner() {
  return (
    <Router>
      <AppRoutes />
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
