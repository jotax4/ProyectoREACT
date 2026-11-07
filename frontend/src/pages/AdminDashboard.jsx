import React, { useState, useEffect } from 'react';
import { orderService } from '../services/orderService';

export default function AdminDashboard() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

  const cargarPedidos = async () => {
    setLoading(true);
    try {
      const data = await orderService.getOrders();
      setPedidos(data || []);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPedidos();
  }, []);

  // Cálculo de métricas
  const totalVentas = pedidos.reduce((acc, p) => acc + (p.total || 0), 0);
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

      {/* Tabla Maestro de Pedidos */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-secondary">Obteniendo datos desde el backend...</p>
        </div>
      ) : pedidos.length === 0 ? (
        <div className="alert alert-info text-center">No hay pedidos registrados en la base de datos.</div>
      ) : (
        <div className="table-responsive bg-dark p-3 rounded border border-secondary shadow">
          <table className="table table-dark table-hover align-middle mb-0">
            <thead>
              <tr>
                <th># Orden</th>
                <th>Cliente</th>
                <th>Contacto</th>
                <th>Método Envío</th>
                <th>Total</th>
                <th className="text-center">Acción</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => {
                const nombreCliente = pedido.nombre || pedido.cliente?.nombre || 'Cliente';
                const emailCliente = pedido.email || pedido.cliente?.email || 'N/A';
                const fonoCliente = pedido.telefono || pedido.cliente?.telefono || 'N/A';

                return (
                  <tr key={pedido.id}>
                    <td>
                      <span className="badge bg-primary fs-6">#{pedido.id}</span>
                    </td>
                    <td>
                      <div className="fw-bold">{nombreCliente}</div>
                      <small className="text-secondary">{emailCliente}</small>
                    </td>
                    <td><small>{fonoCliente}</small></td>
                    <td>
                      <span className={`badge ${pedido.envio === 'Retiro en tienda' ? 'bg-secondary' : 'bg-success'}`}>
                        {pedido.envio || 'Despacho'}
                      </span>
                    </td>
                    <td className="fw-bold text-success">
                      ${pedido.total?.toLocaleString('es-CL')}
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
      )}

      {/* Modal para inspeccionar las líneas del detalle (DetalleProducto) */}
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
                <div className="row mb-3 p-2 bg-secondary bg-opacity-20 rounded small">
                  <div className="col-md-6">
                    <p className="mb-1"><strong>Cliente:</strong> {pedidoSeleccionado.nombre || pedidoSeleccionado.cliente?.nombre}</p>
                    <p className="mb-1"><strong>Email:</strong> {pedidoSeleccionado.email || pedidoSeleccionado.cliente?.email}</p>
                    <p className="mb-1"><strong>Teléfono:</strong> {pedidoSeleccionado.telefono || pedidoSeleccionado.cliente?.telefono}</p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-1"><strong>Dirección:</strong> {pedidoSeleccionado.direccion || pedidoSeleccionado.cliente?.direccion}</p>
                    <p className="mb-1"><strong>Método de Envío:</strong> {pedidoSeleccionado.envio}</p>
                  </div>
                </div>

                <h6 className="fw-bold mb-2">Líneas de Productos (DetalleProducto):</h6>
                <div className="table-responsive">
                  <table className="table table-dark table-striped align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Producto ID</th>
                        <th>Precio Unitario</th>
                        <th className="text-center">Cantidad</th>
                        <th className="text-end">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(pedidoSeleccionado.detalles || pedidoSeleccionado.items || []).map((det, idx) => {
                        const precio = det.precioUnitario || det.precio || 0;
                        const cant = det.cantidad || 0;
                        const sub = det.subtotal || (precio * cant);

                        return (
                          <tr key={det.id || idx}>
                            <td>#{det.productoId || det.id || idx + 1}</td>
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
                    ${pedidoSeleccionado.total?.toLocaleString('es-CL')}
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