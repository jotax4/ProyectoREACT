import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Cart } from './pages/Cart';
import Checkout from './pages/Checkout';
import { PaymentSuccess } from './pages/PaymentSuccess';
import { PaymentFailure } from './pages/PaymentFailure';
import AdminDashboard from './pages/AdminDashboard';
import { MisPedidos } from './pages/MisPedidos';
import { Categorias } from './pages/Categorias';
import { Ofertas } from './pages/Ofertas';
import { Auth } from './pages/Auth';
import { Contact } from './pages/Contact';
import { Blog } from './pages/Blog';

import { cartService } from './services/cartService';
import { orderService } from './services/orderService';
import { authService } from './services/authService';

function ProtectedRoute({ user, allowedRoles, children }) {
  const currentUser = user || authService.getCurrentUser();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const rolActual = (currentUser.rol || '').replace('ROLE_', '').toUpperCase();
    if (!allowedRoles.includes(rolActual)) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}

export function App() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [lastOrder, setLastOrder] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(authService.getCurrentUser());
  }, []);

  const handleAddToCart = (product) => {
    setCart((prev) => cartService.addItem(prev, product));
  };

  const handleRemoveFromCart = (id) => {
    setCart((prev) => cartService.removeItem(prev, id));
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    setCart((prev) => cartService.updateQuantity(prev, productId, newQuantity));
  };

  const handleCompleteOrder = async (orderData) => {
    const createdOrder = await orderService.createOrder(orderData);
    setLastOrder(createdOrder || orderData);
    setCart([]);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    const rol = (userData?.rol || '').replace('ROLE_', '').toUpperCase();
    if (rol === 'ADMIN' || rol === 'VENDEDOR') {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setCart([]);
    navigate('/login');
  };

  const cartCount = cart.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', width: '100%' }}>
      <Navbar cartCount={cartCount} user={user} onLogout={handleLogout} />

      <div className="w-100 p-0 m-0">
        <Routes>
          <Route path="/" element={<Home onAddToCart={handleAddToCart} />} />
          <Route path="/categorias" element={<Categorias onAddToCart={handleAddToCart} />} />
          <Route path="/ofertas" element={<Ofertas onAddToCart={handleAddToCart} />} />
          <Route path="/contacto" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/login" element={<Auth onLoginSuccess={handleLoginSuccess} />} />

          <Route
            path="/cart"
            element={
              <Cart
                cartItems={cart}
                onRemoveFromCart={handleRemoveFromCart}
                onUpdateQuantity={handleUpdateQuantity}
              />
            }
          />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute user={user}>
                <Checkout
                  cartItems={cart}
                  user={user}
                  onCompleteOrder={handleCompleteOrder}
                />
              </ProtectedRoute>
            }
          />

          <Route path="/payment-success" element={<PaymentSuccess order={lastOrder} />} />
          <Route path="/payment-failure" element={<PaymentFailure />} />

          <Route
            path="/mis-pedidos"
            element={
              <ProtectedRoute user={user}>
                <MisPedidos />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute user={user} allowedRoles={['ADMIN', 'VENDEDOR']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;