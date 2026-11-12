import React from 'react';
import { Link, NavLink } from 'react-router-dom';

export const Navbar = ({ cartCount, user, onLogout }) => {
  return (
    <nav 
      className="navbar navbar-expand-lg navbar-dark mb-4 sticky-top"
      style={{
        background: 'rgba(11, 15, 25, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(168, 85, 247, 0.35)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
      }}
    >
      <div className="container">
        {/* Marca / Logo Neón */}
        <Link className="navbar-brand fw-bold fs-4 d-flex align-items-center gap-2" to="/">
          <span style={{ filter: 'drop-shadow(0 0 8px rgba(168,85,247,0.8))' }}>🎮</span>
          <span className="text-gradient-purple" style={{ textShadow: '0 0 12px rgba(168,85,247,0.5)', letterSpacing: '0.5px' }}>
            Level UP Gamer
          </span>
        </Link>

        <button 
          className="navbar-toggler border-0" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          style={{ boxShadow: 'none' }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-3 gap-1">
            <li className="nav-item">
              <NavLink 
                className={({ isActive }) => 
                  `nav-link px-3 rounded-3 transition-all ${
                    isActive ? 'fw-bold text-white bg-primary bg-opacity-25 border border-primary border-opacity-50' : 'text-light opacity-75'
                  }`
                }
                style={({ isActive }) => ({
                  borderColor: isActive ? '#a855f7' : 'transparent',
                  textShadow: isActive ? '0 0 8px rgba(168,85,247,0.6)' : 'none'
                })}
                to="/"
                end
              >
                Inicio
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className={({ isActive }) => 
                  `nav-link px-3 rounded-3 transition-all ${
                    isActive ? 'fw-bold text-white bg-primary bg-opacity-25 border border-primary border-opacity-50' : 'text-light opacity-75'
                  }`
                }
                style={({ isActive }) => ({
                  borderColor: isActive ? '#a855f7' : 'transparent',
                  textShadow: isActive ? '0 0 8px rgba(168,85,247,0.6)' : 'none'
                })}
                to="/categorias"
              >
                Categorías
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className={({ isActive }) => 
                  `nav-link px-3 rounded-3 transition-all ${
                    isActive ? 'fw-bold text-white bg-primary bg-opacity-25 border border-primary border-opacity-50' : 'text-light opacity-75'
                  }`
                }
                style={({ isActive }) => ({
                  borderColor: isActive ? '#a855f7' : 'transparent',
                  textShadow: isActive ? '0 0 8px rgba(168,85,247,0.6)' : 'none'
                })}
                to="/ofertas"
              >
                Ofertas
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className={({ isActive }) => 
                  `nav-link px-3 rounded-3 transition-all ${
                    isActive ? 'fw-bold text-white bg-primary bg-opacity-25 border border-primary border-opacity-50' : 'text-light opacity-75'
                  }`
                }
                style={({ isActive }) => ({
                  borderColor: isActive ? '#a855f7' : 'transparent',
                  textShadow: isActive ? '0 0 8px rgba(168,85,247,0.6)' : 'none'
                })}
                to="/contacto"
              >
                Contacto
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className={({ isActive }) => 
                  `nav-link px-3 rounded-3 transition-all ${
                    isActive ? 'fw-bold text-white bg-primary bg-opacity-25 border border-primary border-opacity-50' : 'text-light opacity-75'
                  }`
                }
                style={({ isActive }) => ({
                  borderColor: isActive ? '#a855f7' : 'transparent',
                  textShadow: isActive ? '0 0 8px rgba(168,85,247,0.6)' : 'none'
                })}
                to="/blog"
              >
                Blog
              </NavLink>
            </li>

            {/* Opción Admin visible únicamente con sesión activa */}
            {user && (
              <li className="nav-item">
                <NavLink 
                  className={({ isActive }) => 
                    `nav-link px-3 rounded-3 transition-all ${
                      isActive ? 'fw-bold text-white bg-primary bg-opacity-25 border border-primary border-opacity-50' : 'text-light opacity-75'
                    }`
                  }
                  style={({ isActive }) => ({
                    borderColor: isActive ? '#a855f7' : 'transparent',
                    textShadow: isActive ? '0 0 8px rgba(168,85,247,0.6)' : 'none'
                  })}
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
              className={({ isActive }) => 
                `btn position-relative d-flex align-items-center gap-2 px-3 py-2 rounded-3 fw-semibold transition-all ${
                  isActive ? 'btn-primary' : 'btn-outline-light'
                }`
              }
              style={{
                borderColor: 'rgba(168, 85, 247, 0.4)',
                background: 'rgba(124, 58, 237, 0.15)',
                color: '#f8fafc',
                boxShadow: '0 0 12px rgba(124, 58, 237, 0.2)'
              }}
              to="/cart"
            >
              <span>🛒</span> Carrito
              {cartCount > 0 && (
                <span 
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-dark"
                  style={{ boxShadow: '0 0 8px rgba(239, 68, 68, 0.8)' }}
                >
                  {cartCount}
                </span>
              )}
            </NavLink>

            {/* Gestión de Sesión de Usuario */}
            {user ? (
              <div className="d-flex align-items-center gap-2">
                <span className="text-light small px-3 py-1 rounded-3 bg-dark border border-secondary">
                  👤 <strong>{user.usuario || user.nombre}</strong>
                </span>
                <button 
                  className="btn btn-sm btn-outline-danger px-3 py-2 rounded-3 fw-semibold" 
                  onClick={onLogout}
                >
                  Salir
                </button>
              </div>
            ) : (
              <NavLink 
                className="btn btn-sm px-4 py-2 rounded-3 fw-semibold text-white shadow-sm"
                style={{
                  background: 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)',
                  border: '1px solid rgba(168, 85, 247, 0.6)',
                  boxShadow: '0 0 15px rgba(168, 85, 247, 0.4)'
                }}
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