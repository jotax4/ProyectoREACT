import React, { useState, useEffect } from 'react';
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

// Importación de los servicios desacoplados
import { cartService } from './services/cartService';
import { orderService } from './services/orderService';
import { authService } from './services/authService';

export function App() {
  const [currentView, setCurrentView] = useState('home');
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

  // 🟢 Nueva función para actualizar la cantidad desde los botones + y -
  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;

    // Si tu cartService tiene un método updateQuantity, lo usa; de lo contrario actualiza el estado directamente.
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
    setCurrentView('payment-success');
  };

  const handleFailOrder = () => {
    setCurrentView('payment-failure');
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setCurrentView('home');
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setCurrentView('home');
  };

  const cartCount = cart.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <div>
      <Navbar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        cartCount={cartCount}
        user={user}
        onLogout={handleLogout}
      />

      <div className="container pb-5">
        {currentView === 'home' && <Home onAddToCart={handleAddToCart} />}
        {currentView === 'categorias' && <Categorias onAddToCart={handleAddToCart} />}
        {currentView === 'ofertas' && <Ofertas onAddToCart={handleAddToCart} />}
        {currentView === 'login' && <Auth onLoginSuccess={handleLoginSuccess} />}
        
        {currentView === 'cart' && (
          <Cart 
            cartItems={cart} 
            onRemoveFromCart={handleRemoveFromCart}
            onUpdateQuantity={handleUpdateQuantity} // 👈 Se pasa la prop requerida por Cart.jsx
            onProceedToCheckout={() => setCurrentView('checkout')}
            onGoHome={() => setCurrentView('home')}
          />
        )}

        {currentView === 'checkout' && (
          <Checkout 
            cartItems={cart} 
            user={user}
            onCompleteOrder={handleCompleteOrder}
            onFailOrder={handleFailOrder}
            onBackToCart={() => setCurrentView('cart')}
          />
        )}

        {currentView === 'payment-success' && (
          <PaymentSuccess 
            order={lastOrder} 
            onGoHome={() => setCurrentView('home')} 
          />
        )}

        {currentView === 'payment-failure' && (
          <PaymentFailure 
            onRetry={() => setCurrentView('checkout')} 
            onGoHome={() => setCurrentView('home')} 
          />
        )}

        {currentView === 'admin' && <AdminDashboard />}
      </div>
    </div>
  );
}

export default App;