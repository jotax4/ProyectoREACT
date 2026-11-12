const API_URL = 'http://localhost:8081/api/pedidos'; // Verifica si tu Spring Boot corre en 8080 o 8081

export const orderService = {
  createOrder: async (orderData) => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error ${res.status}: ${errorText}`);
      }

      return await res.json();
    } catch (error) {
      console.error('Error enviando la orden:', error);
      throw error;
    }
  },

  getOrders: async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Error al obtener pedidos');
      return await res.json();
    } catch (error) {
      console.error('Error obteniendo pedidos:', error);
      return [];
    }
  }
};