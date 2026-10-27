// src/services/authService.js

// src/services/authService.js

const API_URL = 'http://localhost:8081/api'; // 👈 Cambiado a 8081

export const authService = {
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, { // 👈 Endpoint específico de Login
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const contentType = response.headers.get('content-type');
      let data;
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user || data));
      }

      return { ok: response.ok, data };
    } catch (error) {
      return { ok: false, data: { error: 'Error de conexión con el servidor' } };
    }
  },

  register: async (userData) => {
    try {
      const response = await fetch(`${API_URL}/personas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const contentType = response.headers.get('content-type');
      let data;
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      return { ok: response.ok, data };
    } catch (error) {
      return { ok: false, data: { error: 'Error de conexión con el servidor' } };
    }
  },

  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      return null;
    }
  },

  logout: () => {
    localStorage.removeItem('user');
  }
};