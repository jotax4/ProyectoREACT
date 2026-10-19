// frontend/src/services/orderService.js
const API_URL = 'http://localhost:5000/api/orders';

export const orderService = {
  createOrder: async (orderData) => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      if (res.ok) return await res.json();
    } catch (error) {
      console.error('Error enviando la orden:', error);
    }
  },

  getOrders: async () => {
    try {
      const res = await fetch(API_URL);
      if (res.ok) return await res.json();
    } catch (error) {
      return [];
    }
  }
};