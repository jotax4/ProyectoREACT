// frontend/src/services/cartService.js
export const cartService = {
  getCart: () => {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  },

  addToCart: (product) => {
    const cart = cartService.getCart();
    const index = cart.findIndex(item => item.id === product.id);
    if (index >= 0) {
      cart[index].cantidad += 1;
    } else {
      cart.push({ ...product, cantidad: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
  },

  removeFromCart: (id) => {
    const cart = cartService.getCart().filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
  },

  clearCart: () => {
    localStorage.removeItem('cart');
  }
};