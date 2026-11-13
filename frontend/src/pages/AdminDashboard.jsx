import React, { useState, useEffect } from 'react';
import { orderService } from '../services/orderService';

const ESTADOS_PEDIDO = [
  'PENDIENTE',
  'EN_PREPARACION',
  'ENVIADO',
  'ENTREGADO',
  'CANCELADO',
];

const BADGE_ESTADO = {
  PENDIENTE: 'bg-warning text-dark',
  EN_PREPARACION: 'bg-info text-dark',
  ENVIADO: 'bg-primary',
  ENTREGADO: 'bg-success',
  CANCELADO: 'bg-danger',
};

export default function AdminDashboard() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [actualizandoId, setActualizandoId] = useState(null);

  const cargarPedidos = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await orderService.getOrders();
      setPedidos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
      setErrorMsg(
        error.message?.includes('403')
          ? 'Acceso denegado (403): verifica que tu usuario tenga rol ADMIN y vuelve a iniciar sesión.'
          : 'No se pudieron cargar los pedidos desde el servidor.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPedidos();
  }, []);

  const handleCambiarEstado = async (pedidoId, nuevoEstado) => {
    setActualizandoId(pedidoId);
    try {
      const pedidoActualizado = await orderService.updateOrderStatus(pedidoId, nuevoEstado);
      setPedidos((prev) =>
        prev.map((p) => (p.id === pedidoId ? { ...p, estado: pedidoActualizado.estado || nuevoEstado } : p))
      );
      if (pedidoSeleccionado?.id === pedidoId) {
        setPedidoSeleccionado((prev) => ({
          ...prev,
          estado: pedidoActualizado.estado || nuevoEstado,
        }));
      }
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      alert('No se pudo actualizar el estado del pedido.');
    } finally {
      setActualizandoId(null);
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold m-0">Panel de Administración</h2>
          <small className="text-secondary">Gestión de Pedidos y Ventas Maestro-Detalle</small>
        </div>
        <button className="btn btn-outline-light btn-sm px-3" onClick={cargarPedidos}>
          🔄 Actualizar Lista
        </button>
      </div>

      {/* Tarjetas de Métricas */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="bg-dark p-3 rounded border border-secondary shadow">
            <span className="text-secondary small d-block">Ventas Totales</span>
            <h3 className="fw-bold text-success m-0">${totalVentas.toLocaleString('es-CL')}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="bg-dark p-3 rounded border border-secondary shadow">
            <span className="text-secondary small d-block">Órdenes Procesadas</span>
            <h3 className="fw-bold text-info m-0">{totalPedidos}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="bg-dark p-3 rounded border border-secondary shadow">
            <span className="text-secondary small d-block">Ticket Promedio</span>
            <h3 className="fw-bold text-warning m-0">${Math.round(ticketPromedio).toLocaleString('es-CL')}</h3>
          </div>
        </div>
      </div>

      {errorMsg && <div className="alert alert-danger text-center">{errorMsg}</div>}

      {/* Tabla Maestro de Pedidos */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-secondary">Obteniendo datos desde el backend...</p>
        </div>
      ) : pedidos.length === 0 && !errorMsg ? (
        <div className="alert alert-info text-center">No hay pedidos registrados en la base de datos.</div>
      ) : (
        pedidos.length > 0 && (
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
                  const telefonoCliente = pedido.telefono || 'Sin teléfono';
                  const metodoEnvio = pedido.metodoEnvio || 'No especificado';
                  const estadoActual = pedido.estado || 'PENDIENTE';

                  return (
                    <tr key={pedido.id}>
                      <td>
                        <span className="badge bg-primary fs-6">#{pedido.id}</span>
                      </td>
                      <td>
                        <small>{formatearFecha(pedido.fecha)}</small>
                      </td>
                      <td>
                        <div className="fw-bold">{nombreCliente}</div>
                        <small className="text-secondary">{emailCliente}</small>
                      </td>
                      <td>
                        <small>{telefonoCliente}</small>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            metodoEnvio.toLowerCase().includes('retiro')
                              ? 'bg-secondary'
                              : 'bg-info text-dark'
                          }`}
                        >
                          {metodoEnvio}
                        </span>
                      </td>
                      <td>
                        <select
                          className={`form-select form-select-sm fw-semibold border-0 ${
                            BADGE_ESTADO[estadoActual] || 'bg-secondary text-white'
                          }`}
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
                      <td className="fw-bold text-success">
                        ${Number(pedido.total || 0).toLocaleString('es-CL')}
                      </td>
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
        )
      )}

      {/* Modal para inspeccionar el despacho y los productos */}
      {pedidoSeleccionado && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content bg-dark text-white border border-secondary">
              <div className="modal-header border-secondary">
                <h5 className="modal-title fw-bold">
                  Detalles de la Orden #{pedidoSeleccionado.id}
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
                      <strong>Cliente:</strong> {pedidoSeleccionado.persona?.nombre || 'Cliente'}
                    </p>
                    <p className="mb-1">
                      <strong>Email:</strong> {pedidoSeleccionado.persona?.email || 'N/A'}
                    </p>
                    <p className="mb-1">
                      <strong>Teléfono:</strong> {pedidoSeleccionado.telefono || 'No registrado'}
                    </p>
                    {pedidoSeleccionado.persona?.rut && (
                      <p className="mb-0">
                        <strong>RUT:</strong> {pedidoSeleccionado.persona.rut}
                      </p>
                    )}
                  </div>
                  <div className="col-md-6">
                    <p className="mb-1">
                      <strong>Fecha:</strong> {formatearFecha(pedidoSeleccionado.fecha)}
                    </p>
                    <p className="mb-1">
                      <strong>Método de Envío:</strong> {pedidoSeleccionado.metodoEnvio || 'No especificado'}
                    </p>
                    <p className="mb-1">
                      <strong>Dirección:</strong> {pedidoSeleccionado.direccion || 'Retiro en tienda / Sin dirección'}
                    </p>
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