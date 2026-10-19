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
import { storeService } from './services/storeService';

export function App() {
  const [currentView, setCurrentView] = useState('home');
  const [cart, setCart] = useState([]);
  const [lastOrder, setLastOrder] = useState(null);

  useEffect(() => {
    setCart(storeService.getCart());
  }, []);

  const handleAddToCart = (product) => {
    storeService.addToCart(product);
    setCart(storeService.getCart());
  };

  const handleRemoveFromCart = (id) => {
    storeService.removeFromCart(id);
    setCart(storeService.getCart());
  };

  const handleCompleteOrder = (orderData) => {
    const createdOrder = storeService.createOrder(orderData);
    setLastOrder(createdOrder);
    setCart([]);
    setCurrentView('payment-success');
  };

  const handleFailOrder = () => {
    setCurrentView('payment-failure');
  };

  const cartCount = cart.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <div>
      <Navbar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        cartCount={cartCount} 
      />

      <div className="container pb-5">
        {currentView === 'home' && <Home onAddToCart={handleAddToCart} />}
        {currentView === 'categorias' && <Categorias onAddToCart={handleAddToCart} />}
        {currentView === 'ofertas' && <Ofertas onAddToCart={handleAddToCart} />}
        
        {currentView === 'cart' && (
          <Cart 
            cartItems={cart} 
            onRemoveFromCart={handleRemoveFromCart}
            onProceedToCheckout={() => setCurrentView('checkout')}
            onGoHome={() => setCurrentView('home')}
          />
        )}

        {currentView === 'checkout' && (
          <Checkout 
            cartItems={cart} 
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