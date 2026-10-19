import React, { useState, useEffect } from 'react';
import { storeService } from '../services/storeService';

export const Home = ({ onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const categories = ['Todas', ...storeService.getCategories()];

  useEffect(() => {
    setProducts(storeService.getProducts());
  }, []);

  const filteredProducts = selectedCategory === 'Todas'
    ? products
    : products.filter(p => p.categoria === selectedCategory);

  return (
    <div>
      <div className="p-4 p-md-5 mb-4 rounded text-body-emphasis bg-body-secondary text-center">
        <h1 className="display-4 fw-bold">Bienvenido a MiTienda</h1>
        <p className="lead my-3">Encuentra los mejores productos al mejor precio.</p>
      </div>

      <div className="d-flex justify-content-center gap-2 mb-4 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            className={`btn ${selectedCategory === cat ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <h3 className="mb-3">Catálogo de Productos</h3>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
        {filteredProducts.map(product => (
          <div key={product.id} className="col">
            <div className="card h-100 shadow-sm">
              <img 
                src={product.imagen} 
                className="card-img-top" 
                alt={product.nombre} 
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <div className="card-body d-flex flex-column">
                <span className="badge bg-secondary mb-2 align-self-start">{product.categoria}</span>
                <h5 className="card-title">{product.nombre}</h5>
                <p className="card-text fw-bold fs-5 text-success mt-auto">
                  ${(product.oferta ? product.precioOferta : product.precio).toLocaleString('es-CL')}
                </p>
                <button 
                  className="btn btn-primary w-100 mt-2"
                  onClick={() => onAddToCart(product)}
                >
                  Añadir al carrito
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};