// src/services/productService.js
import { authService } from './authService';

const API_URL = 'http://localhost:8081/api/v1/productos';

const getHeaders = (withAuth = false) => {
  const token = authService.getToken();
  return {
    'Content-Type': 'application/json',
    ...(withAuth && token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const productService = {
  getProducts: async (categoria = '') => {
    const query =
      categoria && categoria !== 'Todas'
        ? `?categoria=${encodeURIComponent(categoria)}`
        : '';
    const response = await fetch(`${API_URL}${query}`, {
      method: 'GET',
      headers: getHeaders(false),
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status} al obtener productos`);
    }
    return await response.json();
  },

  getOffers: async () => {
    const response = await fetch(`${API_URL}?oferta=true`, {
      method: 'GET',
      headers: getHeaders(false),
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status} al obtener ofertas`);
    }
    return await response.json();
  },

  createProduct: async (product) => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status} al crear producto`);
    }
    return await response.json();
  },

  updateProduct: async (id, product) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status} al actualizar producto`);
    }
    return await response.json();
  },

  deleteProduct: async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status} al eliminar producto`);
    }
  },
};