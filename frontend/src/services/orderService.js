// src/services/orderService.js
import { authService } from './authService';

const API_URL = 'http://localhost:8081/api/v1/pedidos';

const getAuthHeaders = () => {
  const token = authService.getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const parseErrorMessage = async (response) => {
  const errorText = await response.text();
  try {
    const parsed = JSON.parse(errorText);
    return parsed.error || parsed.message || errorText;
  } catch {
    return errorText;
  }
};

export const orderService = {
  createOrder: async (orderData) => {
    const direccionLimpia = orderData.direccion?.trim() || '';
    const payload = {
      ...orderData,
      direccion: direccionLimpia,
      telefono: orderData.telefono?.trim() || '',
      metodoEnvio:
        orderData.metodoEnvio ||
        orderData.envio ||
        (direccionLimpia ? 'Despacho a domicilio' : 'Retiro en tienda'),
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const msg = await parseErrorMessage(response);
      throw new Error(`Error ${response.status}: ${msg}`);
    }

    return await response.json();
  },

  getOrders: async () => {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const msg = await parseErrorMessage(response);
      throw new Error(`Error ${response.status}: ${msg}`);
    }

    return await response.json();
  },

  getMyOrders: async () => {
    const response = await fetch(`${API_URL}/mis-pedidos`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const msg = await parseErrorMessage(response);
      throw new Error(`Error ${response.status}: ${msg}`);
    }

    return await response.json();
  },

  getOrderById: async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const msg = await parseErrorMessage(response);
      throw new Error(`Error ${response.status}: ${msg}`);
    }

    return await response.json();
  },

  updateOrderStatus: async (id, estado) => {
    const response = await fetch(`${API_URL}/${id}/estado`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ estado }),
    });

    if (!response.ok) {
      const msg = await parseErrorMessage(response);
      throw new Error(`Error ${response.status}: ${msg}`);
    }

    return await response.json();
  },
};