import React, { useState } from 'react';

// Datos de demostración (si utilizas un servicio backend o prop externa, puedes pasarla como prop 'products')
const PRODUCTOS_BASE = [
  { 
    id: 1, 
    nombre: 'PlayStation 5', 
    categoria: 'Consolas', 
    precio: 499990, 
    imagen: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&q=80', 
    descripcion: 'Consola PS5 con lector de discos y 825GB SSD ultra veloz.' 
  },
  { 
    id: 2, 
    nombre: 'Nintendo Switch OLED', 
    categoria: 'Consolas', 
    precio: 349990, 
    imagen: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=500&q=80', 
    descripcion: 'Pantalla OLED de 7 pulgadas con colores intensos y 64GB de memoria.' 
  },
  { 
    id: 3, 
    nombre: 'Xbox Series X', 
    categoria: 'Consolas', 
    precio: 479990, 
    imagen: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=500&q=80', 
    descripcion: '12 teraflops de potencia gráfica, SSD de 1TB y Quick Resume.' 
  },
  { 
    id: 4, 
    nombre: 'Mando DualSense Wireless', 
    categoria: 'Accesorios', 
    precio: 69990, 
    imagen: 'https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=500&q=80', 
    descripcion: 'Inmersión profunda con respuesta háptica y gatillos adaptativos.' 
  },
  { 
    id: 5, 
    nombre: 'Audífonos Gamer Wireless 7.1', 
    categoria: 'Accesorios', 
    precio: 89990, 
    imagen: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&q=80', 
    descripcion: 'Sonido envolvente, micrófono con cancelación de ruido y batería de 20h.' 
  },
  { 
    id: 6, 
    nombre: 'Spider-Man 2 PS5', 
    categoria: 'Juegos', 
    precio: 59990, 
    imagen: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=500&q=80', 
    descripcion: 'Aventura épica de Peter Parker y Miles Morales en edición física.' 
  },
  { 
    id: 7, 
    nombre: 'The Legend of Zelda: Tears of the Kingdom', 
    categoria: 'Juegos', 
    precio: 54990, 
    imagen: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=500&q=80', 
    descripcion: 'Explora los cielos y tierras de Hyrule en esta entrega galardonada.' 
  },
  { 
    id: 8, 
    nombre: 'Silla Gamer Ergonómica', 
    categoria: 'Accesorios', 
    precio: 129990, 
    imagen: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=500&q=80', 
    descripcion: 'Soporte lumbar ajustable, reposabrazos 3D y reclinable 180°.' 
  }
];

const CATEGORIAS_LISTA = ['Todas', 'Consolas', 'Juegos', 'Accesorios'];

export function Categorias({ onAddToCart, products = PRODUCTOS_BASE }) {
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'Todas' || product.categoria === selectedCategory;
    const matchesSearch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-100 py-4 px-3 px-md-5" style={{ backgroundColor: '#0f172a', minHeight: '100vh', color: '#f8fafc' }}>
      
      {/* Encabezado y buscador */}
      <div className="row mb-4 align-items-center">
        <div className="col-md-7 mb-3 mb-md-0">
          <h1 className="fw-bold text-white fs-2 mb-1">Catálogo de Categorías</h1>
          <p className="text-secondary mb-0">Filtra tus productos por tipo o usa el buscador en tiempo real.</p>
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

      {/* Botones de Categorías */}
      <div className="d-flex flex-wrap gap-2 mb-5">
        {CATEGORIAS_LISTA.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`btn ${selectedCategory === cat ? 'btn-primary fw-bold px-4' : 'btn-outline-light px-4'}`}
            style={{ borderRadius: '25px', transition: 'all 0.2s ease' }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grilla de Productos */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-5">
          <h4 className="text-secondary">No se encontraron productos que coincidan con tu búsqueda.</h4>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {filteredProducts.map((product) => (
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
                    <span className="badge bg-primary mb-2">{product.categoria}</span>
                    <h5 className="card-title text-white fw-bold mb-2">{product.nombre}</h5>
                    <p className="card-text text-secondary small mb-3">{product.descripcion}</p>
                  </div>
                  
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="fs-5 fw-bold text-info">
                        ${product.precio.toLocaleString('es-CL')}
                      </span>
                    </div>
                    <button
                      onClick={() => onAddToCart(product)}
                      className="btn btn-primary w-100 fw-bold d-flex align-items-center justify-content-center gap-2"
                    >
                      Añadir al Carrito
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
}

export default Categorias;