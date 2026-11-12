// src/services/storeService.js

const INITIAL_PRODUCTS = [
  { id: 1, nombre: 'Consola PlayStation 5', categoria: 'Consolas', precio: 549990, oferta: true, precioOferta: 499990, imagen: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500' },
  { id: 2, nombre: 'Juego Nintendo Switch Zelda', categoria: 'Juegos', precio: 59990, oferta: false, precioOferta: 0, imagen: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=500' },
  { id: 3, nombre: 'Control Inalámbrico Xbox', categoria: 'Accesorios', precio: 69990, oferta: true, precioOferta: 54990, imagen: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=500' },
  
  // Nuevos productos agregados
  { id: 4, nombre: 'Audífonos Gamer Inalámbricos HyperX', categoria: 'Accesorios', precio: 89990, oferta: true, precioOferta: 69990, imagen: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500' },
  { id: 5, nombre: 'Silla Gamer Ergonómica Premium', categoria: 'Accesorios', precio: 159990, oferta: false, precioOferta: 0, imagen: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=500' },
  { id: 6, nombre: 'Consola Portátil PlayStation Portal', categoria: 'Consolas', precio: 249990, oferta: true, precioOferta: 219990, imagen: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500' }
];

export const storeService = {
  getProducts: () => {
    const products = localStorage.getItem('products');
    if (!products) {
      localStorage.setItem('products', JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    
    // Si la lista guardada tiene menos productos que la plantilla inicial, la actualiza automáticamente
    const parsedProducts = JSON.parse(products);
    if (parsedProducts.length < INITIAL_PRODUCTS.length) {
      localStorage.setItem('products', JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }

    return parsedProducts;
  },

  getCategories: () => ['Consolas', 'Juegos', 'Accesorios'],

  getCart: () => {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  },

  addToCart: (product) => {
    const cart = storeService.getCart();
    const existingIndex = cart.findIndex(item => item.id === product.id);
    if (existingIndex >= 0) {
      cart[existingIndex].cantidad += 1;
    } else {
      cart.push({ ...product, cantidad: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
  },

  removeFromCart: (id) => {
    const cart = storeService.getCart().filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
  },

  createOrder: (orderData) => {
    const orders = storeService.getOrders();
    const newOrder = {
      id: Date.now(),
      fecha: new Date().toLocaleDateString('es-CL'),
      ...orderData
    };
    orders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(orders));
    localStorage.removeItem('cart');
    return newOrder;
  },

  getOrders: () => {
    const orders = localStorage.getItem('orders');
    return orders ? JSON.parse(orders) : [];
  },

  saveProduct: (product) => {
    const products = storeService.getProducts();
    product.id = Date.now();
    products.push(product);
    localStorage.setItem('products', JSON.stringify(products));
  },

  deleteProduct: (id) => {
    const products = storeService.getProducts().filter(p => p.id !== id);
    localStorage.setItem('products', JSON.stringify(products));
  }
};