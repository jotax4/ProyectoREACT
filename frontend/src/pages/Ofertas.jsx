import React, { useState, useEffect } from 'react';
import { productService } from '../services/productService';

export const Ofertas = ({ onAddToCart }) => {
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarOfertas = async () => {
      setLoading(true);
      try {
        const data = await productService.getOffers();
        setOfertas(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error al obtener ofertas:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarOfertas();
  }, []);

  return (
    <div className="container py-4 text-white">
      <h2 className="mb-4 fw-bold text-danger">🔥 Productos en Oferta</h2>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status"></div>
        </div>
      ) : ofertas.length === 0 ? (
        <div className="alert alert-secondary text-center">No hay ofertas disponibles en este momento.</div>
      ) : (
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {ofertas.map((product) => (
            <div key={product.id} className="col">
              <div className="card h-100 bg-dark text-white shadow-sm border-danger overflow-hidden">
                {product.imagen && (
                  <img
                    src={product.imagen}
                    alt={product.nombre}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                )}
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <span className="badge bg-danger mb-2">
                      {product.categoria?.nombre || 'Oferta'}
                    </span>
                    <h5 className="fw-bold">{product.nombre}</h5>
                  </div>
                  <div className="mt-3">
                    <p className="text-decoration-line-through text-secondary mb-0">
                      Antes: ${Number(product.precio).toLocaleString('es-CL')}
                    </p>
                    <p className="fs-4 fw-bold text-danger">
                      Ahora: ${Number(product.precioOferta).toLocaleString('es-CL')}
                    </p>
                    <button
                      className="btn btn-danger w-100 fw-bold"
                      onClick={() => onAddToCart(product)}
                    >
                      🛒 Añadir al carrito
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};