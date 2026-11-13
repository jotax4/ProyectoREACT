// src/services/authService.js

const API_URL = 'http://localhost:8081/api/v1';

export const authService = {
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
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
        const token = data.token || data.accessToken || data.jwt;
        if (token) {
          localStorage.setItem('token', token);
        }

        const usuarioReal = data.user || data;
        localStorage.setItem('user', JSON.stringify(usuarioReal));

        if (typeof data === 'object') {
          data.user = usuarioReal;
        } else {
          data = { user: usuarioReal, original: data };
        }
      }

      return { ok: response.ok, data };
    } catch (error) {
      return { ok: false, data: { error: 'Error de conexión con el servidor' } };
    }
  },

  register: async (userData) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
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

  getToken: () => {
    const token = localStorage.getItem('token');
    if (token) return token;
    const user = authService.getCurrentUser();
    return user?.token || user?.accessToken || user?.jwt || null;
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }
};