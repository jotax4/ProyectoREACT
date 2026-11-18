import React, { useState, useEffect } from 'react';
import { orderService } from '../services/orderService';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { personaService } from '../services/personaService';

const ESTADOS_PEDIDO = ['PENDIENTE', 'EN_PREPARACION', 'ENVIADO', 'ENTREGADO', 'CANCELADO'];
const ROLES_USUARIO = ['CLIENTE', 'VENDEDOR', 'ADMIN'];

const BADGE_ESTADO = {
  PENDIENTE: 'bg-warning text-dark',
  EN_PREPARACION: 'bg-info text-dark',
  ENVIADO: 'bg-primary',
  ENTREGADO: 'bg-success',
  CANCELADO: 'bg-danger',
};

const BADGE_ROL = {
  ADMIN: 'bg-danger',
  VENDEDOR: 'bg-info text-dark',
  CLIENTE: 'bg-secondary',
};

const PRODUCTO_INICIAL = {
  nombre: '',
  categoriaId: '',
  precio: '',
  oferta: false,
  precioOferta: '',
  imagen: '',
};

const CATEGORIA_INICIAL = {
  nombre: '',
  descripcion: '',
};

const USUARIO_INICIAL = {
  rut: '',
  nombre: '',
  email: '',
  fechaNacimiento: '',
  rol: 'CLIENTE',
  password: '',
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('pedidos');
  const [feedback, setFeedback] = useState({ type: '', text: '' });
  const [confirmDelete, setConfirmDelete] = useState({ tipo: null, id: null });

  // Estados de Pedidos
  const [pedidos, setPedidos] = useState([]);
  const [loadingPedidos, setLoadingPedidos] = useState(true);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [actualizandoId, setActualizandoId] = useState(null);

  // Estados de Productos
  const [productos, setProductos] = useState([]);
  const [loadingProductos, setLoadingProductos] = useState(false);
  const [productoForm, setProductoForm] = useState(PRODUCTO_INICIAL);
  const [editandoProductoId, setEditandoProductoId] = useState(null);

  // Estados de Categorías
  const [categorias, setCategorias] = useState([]);
  const [loadingCategorias, setLoadingCategorias] = useState(false);
  const [categoriaForm, setCategoriaForm] = useState(CATEGORIA_INICIAL);
  const [editandoCategoriaId, setEditandoCategoriaId] = useState(null);

  // Estados de Usuarios
  const [usuarios, setUsuarios] = useState([]);
  const [loadingUsuarios, setLoadingUsuarios] = useState(false);
  const [usuarioForm, setUsuarioForm] = useState(USUARIO_INICIAL);
  const [editandoUsuarioId, setEditandoUsuarioId] = useState(null);

  const mostrarMensaje = (type, text) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback({ type: '', text: '' }), 4500);
  };

  // --- CARGA DE DATOS DESDE SERVICIOS ---
  const cargarPedidos = async () => {
    setLoadingPedidos(true);
    try {
      const data = await orderService.getOrders();
      setPedidos(Array.isArray(data) ? data : []);
    } catch (error) {
      mostrarMensaje('danger', 'No se pudieron cargar los pedidos desde el servidor.');
    } finally {
      setLoadingPedidos(false);
    }
  };

  const cargarProductosYCategorias = async () => {
    setLoadingProductos(true);
    setLoadingCategorias(true);
    try {
      const [prods, cats] = await Promise.all([
        productService.getProducts(),
        categoryService.getCategories(),
      ]);
      setProductos(Array.isArray(prods) ? prods : []);
      setCategorias(Array.isArray(cats) ? cats : []);
    } catch (error) {
      mostrarMensaje('danger', 'Error al obtener productos y categorías desde el backend.');
    } finally {
      setLoadingProductos(false);
      setLoadingCategorias(false);
    }
  };

  const cargarUsuarios = async () => {
    setLoadingUsuarios(true);
    try {
      const data = await personaService.getAll();
      setUsuarios(Array.isArray(data) ? data : []);
    } catch (error) {
      mostrarMensaje('danger', 'No se pudo cargar la lista de usuarios (requiere rol ADMIN).');
    } finally {
      setLoadingUsuarios(false);
    }
  };

  useEffect(() => {
    cargarPedidos();
    cargarProductosYCategorias();
    cargarUsuarios();
  }, []);

  // --- HANDLERS PEDIDOS ---
  const handleCambiarEstado = async (pedidoId, nuevoEstado) => {
    setActualizandoId(pedidoId);
    try {
      const actualizado = await orderService.updateOrderStatus(pedidoId, nuevoEstado);
      setPedidos((prev) =>
        prev.map((p) => (p.id === pedidoId ? { ...p, estado: actualizado.estado || nuevoEstado } : p))
      );
      if (pedidoSeleccionado?.id === pedidoId) {
        setPedidoSeleccionado((prev) => ({ ...prev, estado: actualizado.estado || nuevoEstado }));
      }
      mostrarMensaje('success', `Estado de la orden #${pedidoId} actualizado a ${nuevoEstado}.`);
    } catch (error) {
      mostrarMensaje('danger', 'No se pudo actualizar el estado del pedido.');
    } finally {
      setActualizandoId(null);
    }
  };

  // --- HANDLERS PRODUCTOS ---
  const handleGuardarProducto = async (e) => {
    e.preventDefault();
    if (!productoForm.nombre.trim() || !productoForm.categoriaId || !productoForm.precio) {
      mostrarMensaje('danger', 'Completa nombre, categoría y precio del producto.');
      return;
    }

    const payload = {
      nombre: productoForm.nombre.trim(),
      categoria: { id: Number(productoForm.categoriaId) },
      precio: Number(productoForm.precio),
      oferta: Boolean(productoForm.oferta),
      precioOferta: productoForm.oferta ? Number(productoForm.precioOferta || 0) : 0,
      imagen: productoForm.imagen.trim(),
    };

    try {
      if (editandoProductoId) {
        await productService.updateProduct(editandoProductoId, payload);
        mostrarMensaje('success', 'Producto actualizado correctamente.');
      } else {
        await productService.createProduct(payload);
        mostrarMensaje('success', 'Producto creado correctamente.');
      }
      setProductoForm(PRODUCTO_INICIAL);
      setEditandoProductoId(null);
      await cargarProductosYCategorias();
    } catch (error) {
      mostrarMensaje('danger', error.message || 'Error al guardar el producto.');
    }
  };

  const handleEditarProducto = (prod) => {
    setEditandoProductoId(prod.id);
    setProductoForm({
      nombre: prod.nombre || '',
      categoriaId: prod.categoria?.id || '',
      precio: prod.precio ?? '',
      oferta: Boolean(prod.oferta),
      precioOferta: prod.precioOferta ?? '',
      imagen: prod.imagen || '',
    });
  };

  const handleEliminarProducto = async (id) => {
    try {
      await productService.deleteProduct(id);
      setConfirmDelete({ tipo: null, id: null });
      mostrarMensaje('success', 'Producto eliminado del catálogo.');
      await cargarProductosYCategorias();
    } catch (error) {
      mostrarMensaje('danger', 'No se pudo eliminar el producto (puede estar asociado a un pedido).');
    }
  };

  // --- HANDLERS CATEGORÍAS ---
  const handleGuardarCategoria = async (e) => {
    e.preventDefault();
    if (!categoriaForm.nombre.trim()) {
      mostrarMensaje('danger', 'El nombre de la categoría es obligatorio.');
      return;
    }

    const payload = {
      nombre: categoriaForm.nombre.trim(),
      descripcion: categoriaForm.descripcion.trim(),
    };

    try {
      if (editandoCategoriaId) {
        await categoryService.updateCategory(editandoCategoriaId, payload);
        mostrarMensaje('success', 'Categoría actualizada correctamente.');
      } else {
        await categoryService.createCategory(payload);
        mostrarMensaje('success', 'Categoría creada correctamente.');
      }
      setCategoriaForm(CATEGORIA_INICIAL);
      setEditandoCategoriaId(null);
      await cargarProductosYCategorias();
    } catch (error) {
      mostrarMensaje('danger', error.message || 'Error al guardar la categoría.');
    }
  };

  const handleEditarCategoria = (cat) => {
    setEditandoCategoriaId(cat.id);
    setCategoriaForm({
      nombre: cat.nombre || '',
      descripcion: cat.descripcion || '',
    });
  };

  const handleEliminarCategoria = async (id) => {
    try {
      await categoryService.deleteCategory(id);
      setConfirmDelete({ tipo: null, id: null });
      mostrarMensaje('success', 'Categoría eliminada correctamente.');
      await cargarProductosYCategorias();
    } catch (error) {
      mostrarMensaje('danger', 'No se puede eliminar la categoría porque tiene productos asociados.');
    }
  };

  // --- HANDLERS USUARIOS ---
  const handleGuardarUsuario = async (e) => {
    e.preventDefault();
    if (!usuarioForm.rut.trim() || !usuarioForm.nombre.trim() || !usuarioForm.email.trim()) {
      mostrarMensaje('danger', 'RUT, nombre y correo son obligatorios.');
      return;
    }
    if (!editandoUsuarioId && !usuarioForm.password.trim()) {
      mostrarMensaje('danger', 'Debes asignar una contraseña al crear un usuario.');
      return;
    }

    const payload = {
      rut: usuarioForm.rut.trim(),
      nombre: usuarioForm.nombre.trim(),
      email: usuarioForm.email.trim(),
      fechaNacimiento: usuarioForm.fechaNacimiento || null,
      rol: usuarioForm.rol,
      ...(usuarioForm.password.trim() ? { password: usuarioForm.password.trim() } : {}),
    };

    try {
      const response = editandoUsuarioId
        ? await personaService.update(editandoUsuarioId, payload)
        : await personaService.create(payload);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Error ${response.status} al guardar usuario`);
      }

      mostrarMensaje(
        'success',
        editandoUsuarioId ? 'Usuario actualizado correctamente.' : 'Usuario registrado correctamente.'
      );
      setUsuarioForm(USUARIO_INICIAL);
      setEditandoUsuarioId(null);
      await cargarUsuarios();
    } catch (error) {
      mostrarMensaje('danger', error.message);
    }
  };

  const handleEditarUsuario = (u) => {
    setEditandoUsuarioId(u.id);
    setUsuarioForm({
      rut: u.rut || '',
      nombre: u.nombre || '',
      email: u.email || '',
      fechaNacimiento: u.fechaNacimiento || '',
      rol: u.rol || 'CLIENTE',
      password: '',
    });
  };

  const handleEliminarUsuario = async (id) => {
    try {
      const response = await personaService.remove(id);
      if (!response.ok) {
        throw new Error('No se pudo eliminar el usuario (puede tener pedidos registrados).');
      }
      setConfirmDelete({ tipo: null, id: null });
      mostrarMensaje('success', 'Usuario eliminado correctamente.');
      await cargarUsuarios();
    } catch (error) {
      mostrarMensaje('danger', error.message);
    }
  };

  const formatearFecha = (fechaIso) => {
    if (!fechaIso) return 'Sin fecha';
    return new Date(fechaIso).toLocaleString('es-CL', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  };

  const totalVentas = pedidos
    .filter((p) => p.estado !== 'CANCELADO')
    .reduce((acc, p) => acc + (Number(p.total) || 0), 0);
  const totalPedidos = pedidos.length;
  const ticketPromedio = totalPedidos > 0 ? totalVentas / totalPedidos : 0;

  return (
    <div className="container py-5 text-white">
      {/* Encabezado */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold m-0">Panel de Administración</h2>
          <small className="text-secondary">
            Gestión integral conectada a Spring Boot & MySQL
          </small>
        </div>
        <button
          className="btn btn-outline-light btn-sm px-3"
          onClick={() => {
            cargarPedidos();
            cargarProductosYCategorias();
            cargarUsuarios();
          }}
        >
          🔄 Sincronizar Todo
        </button>
      </div>

      {/* Tarjetas de Métricas */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="bg-dark p-3 rounded border border-secondary shadow">
            <span className="text-secondary small d-block">Ventas Totales</span>
            <h4 className="fw-bold text-success m-0">${totalVentas.toLocaleString('es-CL')}</h4>
          </div>
        </div>
        <div className="col-md-3">
          <div className="bg-dark p-3 rounded border border-secondary shadow">
            <span className="text-secondary small d-block">Órdenes Procesadas</span>
            <h4 className="fw-bold text-info m-0">{totalPedidos}</h4>
          </div>
        </div>
        <div className="col-md-3">
          <div className="bg-dark p-3 rounded border border-secondary shadow">
            <span className="text-secondary small d-block">Productos Activos</span>
            <h4 className="fw-bold text-primary m-0">{productos.length}</h4>
          </div>
        </div>
        <div className="col-md-3">
          <div className="bg-dark p-3 rounded border border-secondary shadow">
            <span className="text-secondary small d-block">Ticket Promedio</span>
            <h4 className="fw-bold text-warning m-0">${Math.round(ticketPromedio).toLocaleString('es-CL')}</h4>
          </div>
        </div>
      </div>

      {/* Pestañas de Navegación CRUD */}
      <ul className="nav nav-pills mb-4 gap-2 bg-dark p-2 rounded border border-secondary">
        <li className="nav-item">
          <button
            className={`nav-link fw-semibold ${activeTab === 'pedidos' ? 'active' : 'text-light'}`}
            onClick={() => setActiveTab('pedidos')}
          >
            📦 Pedidos ({pedidos.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link fw-semibold ${activeTab === 'productos' ? 'active' : 'text-light'}`}
            onClick={() => setActiveTab('productos')}
          >
            🎮 Productos ({productos.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link fw-semibold ${activeTab === 'categorias' ? 'active' : 'text-light'}`}
            onClick={() => setActiveTab('categorias')}
          >
            🏷️ Categorías ({categorias.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link fw-semibold ${activeTab === 'usuarios' ? 'active' : 'text-light'}`}
            onClick={() => setActiveTab('usuarios')}
          >
            👥 Usuarios ({usuarios.length})
          </button>
        </li>
      </ul>

      {/* Alertas de Feedback */}
      {feedback.text && (
        <div className={`alert alert-${feedback.type} text-center fw-semibold`}>
          {feedback.text}
        </div>
      )}

      {/* ==================== PESTAÑA 1: PEDIDOS ==================== */}
      {activeTab === 'pedidos' && (
        <>
          {loadingPedidos ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : pedidos.length === 0 ? (
            <div className="alert alert-info text-center">No hay pedidos registrados en la base de datos.</div>
          ) : (
            <div className="table-responsive bg-dark p-3 rounded border border-secondary shadow">
              <table className="table table-dark table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th># Orden</th>
                    <th>Fecha</th>
                    <th>Cliente</th>
                    <th>Teléfono</th>
                    <th>Envío</th>
                    <th>Estado</th>
                    <th>Total</th>
                    <th className="text-center">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.map((pedido) => {
                    const nombreCliente = pedido.persona?.nombre || pedido.nombre || 'Cliente';
                    const emailCliente = pedido.persona?.email || pedido.email || 'Sin correo';
                    const metodoEnvio = pedido.metodoEnvio || 'No especificado';
                    const estadoActual = pedido.estado || 'PENDIENTE';

                    return (
                      <tr key={pedido.id}>
                        <td><span className="badge bg-primary fs-6">#{pedido.id}</span></td>
                        <td><small>{formatearFecha(pedido.fecha)}</small></td>
                        <td>
                          <div className="fw-bold">{nombreCliente}</div>
                          <small className="text-secondary">{emailCliente}</small>
                        </td>
                        <td><small>{pedido.telefono || 'Sin teléfono'}</small></td>
                        <td>
                          <span className={`badge ${metodoEnvio.toLowerCase().includes('retiro') ? 'bg-secondary' : 'bg-info text-dark'}`}>
                            {metodoEnvio}
                          </span>
                        </td>
                        <td>
                          <select
                            className={`form-select form-select-sm fw-semibold border-0 ${BADGE_ESTADO[estadoActual] || 'bg-secondary text-white'}`}
                            style={{ width: '165px' }}
                            value={estadoActual}
                            disabled={actualizandoId === pedido.id}
                            onChange={(e) => handleCambiarEstado(pedido.id, e.target.value)}
                          >
                            {ESTADOS_PEDIDO.map((est) => (
                              <option key={est} value={est} className="bg-dark text-white">
                                {est.replace('_', ' ')}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="fw-bold text-success">${Number(pedido.total || 0).toLocaleString('es-CL')}</td>
                        <td className="text-center">
                          <button
                            className="btn btn-sm btn-outline-info"
                            onClick={() => setPedidoSeleccionado(pedido)}
                          >
                            👁️ Ver Detalle
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* ==================== PESTAÑA 2: CRUD PRODUCTOS ==================== */}
      {activeTab === 'productos' && (
        <div className="row g-4">
          <div className="col-lg-4">
            <form onSubmit={handleGuardarProducto} className="bg-dark p-4 rounded border border-secondary shadow">
              <h5 className="fw-bold mb-3">
                {editandoProductoId ? `Editar Producto #${editandoProductoId}` : 'Nuevo Producto'}
              </h5>

              <div className="mb-3">
                <label className="form-label small text-secondary">Nombre del Producto *</label>
                <input
                  type="text"
                  className="form-control bg-secondary bg-opacity-25 text-white border-secondary"
                  value={productoForm.nombre}
                  onChange={(e) => setProductoForm({ ...productoForm, nombre: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small text-secondary">Categoría *</label>
                <select
                  className="form-select bg-dark text-white border-secondary"
                  value={productoForm.categoriaId}
                  onChange={(e) => setProductoForm({ ...productoForm, categoriaId: e.target.value })}
                  required
                >
                  <option value="">Selecciona una categoría...</option>
                  {categorias.map((c) => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label small text-secondary">Precio Normal (CLP) *</label>
                <input
                  type="number"
                  min="1"
                  className="form-control bg-secondary bg-opacity-25 text-white border-secondary"
                  value={productoForm.precio}
                  onChange={(e) => setProductoForm({ ...productoForm, precio: e.target.value })}
                  required
                />
              </div>

              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="checkOferta"
                  checked={productoForm.oferta}
                  onChange={(e) => setProductoForm({ ...productoForm, oferta: e.target.checked })}
                />
                <label className="form-check-label" htmlFor="checkOferta">
                  Producto en Oferta
                </label>
              </div>

              {productoForm.oferta && (
                <div className="mb-3">
                  <label className="form-label small text-warning">Precio Oferta (CLP) *</label>
                  <input
                    type="number"
                    min="1"
                    className="form-control bg-secondary bg-opacity-25 text-white border-warning"
                    value={productoForm.precioOferta}
                    onChange={(e) => setProductoForm({ ...productoForm, precioOferta: e.target.value })}
                    required
                  />
                </div>
              )}

              <div className="mb-3">
                <label className="form-label small text-secondary">URL de Imagen</label>
                <input
                  type="url"
                  placeholder="https://..."
                  className="form-control bg-secondary bg-opacity-25 text-white border-secondary"
                  value={productoForm.imagen}
                  onChange={(e) => setProductoForm({ ...productoForm, imagen: e.target.value })}
                />
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary w-100 fw-bold">
                  {editandoProductoId ? 'Actualizar' : 'Guardar Producto'}
                </button>
                {editandoProductoId && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setEditandoProductoId(null);
                      setProductoForm(PRODUCTO_INICIAL);
                    }}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="col-lg-8">
            <div className="table-responsive bg-dark p-3 rounded border border-secondary shadow">
              {loadingProductos ? (
                <div className="text-center py-4"><div className="spinner-border text-primary"></div></div>
              ) : (
                <table className="table table-dark table-hover align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Categoría</th>
                      <th>Precio</th>
                      <th className="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productos.map((prod) => {
                      const confirmando = confirmDelete.tipo === 'producto' && confirmDelete.id === prod.id;
                      return (
                        <tr key={prod.id}>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              {prod.imagen && (
                                <img
                                  src={prod.imagen}
                                  alt={prod.nombre}
                                  style={{ width: '42px', height: '42px', objectFit: 'cover' }}
                                  className="rounded"
                                />
                              )}
                              <div>
                                <div className="fw-bold">{prod.nombre}</div>
                                {prod.oferta && <span className="badge bg-danger">OFERTA</span>}
                              </div>
                            </div>
                          </td>
                          <td><span className="badge bg-primary">{prod.categoria?.nombre || 'Sin cat.'}</span></td>
                          <td>
                            {prod.oferta && prod.precioOferta > 0 ? (
                              <div>
                                <small className="text-decoration-line-through text-secondary d-block">
                                  ${Number(prod.precio).toLocaleString('es-CL')}
                                </small>
                                <span className="fw-bold text-success">
                                  ${Number(prod.precioOferta).toLocaleString('es-CL')}
                                </span>
                              </div>
                            ) : (
                              <span className="fw-bold text-info">
                                ${Number(prod.precio || 0).toLocaleString('es-CL')}
                              </span>
                            )}
                          </td>
                          <td className="text-center" style={{ minWidth: '175px' }}>
                            {confirmando ? (
                              <div className="d-inline-flex gap-1">
                                <button
                                  className="btn btn-sm btn-danger fw-semibold"
                                  onClick={() => handleEliminarProducto(prod.id)}
                                >
                                  Confirmar
                                </button>
                                <button
                                  className="btn btn-sm btn-secondary"
                                  onClick={() => setConfirmDelete({ tipo: null, id: null })}
                                >
                                  Cancelar
                                </button>
                              </div>
                            ) : (
                              <div className="d-inline-flex gap-2">
                                <button
                                  className="btn btn-sm btn-outline-warning"
                                  onClick={() => handleEditarProducto(prod)}
                                >
                                  Editar
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => setConfirmDelete({ tipo: 'producto', id: prod.id })}
                                >
                                  Eliminar
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== PESTAÑA 3: CRUD CATEGORÍAS ==================== */}
      {activeTab === 'categorias' && (
        <div className="row g-4">
          <div className="col-lg-4">
            <form onSubmit={handleGuardarCategoria} className="bg-dark p-4 rounded border border-secondary shadow">
              <h5 className="fw-bold mb-3">
                {editandoCategoriaId ? `Editar Categoría #${editandoCategoriaId}` : 'Nueva Categoría'}
              </h5>

              <div className="mb-3">
                <label className="form-label small text-secondary">Nombre *</label>
                <input
                  type="text"
                  className="form-control bg-secondary bg-opacity-25 text-white border-secondary"
                  value={categoriaForm.nombre}
                  onChange={(e) => setCategoriaForm({ ...categoriaForm, nombre: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small text-secondary">Descripción</label>
                <textarea
                  rows="3"
                  className="form-control bg-secondary bg-opacity-25 text-white border-secondary"
                  value={categoriaForm.descripcion}
                  onChange={(e) => setCategoriaForm({ ...categoriaForm, descripcion: e.target.value })}
                />
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary w-100 fw-bold">
                  {editandoCategoriaId ? 'Actualizar' : 'Crear Categoría'}
                </button>
                {editandoCategoriaId && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setEditandoCategoriaId(null);
                      setCategoriaForm(CATEGORIA_INICIAL);
                    }}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="col-lg-8">
            <div className="table-responsive bg-dark p-3 rounded border border-secondary shadow">
              {loadingCategorias ? (
                <div className="text-center py-4"><div className="spinner-border text-primary"></div></div>
              ) : (
                <table className="table table-dark table-hover align-middle mb-0">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Descripción</th>
                      <th className="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categorias.map((cat) => {
                      const confirmando = confirmDelete.tipo === 'categoria' && confirmDelete.id === cat.id;
                      return (
                        <tr key={cat.id}>
                          <td><span className="badge bg-secondary">#{cat.id}</span></td>
                          <td className="fw-bold">{cat.nombre}</td>
                          <td className="text-secondary small">{cat.descripcion || 'Sin descripción'}</td>
                          <td className="text-center" style={{ minWidth: '175px' }}>
                            {confirmando ? (
                              <div className="d-inline-flex gap-1">
                                <button
                                  className="btn btn-sm btn-danger fw-semibold"
                                  onClick={() => handleEliminarCategoria(cat.id)}
                                >
                                  Confirmar
                                </button>
                                <button
                                  className="btn btn-sm btn-secondary"
                                  onClick={() => setConfirmDelete({ tipo: null, id: null })}
                                >
                                  Cancelar
                                </button>
                              </div>
                            ) : (
                              <div className="d-inline-flex gap-2">
                                <button
                                  className="btn btn-sm btn-outline-warning"
                                  onClick={() => handleEditarCategoria(cat)}
                                >
                                  Editar
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => setConfirmDelete({ tipo: 'categoria', id: cat.id })}
                                >
                                  Eliminar
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== PESTAÑA 4: CRUD USUARIOS ==================== */}
      {activeTab === 'usuarios' && (
        <div className="row g-4">
          <div className="col-lg-4">
            <form onSubmit={handleGuardarUsuario} className="bg-dark p-4 rounded border border-secondary shadow">
              <h5 className="fw-bold mb-3">
                {editandoUsuarioId ? `Editar Usuario #${editandoUsuarioId}` : 'Nuevo Usuario'}
              </h5>

              <div className="mb-2">
                <label className="form-label small text-secondary">RUT *</label>
                <input
                  type="text"
                  placeholder="12345678-9"
                  className="form-control bg-secondary bg-opacity-25 text-white border-secondary"
                  value={usuarioForm.rut}
                  onChange={(e) => setUsuarioForm({ ...usuarioForm, rut: e.target.value })}
                  required
                />
              </div>

              <div className="mb-2">
                <label className="form-label small text-secondary">Nombre Completo *</label>
                <input
                  type="text"
                  className="form-control bg-secondary bg-opacity-25 text-white border-secondary"
                  value={usuarioForm.nombre}
                  onChange={(e) => setUsuarioForm({ ...usuarioForm, nombre: e.target.value })}
                  required
                />
              </div>

              <div className="mb-2">
                <label className="form-label small text-secondary">Correo Electrónico *</label>
                <input
                  type="email"
                  className="form-control bg-secondary bg-opacity-25 text-white border-secondary"
                  value={usuarioForm.email}
                  onChange={(e) => setUsuarioForm({ ...usuarioForm, email: e.target.value })}
                  required
                />
              </div>

              <div className="mb-2">
                <label className="form-label small text-secondary">Fecha de Nacimiento</label>
                <input
                  type="date"
                  className="form-control bg-secondary bg-opacity-25 text-white border-secondary"
                  value={usuarioForm.fechaNacimiento}
                  onChange={(e) => setUsuarioForm({ ...usuarioForm, fechaNacimiento: e.target.value })}
                />
              </div>

              <div className="mb-2">
                <label className="form-label small text-secondary">Rol de Acceso *</label>
                <select
                  className="form-select bg-dark text-white border-secondary"
                  value={usuarioForm.rol}
                  onChange={(e) => setUsuarioForm({ ...usuarioForm, rol: e.target.value })}
                >
                  {ROLES_USUARIO.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label small text-secondary">
                  {editandoUsuarioId ? 'Nueva Contraseña (opcional)' : 'Contraseña *'}
                </label>
                <input
                  type="password"
                  className="form-control bg-secondary bg-opacity-25 text-white border-secondary"
                  value={usuarioForm.password}
                  onChange={(e) => setUsuarioForm({ ...usuarioForm, password: e.target.value })}
                  required={!editandoUsuarioId}
                />
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary w-100 fw-bold">
                  {editandoUsuarioId ? 'Actualizar' : 'Crear Usuario'}
                </button>
                {editandoUsuarioId && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setEditandoUsuarioId(null);
                      setUsuarioForm(USUARIO_INICIAL);
                    }}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="col-lg-8">
            <div className="table-responsive bg-dark p-3 rounded border border-secondary shadow">
              {loadingUsuarios ? (
                <div className="text-center py-4"><div className="spinner-border text-primary"></div></div>
              ) : (
                <table className="table table-dark table-hover align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Usuario</th>
                      <th>RUT</th>
                      <th>Rol</th>
                      <th className="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((u) => {
                      const confirmando = confirmDelete.tipo === 'usuario' && confirmDelete.id === u.id;
                      return (
                        <tr key={u.id}>
                          <td>
                            <div className="fw-bold">{u.nombre}</div>
                            <small className="text-secondary">{u.email}</small>
                          </td>
                          <td><small>{u.rut}</small></td>
                          <td>
                            <span className={`badge ${BADGE_ROL[u.rol] || 'bg-secondary'}`}>
                              {u.rol}
                            </span>
                          </td>
                          <td className="text-center" style={{ minWidth: '175px' }}>
                            {confirmando ? (
                              <div className="d-inline-flex gap-1">
                                <button
                                  className="btn btn-sm btn-danger fw-semibold"
                                  onClick={() => handleEliminarUsuario(u.id)}
                                >
                                  Confirmar
                                </button>
                                <button
                                  className="btn btn-sm btn-secondary"
                                  onClick={() => setConfirmDelete({ tipo: null, id: null })}
                                >
                                  Cancelar
                                </button>
                              </div>
                            ) : (
                              <div className="d-inline-flex gap-2">
                                <button
                                  className="btn btn-sm btn-outline-warning"
                                  onClick={() => handleEditarUsuario(u)}
                                >
                                  Editar
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => setConfirmDelete({ tipo: 'usuario', id: u.id })}
                                >
                                  Eliminar
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Detalle de Pedido */}
      {pedidoSeleccionado && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content bg-dark text-white border border-secondary">
              <div className="modal-header border-secondary">
                <h5 className="modal-title fw-bold">Detalles de la Orden #{pedidoSeleccionado.id}</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setPedidoSeleccionado(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row mb-3 p-3 bg-secondary bg-opacity-10 rounded small">
                  <div className="col-md-6">
                    <p className="mb-1"><strong>Cliente:</strong> {pedidoSeleccionado.persona?.nombre || 'Cliente'}</p>
                    <p className="mb-1"><strong>Email:</strong> {pedidoSeleccionado.persona?.email || 'N/A'}</p>
                    <p className="mb-1"><strong>Teléfono:</strong> {pedidoSeleccionado.telefono || 'No registrado'}</p>
                    {pedidoSeleccionado.persona?.rut && (
                      <p className="mb-0"><strong>RUT:</strong> {pedidoSeleccionado.persona.rut}</p>
                    )}
                  </div>
                  <div className="col-md-6">
                    <p className="mb-1"><strong>Fecha:</strong> {formatearFecha(pedidoSeleccionado.fecha)}</p>
                    <p className="mb-1"><strong>Método de Envío:</strong> {pedidoSeleccionado.metodoEnvio || 'No especificado'}</p>
                    <p className="mb-1"><strong>Dirección:</strong> {pedidoSeleccionado.direccion || 'Retiro en tienda'}</p>
                    <p className="mb-0">
                      <strong>Estado:</strong>{' '}
                      <span className={`badge ${BADGE_ESTADO[pedidoSeleccionado.estado] || 'bg-secondary'}`}>
                        {(pedidoSeleccionado.estado || 'PENDIENTE').replace('_', ' ')}
                      </span>
                    </p>
                  </div>
                </div>

                <h6 className="fw-bold mb-2">Líneas de Productos:</h6>
                <div className="table-responsive">
                  <table className="table table-dark table-striped align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Precio Unitario</th>
                        <th className="text-center">Cantidad</th>
                        <th className="text-end">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(pedidoSeleccionado.detalles || []).map((det, idx) => {
                        const precio = Number(det.precioUnitario || det.producto?.precio || 0);
                        const cant = Number(det.cantidad || 0);
                        const sub = Number(det.subtotal || precio * cant);
                        const prodId = det.producto?.id || det.productoId;
                        const prodNombre = det.producto?.nombre || `Producto #${prodId || idx + 1}`;

                        return (
                          <tr key={det.id || idx}>
                            <td>
                              <span className="fw-semibold">{prodNombre}</span>
                              {prodId && <small className="text-secondary ms-2">(#{prodId})</small>}
                            </td>
                            <td>${precio.toLocaleString('es-CL')}</td>
                            <td className="text-center">{cant}</td>
                            <td className="text-end fw-bold">${sub.toLocaleString('es-CL')}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top border-secondary">
                  <span className="fw-bold fs-5">Monto Total:</span>
                  <span className="fs-4 fw-bold text-success">
                    ${Number(pedidoSeleccionado.total || 0).toLocaleString('es-CL')}
                  </span>
                </div>
              </div>
              <div className="modal-footer border-secondary">
                <button type="button" className="btn btn-secondary" onClick={() => setPedidoSeleccionado(null)}>
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