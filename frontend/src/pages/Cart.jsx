import React from 'react';
import { useNavigate } from 'react-router-dom';

export function Cart({ cartItems = [], onRemoveFromCart, onUpdateQuantity }) {
  const navigate = useNavigate();

  const total = cartItems.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  return (
    <div className="container py-5 text-white" style={{ maxWidth: '900px' }}>
      <h2 className="mb-4 fw-bold">Carrito de Compras</h2>

      {cartItems.length === 0 ? (
        <div className="alert alert-info text-center">
          Tu carrito está vacío. <button className="btn btn-link p-0 text-info" onClick={() => navigate('/')}>Ir a la tienda</button>
        </div>
      ) : (
        <>
          <div className="table-responsive bg-dark p-3 rounded mb-4 shadow">
            <table className="table table-dark align-middle mb-0">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th className="text-center">Cantidad</th>
                  <th>Subtotal</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => {
                  // Captura la imagen sea cual sea la propiedad recibida
                  const imgSrc = item.imagenUrl || item.imagen || item.image || item.foto;

                  return (
                    <tr key={item.id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          {imgSrc && (
                            <img
                              src={imgSrc}
                              alt={item.nombre}
                              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                              className="rounded"
                            />
                          )}
                          <span>{item.nombre}</span>
                        </div>
                      </td>
                      <td>${item.precio?.toLocaleString('es-CL')}</td>
                      <td className="text-center">
                        <div className="d-inline-flex align-items-center border border-secondary rounded px-1">
                          <button
                            className="btn btn-sm btn-dark text-white border-0 px-2"
                            onClick={() => onUpdateQuantity(item.id, item.cantidad - 1)}
                          >
                            -
                          </button>
                          <span className="px-2 fw-bold">{item.cantidad}</span>
                          <button
                            className="btn btn-sm btn-dark text-white border-0 px-2"
                            onClick={() => onUpdateQuantity(item.id, item.cantidad + 1)}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td>${(item.precio * item.cantidad).toLocaleString('es-CL')}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => onRemoveFromCart(item.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="bg-dark p-3 rounded d-flex justify-content-between align-items-center shadow border border-secondary">
            <h4 className="m-0 fw-bold">Total: ${total.toLocaleString('es-CL')}</h4>
            <button
              className="btn btn-success px-4 py-2 fw-bold"
              onClick={() => navigate('/checkout')}
            >
              Ir a Pagar
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;