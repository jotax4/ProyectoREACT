import React from 'react';

export const Cart = ({ 
  cartItems, 
  onRemoveFromCart, 
  onUpdateQuantity, // 🟢 Prop agregada para cambiar la cantidad
  onProceedToCheckout, 
  onGoHome 
}) => {
  const total = cartItems.reduce((acc, item) => {
    const price = item.oferta ? item.precioOferta : item.precio;
    return acc + price * item.cantidad;
  }, 0);

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-5">
        <h2>Tu carrito está vacío 🛒</h2>
        <p className="text-muted">Añade algunos productos para comenzar a comprar.</p>
        <button className="btn btn-primary mt-3" onClick={onGoHome}>
          Ver Productos
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">Carrito de Compras</h2>
      <div className="table-responsive">
        <table className="table align-middle">
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
                  
                  {/* 🟢 Columna Cantidad con botones + y - */}
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => onUpdateQuantity(item.id, item.cantidad - 1)}
                        disabled={item.cantidad <= 1}
                      >
                        -
                      </button>
                      <span className="fw-bold px-2">{item.cantidad}</span>
                      <button
                        className="btn btn-outline-secondary btn-sm"
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

      <div className="d-flex justify-content-between align-items-center mt-4 p-3 bg-light rounded">
        <h4>Total: ${total.toLocaleString('es-CL')}</h4>
        <button className="btn btn-success btn-lg" onClick={onProceedToCheckout}>
          Ir a Pagar
        </button>
      </div>
    </div>
  );
};