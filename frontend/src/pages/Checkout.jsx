import React, { useState } from 'react';

export const Checkout = ({ cartItems, onCompleteOrder, onFailOrder, onBackToCart }) => {
  const [formData, setFormData] = useState({ 
    nombre: '', 
    email: '', 
    telefono: '',
    direccion: '',
    metodoEnvio: 'estandar'
  });

  const [errors, setErrors] = useState({});

  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.oferta ? item.precioOferta : item.precio;
    return acc + price * item.cantidad;
  }, 0);

  const costoEnvio = formData.metodoEnvio === 'expres' ? 5990 : 2990;
  const total = subtotal + costoEnvio;

  // Función de validación de campos
  const validateForm = () => {
    const newErrors = {};

    // 1. Validar nombre (no vacío y al menos 3 caracteres)
    if (!formData.nombre.trim() || formData.nombre.trim().length < 3) {
      newErrors.nombre = 'Ingresa tu nombre completo (mínimo 3 caracteres).';
    }

    // 2. Validar email con expresión regular
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Ingresa un correo electrónico válido (ej. usuario@dominio.com).';
    }

    // 3. Validar teléfono (número chileno de 9 dígitos)
    const phoneRegex = /^[0-9]{9}$/;
    if (!phoneRegex.test(formData.telefono.trim())) {
      newErrors.telefono = 'Ingresa un número válido de 9 dígitos (ej. 912345678).';
    }

    // 4. Validar dirección (no vacía y mínima longitud)
    if (!formData.direccion.trim() || formData.direccion.trim().length < 5) {
      newErrors.direccion = 'Ingresa una dirección completa (calle, número, comuna).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e, simularExito = true) => {
    e.preventDefault();
    
    // Si la validación falla, cancelamos el envío
    if (!validateForm()) {
      return;
    }

    if (simularExito) {
      onCompleteOrder({ 
        cliente: {
          ...formData,
          nombre: formData.nombre.trim(),
          email: formData.email.trim(),
          direccion: formData.direccion.trim()
        }, 
        total, 
        envio: formData.metodoEnvio,
        costoEnvio,
        productos: cartItems 
      });
    } else {
      onFailOrder();
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <h2 className="mb-4">Finalizar Compra</h2>
        <form className="card p-4 shadow-sm" noValidate>
          <h5 className="mb-3">1. Datos del Cliente</h5>
          
          {/* Campo Nombre */}
          <div className="mb-3">
            <label className="form-label">Nombre Completo</label>
            <input
              type="text"
              className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
              placeholder="Ej: Juan Pérez"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            />
            {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
          </div>

          {/* Campo Email */}
          <div className="mb-3">
            <label className="form-label">Correo Electrónico</label>
            <input
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              placeholder="ejemplo@correo.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>

          {/* Campo Teléfono */}
          <div className="mb-3">
            <label className="form-label">Teléfono de Contacto</label>
            <input
              type="tel"
              className={`form-control ${errors.telefono ? 'is-invalid' : ''}`}
              placeholder="912345678"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
            />
            {errors.telefono && <div className="invalid-feedback">{errors.telefono}</div>}
          </div>

          {/* Campo Dirección */}
          <div className="mb-3">
            <label className="form-label">Dirección de Envío</label>
            <input
              type="text"
              className={`form-control ${errors.direccion ? 'is-invalid' : ''}`}
              placeholder="Av. Providencia 1234, Depto 502, Santiago"
              value={formData.direccion}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
            />
            {errors.direccion && <div className="invalid-feedback">{errors.direccion}</div>}
          </div>

          <h5 className="mb-3 mt-3">2. Opciones de Entrega</h5>
          <div className="form-check mb-2">
            <input
              className="form-check-input"
              type="radio"
              name="metodoEnvio"
              id="envioEstandar"
              value="estandar"
              checked={formData.metodoEnvio === 'estandar'}
              onChange={(e) => setFormData({ ...formData, metodoEnvio: e.target.value })}
            />
            <label className="form-check-label d-flex justify-content-between" htmlFor="envioEstandar">
              <span>Envío Estándar (3 a 5 días hábiles)</span>
              <strong>$2.990</strong>
            </label>
          </div>
          <div className="form-check mb-4">
            <input
              className="form-check-input"
              type="radio"
              name="metodoEnvio"
              id="envioExpres"
              value="expres"
              checked={formData.metodoEnvio === 'expres'}
              onChange={(e) => setFormData({ ...formData, metodoEnvio: e.target.value })}
            />
            <label className="form-check-label d-flex justify-content-between" htmlFor="envioExpres">
              <span>Envío Exprés (24 a 48 horas)</span>
              <strong>$5.990</strong>
            </label>
          </div>

          <div className="border-top pt-3 mb-4">
            <div className="d-flex justify-content-between">
              <span>Subtotal:</span>
              <span>${subtotal.toLocaleString('es-CL')}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>Envío:</span>
              <span>${costoEnvio.toLocaleString('es-CL')}</span>
            </div>
            <div className="d-flex justify-content-between fs-4 fw-bold mt-2">
              <span>Total a Pagar:</span>
              <span className="text-success">${total.toLocaleString('es-CL')}</span>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <button type="button" className="btn btn-outline-secondary" onClick={onBackToCart}>
              Volver al Carrito
            </button>
            <div className="d-flex gap-2">
              <button 
                type="button" 
                className="btn btn-outline-danger" 
                onClick={(e) => handleSubmit(e, false)}
              >
                Simular Error
              </button>
              <button 
                type="button" 
                className="btn btn-success" 
                onClick={(e) => handleSubmit(e, true)}
              >
                Pagar ${total.toLocaleString('es-CL')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};