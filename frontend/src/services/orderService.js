// src/services/orderService.js

const API_URL = 'http://localhost:8081/api/v1/pedidos';

const getAuthHeaders = () => {
  const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
  const token =
    localStorage.getItem('token') ||
    storedUser?.token ||
    storedUser?.accessToken ||
    storedUser?.jwt;

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

    try {
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
    } catch (error) {
      console.error('Error enviando la orden:', error);
      throw error;
    }
  },

  getOrders: async () => {
    try {
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const msg = await parseErrorMessage(response);
        throw new Error(`Error ${response.status}: ${msg}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error obteniendo las órdenes:', error);
      throw error;
    }
  },

  getOrderById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const msg = await parseErrorMessage(response);
        throw new Error(`Error ${response.status}: ${msg}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error obteniendo la orden #${id}:`, error);
      throw error;
    }
  },

  updateOrderStatus: async (id, estado) => {
    try {
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
    } catch (error) {
      console.error(`Error actualizando el estado de la orden #${id}:`, error);
      throw error;
    }
  },
};