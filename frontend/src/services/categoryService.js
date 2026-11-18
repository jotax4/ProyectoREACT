// src/services/categoryService.js
import { authService } from './authService';

const API_URL = 'http://localhost:8081/api/v1/categorias';

const getHeaders = (withAuth = false) => {
  const token = authService.getToken();
  return {
    'Content-Type': 'application/json',
    ...(withAuth && token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const categoryService = {
  getCategories: async () => {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: getHeaders(false),
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status} al obtener categorías`);
    }
    return await response.json();
  },

  createCategory: async (categoria) => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(categoria),
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status} al crear categoría`);
    }
    return await response.json();
  },

  updateCategory: async (id, categoria) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(categoria),
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status} al actualizar categoría`);
    }
    return await response.json();
  },

  deleteCategory: async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status} al eliminar categoría`);
    }
  },
};