import React from 'react';

export const PaymentFailure = ({ onRetry, onGoHome }) => {
  return (
    <div className="text-center py-5">
      <div className="card p-5 shadow-sm mx-auto" style={{ maxWidth: '600px' }}>
        <h1 className="text-danger mb-3">¡Error en el Pago! ❌</h1>
        <p className="fs-5">Hubo un problema al procesar tu solicitud o la transacción fue cancelada.</p>
        
        <div className="alert alert-danger mt-3 text-start">
          <p className="mb-0">Por favor, verifica tus datos de pago e inténtalo de nuevo.</p>
        </div>

        <div className="d-flex justify-content-center gap-3 mt-4">
          <button className="btn btn-outline-secondary" onClick={onGoHome}>
            Volver a la Tienda
          </button>
          <button className="btn btn-danger" onClick={onRetry}>
            Reintentar Pago
          </button>
        </div>
      </div>
    </div>
  );
};