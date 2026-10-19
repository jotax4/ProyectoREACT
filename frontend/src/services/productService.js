// frontend/src/services/productService.js
const API_URL = 'http://localhost:5000/api/products';

export const productService = {
  getProducts: async () => {
    try {
      const res = await fetch(API_URL);
      if (res.ok) return await res.json();
    } catch (error) {
      console.warn('Backend no disponible, usando fallback local');
    }
    const local = localStorage.getItem('products');
    return local ? JSON.parse(local) : [];
  },

  saveProduct: async (product) => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      if (res.ok) return await res.json();
    } catch (error) {
      console.error('Error guardando producto:', error);
    }
  },

  deleteProduct: async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Error eliminando producto:', error);
    }
  }
};