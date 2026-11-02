import React from 'react';

export const PaymentSuccess = ({ order, onGoHome }) => {
  return (
    <div className="text-center py-5 text-white">
      <div className="card bg-dark text-white border-secondary p-5 shadow-lg mx-auto" style={{ maxWidth: '600px' }}>
        <h1 className="text-success mb-3">¡Pago Exitoso! 🎉</h1>
        <p className="fs-5 text-light">Gracias por tu compra. Tu orden ha sido procesada correctamente.</p>
        
        {order && (
          <div className="alert alert-success mt-3 text-start text-dark">
            <p className="mb-1"><strong>Número de Orden:</strong> #{order.id}</p>
            <p className="mb-1"><strong>Fecha:</strong> {order.fecha}</p>
            <p className="mb-0"><strong>Total Pagado:</strong> ${order.total?.toLocaleString('es-CL')}</p>
          </div>
        )}

        <button className="btn btn-primary mt-4 py-2 fw-bold" onClick={onGoHome}>
          Volver a la Tienda
        </button>
      </div>
    </div>
  );
};