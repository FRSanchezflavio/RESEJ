import React, { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";


export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { usuario, rol, nombreCompleto, userId }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = jwtDecode(token);
        setUser({
          usuario: payload.usuario,
          rol: payload.rol,
          nombreCompleto: payload.nombreCompleto || payload.usuario,
          userId: payload.userId,
        });
      } catch {
        localStorage.removeItem("token");
      }
    }
  }, []);

  function login(token) {
    localStorage.setItem("token", token);
    const payload = jwtDecode(token);
    setUser({
      usuario: payload.usuario,
      rol: payload.rol,
      nombreCompleto: payload.nombreCompleto || payload.usuario,
      userId: payload.userId,
    });
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
