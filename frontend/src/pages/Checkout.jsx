import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Checkout({ cartItems = [], user, onCompleteOrder }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    email: user?.email || '',
    direccion: '',
    telefono: '',
    envio: 'Despacho a domicilio'
  });

  // Sincroniza datos si el usuario carga de forma asíncrona
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        nombre: prev.nombre || user.nombre || '',
        email: prev.email || user.email || ''
      }));
    }
  }, [user]);

  // Total acumulado seguro
  const totalCompra = cartItems.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert('El carrito está vacío.');
      return;
    }

    // Estrcutura ajustada a las propiedades que lee PedidoService.java
    const orderData = {
      nombre: formData.nombre,
      email: formData.email,
      direccion: formData.direccion,
      telefono: formData.telefono,
      cliente: {
        nombre: formData.nombre,
        email: formData.email,
        direccion: formData.direccion,
        telefono: formData.telefono
      },
      envio: formData.envio,
      total: totalCompra,
      // 'detalles' mapea directamente con pedido.getDetalles() en Java
      detalles: cartItems.map(item => ({
        id: item.id || item.id_producto,
        cantidad: item.cantidad,
        precioUnitario: item.precio, // Coincide con detalle.getPrecioUnitario()
        subtotal: item.precio * item.cantidad
      }))
    };

    try {
      await onCompleteOrder(orderData);
      alert('¡Compra procesada con éxito!');
      navigate('/payment-success');
    } catch (error) {
      console.error('Error al procesar el pedido:', error);
      alert('Ocurrió un error al procesar la compra.');
    }
  };

  return (
    <div className="container py-5 text-white" style={{ maxWidth: '600px' }}>
      <h2 className="mb-4 fw-bold">Finalizar Compra</h2>

      <form onSubmit={handleSubmit} className="bg-dark p-4 rounded shadow border border-secondary">
        <div className="mb-3">
          <label className="form-label">Nombre Completo</label>
          <input
            type="text"
            name="nombre"
            className="form-control bg-secondary text-white border-0"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Correo Electrónico</label>
          <input
            type="email"
            name="email"
            className="form-control bg-secondary text-white border-0"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Dirección de Entrega</label>
          <input
            type="text"
            name="direccion"
            className="form-control bg-secondary text-white border-0"
            value={formData.direccion}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Teléfono</label>
          <input
            type="text"
            name="telefono"
            className="form-control bg-secondary text-white border-0"
            value={formData.telefono}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="form-label">Método de Envío</label>
          <select
            name="envio"
            className="form-select bg-secondary text-white border-0"
            value={formData.envio}
            onChange={handleChange}
          >
            <option value="Despacho a domicilio">Despacho a domicilio</option>
            <option value="Retiro en tienda">Retiro en tienda</option>
          </select>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary w-100 py-2 fw-bold"
          disabled={cartItems.length === 0}
        >
          Confirmar y Pagar (${totalCompra.toLocaleString('es-CL')})
        </button>
      </form>
    </div>
  );
}