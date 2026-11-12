// src/services/authService.js

const API_URL = 'http://localhost:8081/api'; // 

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
        // Aseguramos capturar el objeto del usuario sin importar la estructura del backend
        const usuarioReal = data.user || data; 
        
        localStorage.setItem('user', JSON.stringify(usuarioReal));
        
        // Forzamos a que la propiedad 'user' exista para que Auth.jsx la lea correctamente
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