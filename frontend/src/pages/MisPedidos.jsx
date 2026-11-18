import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../services/orderService';

const BADGE_ESTADO = {
  PENDIENTE: 'bg-warning text-dark',
  EN_PREPARACION: 'bg-info text-dark',
  ENVIADO: 'bg-primary',
  ENTREGADO: 'bg-success',
  CANCELADO: 'bg-danger',
};

export function MisPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

  const cargarMisPedidos = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await orderService.getMyOrders();
      setPedidos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar historial de pedidos:', error);
      setErrorMsg('No se pudo obtener tu historial de pedidos desde el servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarMisPedidos();
  }, []);

  const formatearFecha = (fechaIso) => {
    if (!fechaIso) return 'Sin fecha';
    return new Date(fechaIso).toLocaleString('es-CL', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const totalInvertido = pedidos
    .filter((p) => p.estado !== 'CANCELADO')
    .reduce((acc, p) => acc + (Number(p.total) || 0), 0);

  const pedidosActivos = pedidos.filter(
    (p) => p.estado === 'PENDIENTE' || p.estado === 'EN_PREPARACION' || p.estado === 'ENVIADO'
  ).length;

  return (
    <div className="container py-5 text-white">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold m-0">🛍️ Mis Pedidos</h2>
          <small className="text-secondary">
            Historial de compras y seguimiento en tiempo real
          </small>
        </div>
        <button className="btn btn-outline-light btn-sm px-3" onClick={cargarMisPedidos}>
          🔄 Actualizar Estado
        </button>
      </div>

      {/* Resumen del Cliente */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="bg-dark p-3 rounded border border-secondary shadow">
            <span className="text-secondary small d-block">Compras Realizadas</span>
            <h3 className="fw-bold text-info m-0">{pedidos.length}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="bg-dark p-3 rounded border border-secondary shadow">
            <span className="text-secondary small d-block">Pedidos en Curso</span>
            <h3 className="fw-bold text-warning m-0">{pedidosActivos}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="bg-dark p-3 rounded border border-secondary shadow">
            <span className="text-secondary small d-block">Total Comprado</span>
            <h3 className="fw-bold text-success m-0">
              ${totalInvertido.toLocaleString('es-CL')}
            </h3>
          </div>
        </div>
      </div>

      {errorMsg && <div className="alert alert-danger text-center">{errorMsg}</div>}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-secondary">Consultando tus órdenes en la base de datos...</p>
        </div>
      ) : pedidos.length === 0 && !errorMsg ? (
        <div className="bg-dark p-5 rounded border border-secondary text-center">
          <h5 className="fw-bold mb-2">Aún no tienes pedidos registrados</h5>
          <p className="text-secondary mb-4">
            Explora el catálogo y realiza tu primera compra para ver su seguimiento aquí.
          </p>
          <Link to="/" className="btn btn-primary px-4 fw-bold">
            Ir a la Tienda
          </Link>
        </div>
      ) : (
        <div className="table-responsive bg-dark p-3 rounded border border-secondary shadow">
          <table className="table table-dark table-hover align-middle mb-0">
            <thead>
              <tr>
                <th># Orden</th>
                <th>Fecha</th>
                <th>Entrega</th>
                <th>Estado</th>
                <th>Total</th>
                <th className="text-center">Detalle</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => {
                const estadoActual = pedido.estado || 'PENDIENTE';
                const metodoEnvio = pedido.metodoEnvio || 'Despacho a domicilio';

                return (
                  <tr key={pedido.id}>
                    <td>
                      <span className="badge bg-primary fs-6">#{pedido.id}</span>
                    </td>
                    <td>
                      <small>{formatearFecha(pedido.fecha)}</small>
                    </td>
                    <td>
                      <div className="fw-semibold">{metodoEnvio}</div>
                      {pedido.direccion && (
                        <small className="text-secondary">{pedido.direccion}</small>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${BADGE_ESTADO[estadoActual] || 'bg-secondary'}`}>
                        {estadoActual.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="fw-bold text-success">
                      ${Number(pedido.total || 0).toLocaleString('es-CL')}
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-outline-info"
                        onClick={() => setPedidoSeleccionado(pedido)}
                      >
                        👁️ Ver Productos
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal con el detalle de la compra */}
      {pedidoSeleccionado && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content bg-dark text-white border border-secondary">
              <div className="modal-header border-secondary">
                <h5 className="modal-title fw-bold">
                  Comprobante de Orden #{pedidoSeleccionado.id}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setPedidoSeleccionado(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row mb-3 p-3 bg-secondary bg-opacity-10 rounded small">
                  <div className="col-md-6">
                    <p className="mb-1">
                      <strong>Fecha:</strong> {formatearFecha(pedidoSeleccionado.fecha)}
                    </p>
                    <p className="mb-0">
                      <strong>Teléfono de contacto:</strong> {pedidoSeleccionado.telefono || 'No registrado'}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-1">
                      <strong>Método de Envío:</strong> {pedidoSeleccionado.metodoEnvio || 'No especificado'}
                    </p>
                    <p className="mb-1">
                      <strong>Dirección:</strong> {pedidoSeleccionado.direccion || 'Retiro en tienda'}
                    </p>
                    <p className="mb-0">
                      <strong>Estado:</strong>{' '}
                      <span className={`badge ${BADGE_ESTADO[pedidoSeleccionado.estado] || 'bg-secondary'}`}>
                        {(pedidoSeleccionado.estado || 'PENDIENTE').replace('_', ' ')}
                      </span>
                    </p>
                  </div>
                </div>

                <h6 className="fw-bold mb-2">Productos Comprados:</h6>
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
                        const prodNombre = det.producto?.nombre || `Producto #${idx + 1}`;

                        return (
                          <tr key={det.id || idx}>
                            <td className="fw-semibold">{prodNombre}</td>
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
                  <span className="fw-bold fs-5">Total Pagado:</span>
                  <span className="fs-4 fw-bold text-success">
                    ${Number(pedidoSeleccionado.total || 0).toLocaleString('es-CL')}
                  </span>
                </div>
              </div>
              <div className="modal-footer border-secondary">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setPedidoSeleccionado(null)}
                >
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

export default MisPedidos;