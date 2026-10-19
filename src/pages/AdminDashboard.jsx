import React, { useState, useEffect } from 'react';
import { storeService } from '../services/storeService';

export const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [errors, setErrors] = useState({});

  const [newProduct, setNewProduct] = useState({
    nombre: '',
    categoria: 'Consolas',
    precio: '',
    oferta: false,
    precioOferta: '',
    imagen: ''
  });

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setProducts(storeService.getProducts());
    setOrders(storeService.getOrders());
  };

  const validateProductForm = () => {
    const newErrors = {};

    // 1. Validar nombre
    if (!newProduct.nombre.trim() || newProduct.nombre.trim().length < 3) {
      newErrors.nombre = 'Nombre de producto requerido (mínimo 3 caracteres).';
    }

    // 2. Validar precio normal
    const precioNum = Number(newProduct.precio);
    if (!newProduct.precio || isNaN(precioNum) || precioNum <= 0) {
      newErrors.precio = 'El precio debe ser un número mayor a 0.';
    }

    // 3. Validar oferta
    if (newProduct.oferta) {
      const ofertaNum = Number(newProduct.precioOferta);
      if (!newProduct.precioOferta || isNaN(ofertaNum) || ofertaNum <= 0) {
        newErrors.precioOferta = 'El precio de oferta debe ser mayor a 0.';
      } else if (ofertaNum >= precioNum) {
        newErrors.precioOferta = 'El precio de oferta debe ser menor que el precio normal.';
      }
    }

    // 4. Validar URL de imagen
    const urlRegex = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|svg)|https?:\/\/.*)$/i;
    if (!newProduct.imagen.trim() || !urlRegex.test(newProduct.imagen.trim())) {
      newErrors.imagen = 'Ingresa una URL válida para la imagen (ej: https://.../foto.jpg).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateProduct = (e) => {
    e.preventDefault();

    if (!validateProductForm()) {
      return;
    }

    storeService.saveProduct({
      ...newProduct,
      nombre: newProduct.nombre.trim(),
      precio: Number(newProduct.precio),
      oferta: newProduct.oferta,
      precioOferta: newProduct.oferta ? Number(newProduct.precioOferta) : 0,
      imagen: newProduct.imagen.trim()
    });

    setNewProduct({
      nombre: '',
      categoria: 'Consolas',
      precio: '',
      oferta: false,
      precioOferta: '',
      imagen: ''
    });
    setErrors({});
    refreshData();
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      storeService.deleteProduct(id);
      refreshData();
    }
  };

  return (
    <div>
      <h2 className="mb-4">Panel de Administración</h2>

      <div className="card p-4 mb-5 shadow-sm">
        <h4>Agregar Nuevo Producto</h4>
        <form onSubmit={handleCreateProduct} className="row g-3 mt-1" noValidate>
          <div className="col-md-6">
            <label className="form-label">Nombre del Producto</label>
            <input
              type="text"
              className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
              value={newProduct.nombre}
              onChange={(e) => setNewProduct({ ...newProduct, nombre: e.target.value })}
            />
            {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
          </div>

          <div className="col-md-3">
            <label className="form-label">Categoría</label>
            <select
              className="form-select"
              value={newProduct.categoria}
              onChange={(e) => setNewProduct({ ...newProduct, categoria: e.target.value })}
            >
              <option value="Consolas">Consolas</option>
              <option value="Juegos">Juegos</option>
              <option value="Accesorios">Accesorios</option>
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label">Precio Normal ($)</label>
            <input
              type="number"
              className={`form-control ${errors.precio ? 'is-invalid' : ''}`}
              value={newProduct.precio}
              onChange={(e) => setNewProduct({ ...newProduct, precio: e.target.value })}
            />
            {errors.precio && <div className="invalid-feedback">{errors.precio}</div>}
          </div>

          <div className="col-md-3">
            <div className="form-check mt-4">
              <input
                type="checkbox"
                className="form-check-input"
                id="checkOferta"
                checked={newProduct.oferta}
                onChange={(e) => setNewProduct({ ...newProduct, oferta: e.target.checked })}
              />
              <label className="form-check-label" htmlFor="checkOferta">¿En Oferta?</label>
            </div>
          </div>

          {newProduct.oferta && (
            <div className="col-md-3">
              <label className="form-label">Precio Oferta ($)</label>
              <input
                type="number"
                className={`form-control ${errors.precioOferta ? 'is-invalid' : ''}`}
                value={newProduct.precioOferta}
                onChange={(e) => setNewProduct({ ...newProduct, precioOferta: e.target.value })}
              />
              {errors.precioOferta && <div className="invalid-feedback">{errors.precioOferta}</div>}
            </div>
          )}

          <div className="col-md-12">
            <label className="form-label">URL Imagen del Producto</label>
            <input
              type="url"
              className={`form-control ${errors.imagen ? 'is-invalid' : ''}`}
              placeholder="https://images.unsplash.com/photo-..."
              value={newProduct.imagen}
              onChange={(e) => setNewProduct({ ...newProduct, imagen: e.target.value })}
            />
            {errors.imagen && <div className="invalid-feedback">{errors.imagen}</div>}
          </div>

          <div className="col-12">
            <button type="submit" className="btn btn-primary">
              Guardar Producto
            </button>
          </div>
        </form>
      </div>

      <h4>Productos Existentes</h4>
      <div className="table-responsive mb-5">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Oferta</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.nombre}</td>
                <td>{p.categoria}</td>
                <td>${p.precio.toLocaleString('es-CL')}</td>
                <td>{p.oferta ? `$${p.precioOferta.toLocaleString('es-CL')}` : 'No'}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteProduct(p.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h4>Historial de Órdenes</h4>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID Orden</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Contacto</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>#{o.id}</td>
                <td>{o.fecha}</td>
                <td>{o.cliente?.nombre || 'N/A'}</td>
                <td>{o.cliente?.email || 'N/A'}</td>
                <td>${o.total?.toLocaleString('es-CL')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};