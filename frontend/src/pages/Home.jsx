import React, { useState, useEffect } from 'react';
import { storeService } from '../services/storeService';

export const Home = ({ onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [categories, setCategories] = useState(['Todas']);

  useEffect(() => {
    setProducts(storeService.getProducts());
    setCategories(['Todas', ...storeService.getCategories()]);
  }, []);

  const filteredProducts = selectedCategory === 'Todas'
    ? products
    : products.filter(p => p.categoria === selectedCategory);

  return (
    <div className="container py-4 text-white">
      {/* Hero Banner Glassmorphic */}
      <div 
        className="p-4 p-md-5 mb-5 rounded-4 text-center text-white position-relative overflow-hidden glass-card glow-border"
        style={{
          background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.35) 0%, rgba(15, 23, 42, 0.85) 100%)'
        }}
      >
        {/* Resplandor decorativo interno */}
        <div 
          className="position-absolute top-0 start-50 translate-middle-x rounded-circle"
          style={{
            width: '280px',
            height: '280px',
            background: 'rgba(168, 85, 247, 0.25)',
            filter: 'blur(70px)',
            pointerEvents: 'none'
          }}
        />

        <h1 className="display-4 fw-black text-uppercase mb-3" style={{ letterSpacing: '1px' }}>
          Bienvenido a <span className="text-gradient-purple" style={{ textShadow: '0 0 20px rgba(168,85,247,0.5)' }}>Level UP Gamer</span>
        </h1>
        <p className="lead text-light opacity-75 max-w-lg mx-auto">
          Encuentra los mejores productos, ofertas exclusivas y equipamiento de alto rendimiento.
        </p>
      </div>

      {/* Botones de categorías */}
      <div className="d-flex justify-content-center gap-2 mb-4 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            className={`btn btn-sm px-4 py-2 rounded-pill fw-semibold transition-all ${
              selectedCategory === cat 
                ? 'btn-primary shadow-lg' 
                : 'btn-outline-secondary text-light'
            }`}
            style={{
              backgroundColor: selectedCategory === cat ? '#a855f7' : 'transparent',
              borderColor: selectedCategory === cat ? '#a855f7' : 'rgba(255,255,255,0.2)'
            }}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Encabezado de la sección */}
      <h3 className="fw-bold mb-4 border-start border-4 border-primary ps-3" style={{ borderColor: '#a855f7 !important' }}>
        Catálogo de Productos
      </h3>
      
      {/* Tarjetas de productos Glassmorphic */}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
        {filteredProducts.map(product => (
          <div key={product.id} className="col">
            <div className="card h-100 glass-card border-secondary text-white shadow-sm overflow-hidden d-flex flex-column">
              <div className="position-relative overflow-hidden" style={{ height: '200px' }}>
                <img 
                  src={product.imagen} 
                  className="w-100 h-100" 
                  alt={product.nombre} 
                  style={{ objectFit: 'cover' }}
                />
                <span className="position-absolute top-0 start-0 m-2 badge bg-dark bg-opacity-75 border border-secondary">
                  {product.categoria}
                </span>
              </div>

              <div className="card-body d-flex flex-column p-3">
                <h5 className="card-title fw-bold text-white mb-2 text-truncate" title={product.nombre}>
                  {product.nombre}
                </h5>

                <div className="mt-auto pt-3 border-top border-secondary">
                  <p className="card-text fw-bold fs-5 text-info mb-3">
                    ${(product.oferta ? product.precioOferta : product.precio).toLocaleString('es-CL')}
                  </p>
                  <button 
                    className="btn btn-sm btn-primary w-100 fw-semibold py-2"
                    style={{ backgroundColor: '#a855f7', borderColor: '#a855f7' }}
                    onClick={() => onAddToCart && onAddToCart(product)}
                  >
                    🛒 Añadir al carrito
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;