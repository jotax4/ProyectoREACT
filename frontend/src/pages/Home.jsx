import React, { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';

export const Home = ({ onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [categories, setCategories] = useState(['Todas']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarCatalogo = async () => {
      setLoading(true);
      setError('');
      try {
        const [prodsData, catsData] = await Promise.all([
          productService.getProducts(),
          categoryService.getCategories(),
        ]);
        setProducts(Array.isArray(prodsData) ? prodsData : []);
        const nombresCategorias = (Array.isArray(catsData) ? catsData : []).map((c) => c.nombre);
        setCategories(['Todas', ...nombresCategorias]);
      } catch (err) {
        console.error(err);
        setError('No se pudo conectar con el servidor backend (puerto 8081).');
      } finally {
        setLoading(false);
      }
    };

    cargarCatalogo();
  }, []);

  const filteredProducts =
    selectedCategory === 'Todas'
      ? products
      : products.filter((p) => (p.categoria?.nombre || p.categoria) === selectedCategory);

  return (
    <div className="container py-4 text-white">
      <div
        className="p-4 p-md-5 mb-5 rounded-4 text-center text-white position-relative overflow-hidden glass-card glow-border"
        style={{
          background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.35) 0%, rgba(15, 23, 42, 0.85) 100%)',
        }}
      >
        <h1 className="display-4 fw-black text-uppercase mb-3" style={{ letterSpacing: '1px' }}>
          Bienvenido a{' '}
          <span className="text-gradient-purple" style={{ textShadow: '0 0 20px rgba(168,85,247,0.5)' }}>
            Level UP Gamer
          </span>
        </h1>
        <p className="lead text-light opacity-75 max-w-lg mx-auto">
          Encuentra los mejores productos, ofertas exclusivas y equipamiento de alto rendimiento.
        </p>
      </div>

      <div className="d-flex justify-content-center gap-2 mb-4 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`btn btn-sm px-4 py-2 rounded-pill fw-semibold transition-all ${
              selectedCategory === cat ? 'btn-primary shadow-lg' : 'btn-outline-secondary text-light'
            }`}
            style={{
              backgroundColor: selectedCategory === cat ? '#a855f7' : 'transparent',
              borderColor: selectedCategory === cat ? '#a855f7' : 'rgba(255,255,255,0.2)',
            }}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <h3 className="fw-bold mb-4 border-start border-4 border-primary ps-3">
        Catálogo de Productos
      </h3>

      {error && <div className="alert alert-danger text-center">{error}</div>}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-secondary">Cargando productos desde la base de datos...</p>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {filteredProducts.map((product) => {
            const nombreCat = product.categoria?.nombre || product.categoria || 'General';
            const precioMostrar =
              product.oferta && product.precioOferta > 0 ? product.precioOferta : product.precio;

            return (
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
                      {nombreCat}
                    </span>
                    {product.oferta && (
                      <span className="position-absolute top-0 end-0 m-2 badge bg-danger">
                        OFERTA
                      </span>
                    )}
                  </div>

                  <div className="card-body d-flex flex-column p-3">
                    <h5 className="card-title fw-bold text-white mb-2 text-truncate" title={product.nombre}>
                      {product.nombre}
                    </h5>

                    <div className="mt-auto pt-3 border-top border-secondary">
                      {product.oferta && product.precioOferta > 0 && (
                        <small className="text-decoration-line-through text-secondary d-block">
                          ${Number(product.precio).toLocaleString('es-CL')}
                        </small>
                      )}
                      <p className="card-text fw-bold fs-5 text-info mb-3">
                        ${Number(precioMostrar).toLocaleString('es-CL')}
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
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Home;