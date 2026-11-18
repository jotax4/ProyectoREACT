// src/services/personaService.js
import { authService } from './authService';

const BASE_URL = 'http://localhost:8081/api/v1/personas';

const getAuthHeaders = () => {
  const token = authService.getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const personaService = {
  getAll: async () => {
    const response = await fetch(BASE_URL, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error(`Error ${response.status} al listar usuarios`);
    return await response.json();
  },

  create: async (persona) => {
    return await fetch(BASE_URL, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(persona),
    });
  },

  update: async (id, persona) => {
    return await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(persona),
    });
  },

  remove: async (id) => {
    return await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
  },

  delete: async (id) => {
    return await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
  },
};

export default personaService;