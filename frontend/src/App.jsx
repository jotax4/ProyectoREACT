import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { PaymentSuccess } from './pages/PaymentSuccess';
import { PaymentFailure } from './pages/PaymentFailure';
import { AdminDashboard } from './pages/AdminDashboard';
import { Categorias } from './pages/Categorias';
import { Ofertas } from './pages/Ofertas';
import { Auth } from './pages/Auth';
import { Contact } from './pages/Contact';

// Importación de los servicios desacoplados
import { cartService } from './services/cartService';
import { orderService } from './services/orderService';
import { authService } from './services/authService';

export function App() {
  const [cart, setCart] = useState([]);
  const [lastOrder, setLastOrder] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setCart(cartService.getCart());
    setUser(authService.getCurrentUser());
  }, []);

  const handleAddToCart = (product) => {
    cartService.addToCart(product);
    setCart(cartService.getCart());
  };

  const handleRemoveFromCart = (id) => {
    cartService.removeFromCart(id);
    setCart(cartService.getCart());
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;

    if (typeof cartService.updateQuantity === 'function') {
      cartService.updateQuantity(productId, newQuantity);
      setCart(cartService.getCart());
    } else {
      const updatedCart = cart.map((item) =>
        item.id === productId ? { ...item, cantidad: newQuantity } : item
      );
      setCart(updatedCart);
      if (typeof cartService.saveCart === 'function') {
        cartService.saveCart(updatedCart);
      }
    }
  };

  const handleCompleteOrder = async (orderData) => {
    const createdOrder = await orderService.createOrder(orderData);
    setLastOrder(createdOrder || orderData);
    cartService.clearCart();
    setCart([]);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', width: '100%' }}>
      <Navbar 
        cartCount={cartCount}
        user={user}
        onLogout={handleLogout}
      />

      <div className="w-100 p-0 m-0">
        <Routes>
          <Route path="/" element={<Home onAddToCart={handleAddToCart} />} />
          <Route path="/categorias" element={<Categorias onAddToCart={handleAddToCart} />} />
          <Route path="/ofertas" element={<Ofertas onAddToCart={handleAddToCart} />} />
          <Route path="/contacto" element={<Contact />} />
          <Route path="/login" element={<Auth onLoginSuccess={handleLoginSuccess} />} />
          
          <Route path="/cart" element={
            <Cart 
              cartItems={cart} 
              onRemoveFromCart={handleRemoveFromCart}
              onUpdateQuantity={handleUpdateQuantity}
            />
          } />

          <Route path="/checkout" element={
            <Checkout 
              cartItems={cart} 
              user={user}
              onCompleteOrder={handleCompleteOrder}
            />
          } />

          <Route path="/payment-success" element={<PaymentSuccess order={lastOrder} />} />
          <Route path="/payment-failure" element={<PaymentFailure />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;