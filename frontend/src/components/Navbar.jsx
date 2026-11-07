import React from 'react';
import { Link, NavLink } from 'react-router-dom';

export const Navbar = ({ cartCount, user, onLogout }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          🎮 Mi Tienda Gamer
        </Link>

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
              <NavLink 
                className={({ isActive }) => `nav-link btn btn-link ${isActive ? 'active fw-bold' : ''}`}
                to="/"
                end
              >
                Inicio
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className={({ isActive }) => `nav-link btn btn-link ${isActive ? 'active fw-bold' : ''}`}
                to="/categorias"
              >
                Categorías
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className={({ isActive }) => `nav-link btn btn-link ${isActive ? 'active fw-bold' : ''}`}
                to="/ofertas"
              >
                Ofertas
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className={({ isActive }) => `nav-link btn btn-link ${isActive ? 'active fw-bold' : ''}`}
                to="/contacto"
              >
                Contacto
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className={({ isActive }) => `nav-link btn btn-link ${isActive ? 'active fw-bold' : ''}`}
                to="/blog"
              >
                Blog
              </NavLink>
            </li>

            {/* Opción Admin visible únicamente con sesión activa */}
            {user && (
              <li className="nav-item">
                <NavLink 
                  className={({ isActive }) => `nav-link btn btn-link ${isActive ? 'active fw-bold' : ''}`}
                  to="/admin"
                >
                  Admin
                </NavLink>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-3">
            {/* Botón Carrito */}
            <NavLink 
              className={({ isActive }) => `btn btn-outline-light position-relative ${isActive ? 'active' : ''}`}
              to="/cart"
            >
              🛒 Carrito
              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartCount}
                </span>
              )}
            </NavLink>

            {/* Gestión de Sesión de Usuario */}
            {user ? (
              <div className="d-flex align-items-center gap-2">
                <span className="text-light small">
                  👤 Hola, <strong>{user.usuario || user.nombre}</strong>
                </span>
                <button 
                  className="btn btn-sm btn-outline-danger" 
                  onClick={onLogout}
                >
                  Salir
                </button>
              </div>
            ) : (
              <NavLink 
                className={({ isActive }) => `btn btn-primary ${isActive ? 'active' : ''}`}
                to="/login"
              >
                Iniciar Sesión
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};