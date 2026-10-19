// frontend/src/components/Navbar.jsx
import React from 'react';

export const Navbar = ({ currentView, setCurrentView, cartCount, user, onLogout }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container">
        <a 
          className="navbar-brand fw-bold" 
          href="#home" 
          onClick={(e) => { e.preventDefault(); setCurrentView('home'); }}
        >
          🎮 Mi Tienda Gamer
        </a>

        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <button 
                className={`nav-link btn btn-link ${currentView === 'home' ? 'active fw-bold' : ''}`}
                onClick={() => setCurrentView('home')}
              >
                Inicio
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link btn btn-link ${currentView === 'categorias' ? 'active fw-bold' : ''}`}
                onClick={() => setCurrentView('categorias')}
              >
                Categorías
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link btn btn-link ${currentView === 'ofertas' ? 'active fw-bold' : ''}`}
                onClick={() => setCurrentView('ofertas')}
              >
                Ofertas
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link btn btn-link ${currentView === 'admin' ? 'active fw-bold' : ''}`}
                onClick={() => setCurrentView('admin')}
              >
                Admin
              </button>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-3">
            {/* Botón Carrito */}
            <button 
              className={`btn btn-outline-light position-relative ${currentView === 'cart' ? 'active' : ''}`}
              onClick={() => setCurrentView('cart')}
            >
              🛒 Carrito
              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Gestión de Sesión de Usuario */}
            {user ? (
              <div className="d-flex align-items-center gap-2">
                <span className="text-light small">
                  👤 Hola, <strong>{user.nombre}</strong>
                </span>
                <button 
                  className="btn btn-sm btn-outline-danger" 
                  onClick={onLogout}
                >
                  Salir
                </button>
              </div>
            ) : (
              <button 
                className={`btn btn-primary ${currentView === 'login' ? 'active' : ''}`}
                onClick={() => setCurrentView('login')}
              >
                Iniciar Sesión
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};