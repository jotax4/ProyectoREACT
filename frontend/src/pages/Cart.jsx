import React from 'react';

export const Cart = ({ 
  cartItems, 
  onRemoveFromCart, 
  onUpdateQuantity, 
  onProceedToCheckout, 
  onGoHome 
}) => {
  const total = cartItems.reduce((acc, item) => {
    const price = item.oferta ? item.precioOferta : item.precio;
    return acc + price * item.cantidad;
  }, 0);

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-5 text-white">
        <h2>Tu carrito está vacío 🛒</h2>
        <p className="text-secondary">Añade algunos productos para comenzar a comprar.</p>
        <button className="btn btn-primary mt-3" onClick={onGoHome}>
          Ver Productos
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4 text-white">
      <h2 className="mb-4">Carrito de Compras</h2>
      
      {/* Contenedor del carrito con fondo oscuro */}
      <div className="card bg-dark border-secondary mb-4">
        <div className="card-body table-responsive">
          
          {/* Se añadió table-dark para forzar el tema oscuro de Bootstrap */}
          <table className="table table-dark table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => {
                const unitPrice = item.oferta ? item.precioOferta : item.precio;
                return (
                  <tr key={item.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          src={item.imagen}
                          alt={item.nombre}
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          className="me-3 rounded"
                        />
                        <span>{item.nombre}</span>
                      </div>
                    </td>
                    <td>${unitPrice.toLocaleString('es-CL')}</td>
                    
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <button
                          className="btn btn-outline-light btn-sm"
                          onClick={() => onUpdateQuantity(item.id, item.cantidad - 1)}
                          disabled={item.cantidad <= 1}
                        >
                          -
                        </button>
                        <span className="fw-bold px-2">{item.cantidad}</span>
                        <button
                          className="btn btn-outline-light btn-sm"
                          onClick={() => onUpdateQuantity(item.id, item.cantidad + 1)}
                        >
                          +
                        </button>
                      </div>
                    </td>

                    <td>${(unitPrice * item.cantidad).toLocaleString('es-CL')}</td>
                    <td>
                      <button
                        className="btn btn-outline-danger btn-sm"
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
      </div>

      {/* Contenedor del Total con fondo oscuro */}
      <div className="d-flex justify-content-between align-items-center mt-2 p-3 bg-dark border border-secondary rounded">
        <h4 className="mb-0 text-white">Total: ${total.toLocaleString('es-CL')}</h4>
        <button className="btn btn-success btn-lg" onClick={onProceedToCheckout}>
          Ir a Pagar
        </button>
      </div>
    </div>
  );
};