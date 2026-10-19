// frontend/src/services/authService.js
const API_URL = 'http://localhost:5000/api/auth';

export const authService = {
  // Iniciar Sesión
  login: async (credentials) => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
      }
      return { ok: res.ok, data };
    } catch (error) {
      return { ok: false, data: { error: 'Error de conexión con el servidor' } };
    }
  },

  // Registrar Usuario
  register: async (userData) => {
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      return { ok: res.ok, data };
    } catch (error) {
      return { ok: false, data: { error: 'Error de conexión con el servidor' } };
    }
  },

  // Obtener usuario actual
  getCurrentUser: () => {
    const user = localStorage.getItem('userData');
    return user ? JSON.parse(user) : null;
  },

  // Cerrar sesión
  logout: () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
  }
};