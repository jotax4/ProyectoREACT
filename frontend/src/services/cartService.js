// src/services/cartService.js
export const cartService = {
  addItem: (currentCart, product) => {
    const precioFinal =
      product.oferta && Number(product.precioOferta) > 0
        ? Number(product.precioOferta)
        : Number(product.precio);

    const index = currentCart.findIndex((item) => item.id === product.id);
    if (index >= 0) {
      return currentCart.map((item, idx) =>
        idx === index ? { ...item, cantidad: item.cantidad + 1 } : item
      );
    }
    return [...currentCart, { ...product, precio: precioFinal, cantidad: 1 }];
  },

  updateQuantity: (currentCart, productId, newQuantity) => {
    if (newQuantity < 1) return currentCart;
    return currentCart.map((item) =>
      item.id === productId ? { ...item, cantidad: newQuantity } : item
    );
  },

  removeItem: (currentCart, productId) => {
    return currentCart.filter((item) => item.id !== productId);
  },
};