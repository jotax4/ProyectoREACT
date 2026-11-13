import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Checkout({ cartItems = [], user, onCompleteOrder }) {
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
  const activeUser = user || storedUser;

  const [formData, setFormData] = useState({
    nombre: activeUser?.nombre || '',
    email: activeUser?.email || '',
    direccion: '',
    telefono: '',
    envio: 'Despacho a domicilio',
  });

  useEffect(() => {
    if (activeUser) {
      setFormData((prev) => ({
        ...prev,
        nombre: prev.nombre || activeUser.nombre || '',
        email: prev.email || activeUser.email || '',
      }));
    }
  }, [user]);

  const totalCompra = cartItems.reduce(
    (acc, item) => acc + Number(item.precio) * Number(item.cantidad),
    0
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert('El carrito está vacío.');
      return;
    }

    const userId = activeUser?.id;

    const orderData = {
      ...(userId ? { persona: { id: Number(userId) } } : {}),
      direccion:
        formData.envio === 'Retiro en tienda' && !formData.direccion.trim()
          ? 'Retiro en tienda'
          : formData.direccion.trim(),
      telefono: formData.telefono.trim(),
      metodoEnvio: formData.envio,
      total: totalCompra,
      detalles: cartItems.map((item) => ({
        producto: {
          id: Number(item.id || item.id_producto),
        },
        cantidad: Number(item.cantidad),
        precioUnitario: Math.round(Number(item.precio)),
        subtotal: Math.round(Number(item.precio) * Number(item.cantidad)),
      })),
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

        <div className="mb-3">
          <label className="form-label">
            Dirección de Entrega {formData.envio === 'Retiro en tienda' && <small className="text-secondary">(Opcional)</small>}
          </label>
          <input
            type="text"
            name="direccion"
            placeholder={
              formData.envio === 'Retiro en tienda'
                ? 'Retiro en sucursal'
                : 'Ej: Av. Pedro Aguirre Cerda 123'
            }
            className="form-control bg-secondary text-white border-0"
            value={formData.direccion}
            onChange={handleChange}
            required={formData.envio === 'Despacho a domicilio'}
          />
        </div>

        <div className="mb-4">
          <label className="form-label">Teléfono</label>
          <input
            type="tel"
            name="telefono"
            placeholder="Ej: +56 9 8765 4321"
            className="form-control bg-secondary text-white border-0"
            value={formData.telefono}
            onChange={handleChange}
            required
          />
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