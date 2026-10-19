import React, { useState, useEffect } from 'react';
import { storeService } from '../services/storeService';

export const Ofertas = ({ onAddToCart }) => {
  const [ofertas, setOfertas] = useState([]);

  useEffect(() => {
    const prods = storeService.getProducts();
    setOfertas(prods.filter(p => p.oferta));
  }, []);

  return (
    <div>
      <h2 className="mb-4 text-danger">🔥 Productos en Oferta</h2>
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {ofertas.map(product => (
          <div key={product.id} className="col">
            <div className="card h-100 shadow-sm border-danger">
              <div className="card-body">
                <h5>{product.nombre}</h5>
                <p className="text-decoration-line-through text-muted mb-0">
                  Antes: ${product.precio.toLocaleString('es-CL')}
                </p>
                <p className="fs-4 fw-bold text-danger">
                  Ahora: ${product.precioOferta.toLocaleString('es-CL')}
                </p>
                <button className="btn btn-danger w-100" onClick={() => onAddToCart(product)}>
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