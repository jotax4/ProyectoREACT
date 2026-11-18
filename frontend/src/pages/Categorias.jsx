import React, { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';

export function Categorias({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['Todas']);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoryService
      .getCategories()
      .then((cats) => {
        const nombres = (Array.isArray(cats) ? cats : []).map((c) => c.nombre);
        setCategories(['Todas', ...nombres]);
      })
      .catch((err) => console.error('Error cargando categorías:', err));
  }, []);

  useEffect(() => {
    const fetchByCategory = async () => {
      setLoading(true);
      try {
        const data = await productService.getProducts(selectedCategory);
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error filtrando productos:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchByCategory();
  }, [selectedCategory]);

  const filteredProducts = products.filter((product) =>
    product.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-100 py-4 px-3 px-md-5" style={{ backgroundColor: '#0f172a', minHeight: '100vh', color: '#f8fafc' }}>
      <div className="container">
        <div className="row mb-4 align-items-center">
          <div className="col-md-7 mb-3 mb-md-0">
            <h1 className="fw-bold text-white fs-2 mb-1">Catálogo de Categorías</h1>
            <p className="text-secondary mb-0">Filtra productos directamente desde la base de datos.</p>
          </div>
          <div className="col-md-5">
            <input
              type="text"
              className="form-control form-control-lg bg-dark text-white border-secondary"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="d-flex flex-wrap gap-2 mb-5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`btn ${selectedCategory === cat ? 'btn-primary fw-bold px-4' : 'btn-outline-light px-4'}`}
              style={{ borderRadius: '25px' }}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-5">
            <h4 className="text-secondary">No se encontraron productos que coincidan con tu búsqueda.</h4>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {filteredProducts.map((product) => {
              const nombreCat = product.categoria?.nombre || 'General';
              const descripcion = product.categoria?.descripcion || '';
              const precioMostrar =
                product.oferta && product.precioOferta > 0 ? product.precioOferta : product.precio;

              return (
                <div className="col" key={product.id}>
                  <div
                    className="card h-100 border-0 shadow-lg text-white"
                    style={{ backgroundColor: '#1e293b', borderRadius: '12px', overflow: 'hidden' }}
                  >
                    <img
                      src={product.imagen}
                      className="card-img-top"
                      alt={product.nombre}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <div className="card-body d-flex flex-column justify-content-between p-3">
                      <div>
                        <span className="badge bg-primary mb-2">{nombreCat}</span>
                        <h5 className="card-title text-white fw-bold mb-2">{product.nombre}</h5>
                        {descripcion && <p className="card-text text-secondary small mb-3">{descripcion}</p>}
                      </div>

                      <div>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <span className="fs-5 fw-bold text-info">
                            ${Number(precioMostrar).toLocaleString('es-CL')}
                          </span>
                        </div>
                        <button
                          onClick={() => onAddToCart(product)}
                          className="btn btn-primary w-100 fw-bold"
                        >
                          Añadir al Carrito
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
    </div>
  );
}

export default Categorias;