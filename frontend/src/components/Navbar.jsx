import React from 'react';

export const Navbar = ({ currentView, setCurrentView, cartCount }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container">
        <button 
          className="navbar-brand btn btn-link text-white fw-bold fs-4 text-decoration-none" 
          onClick={() => setCurrentView('home')}
        >
          MiTienda
        </button>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <button 
                className={`nav-link btn btn-link ${currentView === 'home' ? 'active' : ''}`}
                onClick={() => setCurrentView('home')}
              >
                Home
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link btn btn-link ${currentView === 'categorias' ? 'active' : ''}`}
                onClick={() => setCurrentView('categorias')}
              >
                Categorías
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link btn btn-link ${currentView === 'ofertas' ? 'active' : ''}`}
                onClick={() => setCurrentView('ofertas')}
              >
                Ofertas
              </button>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-2">
            <button 
              className="btn btn-success position-relative"
              onClick={() => setCurrentView('cart')}
            >
              🛒 Carrito
              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartCount}
                </span>
              )}
            </button>
            <button 
              className="btn btn-outline-light ms-2"
              onClick={() => setCurrentView('admin')}
            >
              ⚙️ Admin
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};