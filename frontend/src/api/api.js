import axios from "axios";

const API_URL = "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: false,
});

// attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export async function loginRequest(usuario, password) {
  return api.post("/auth/login", { usuario, password });
}

export async function fetchRegistros(params = {}) {
  // backend puede aceptar query params; params ejemplo: { page:1, limit:10, q:'term' }
  return api.get("/registros", { params });
}

export async function uploadRegistro(formData) {
  return api.post("/registros", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function fetchUsers() {
  return api.get("/usuarios");
}

export async function createUser(payload) {
  return api.post("/usuarios", payload);
}

export default api;
