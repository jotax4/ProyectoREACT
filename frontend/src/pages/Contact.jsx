// frontend/src/pages/Contact.jsx
import React, { useState } from 'react';

export const Contact = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    asunto: '',
    mensaje: ''
  });
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Aquí iría la llamada a tu API o servicio para enviar el correo
    console.log('Datos del formulario de contacto:', formData);
    
    // Mostramos mensaje de éxito y limpiamos el formulario
    setEnviado(true);
    setFormData({ nombre: '', correo: '', asunto: '', mensaje: '' });
    
    // Ocultar la alerta después de 4 segundos
    setTimeout(() => setEnviado(false), 4000);
  };

  return (
    <div className="container py-4 text-light">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <h2 className="mb-4 text-center fw-bold">Contáctanos</h2>
          <p className="text-center mb-4 text-secondary">
            ¿Tienes alguna duda o problema? Escríbenos y te responderemos lo antes posible.
          </p>
          
          {enviado && (
            <div className="alert alert-success text-center border-0 fw-bold" role="alert">
              ¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-dark p-4 p-md-5 rounded shadow border border-secondary">
            <div className="mb-3">
              <label htmlFor="nombre" className="form-label fw-semibold">Nombre</label>
              <input 
                type="text" 
                className="form-control bg-secondary text-light border-0" 
                id="nombre" 
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Tu nombre completo"
                required 
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="correo" className="form-label fw-semibold">Correo Electrónico</label>
              <input 
                type="email" 
                className="form-control bg-secondary text-light border-0" 
                id="correo" 
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                placeholder="ejemplo@correo.com"
                required 
              />
            </div>

            <div className="mb-3">
              <label htmlFor="asunto" className="form-label fw-semibold">Asunto</label>
              <input 
                type="text" 
                className="form-control bg-secondary text-light border-0" 
                id="asunto" 
                name="asunto"
                value={formData.asunto}
                onChange={handleChange}
                placeholder="¿En qué te podemos ayudar?"
                required 
              />
            </div>

            <div className="mb-4">
              <label htmlFor="mensaje" className="form-label fw-semibold">Mensaje</label>
              <textarea 
                className="form-control bg-secondary text-light border-0" 
                id="mensaje" 
                name="mensaje"
                rows="5"
                value={formData.mensaje}
                onChange={handleChange}
                placeholder="Escribe tu mensaje aquí..."
                required 
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary w-100 fw-bold py-2">
              Enviar Mensaje
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};