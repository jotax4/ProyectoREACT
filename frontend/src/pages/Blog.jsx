import React, { useState } from 'react';
import { blogPosts } from '../data/blogData';

export function Blog() {
  const [postSeleccionado, setPostSeleccionado] = useState(null);

  return (
    <div className="container py-5 text-white">
      <div className="mb-4 text-center">
        <h2 className="fw-bold display-5">📰 Blog Gamer & Novedades</h2>
        <p className="text-secondary">Noticias, guías de hardware y novedades tecnológicas de la tienda</p>
      </div>

      <div className="row g-4">
        {blogPosts.map((post) => (
          <div key={post.id} className="col-md-4">
            <div className="card bg-dark text-white border-secondary h-100 shadow d-flex flex-column">
              <img 
                src={post.imagen} 
                className="card-img-top" 
                alt={post.titulo} 
                style={{ height: '220px', objectFit: 'cover' }} 
              />
              <div className="card-body d-flex flex-column">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="badge bg-primary">{post.categoria}</span>
                  <small className="text-secondary">{post.fecha}</small>
                </div>
                <h5 className="card-title fw-bold mb-3">{post.titulo}</h5>
                <p className="card-text text-secondary flex-grow-1">{post.resumen}</p>
                <div className="pt-3 border-top border-secondary d-flex justify-content-between align-items-center">
                  <small className="text-info">Por {post.autor}</small>
                  <button 
                    className="btn btn-sm btn-outline-light"
                    onClick={() => setPostSeleccionado(post)}
                  >
                    Leer Más 📖
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de lectura completa del artículo */}
      {postSeleccionado && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content bg-dark text-white border border-secondary shadow-lg">
              <div className="modal-header border-secondary">
                <h5 className="modal-title fw-bold">{postSeleccionado.titulo}</h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setPostSeleccionado(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <span className="badge bg-primary">{postSeleccionado.categoria}</span>
                  <small className="text-secondary">{postSeleccionado.fecha}</small>
                  <small className="text-info">Autor: {postSeleccionado.autor}</small>
                </div>
                <img 
                  src={postSeleccionado.imagen} 
                  alt={postSeleccionado.titulo} 
                  className="img-fluid rounded mb-4 w-100" 
                  style={{ maxHeight: '350px', objectFit: 'cover' }} 
                />
                <p className="lh-lg text-light fs-6">{postSeleccionado.contenido}</p>
              </div>
              <div className="modal-footer border-secondary">
                <button className="btn btn-secondary" onClick={() => setPostSeleccionado(null)}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}