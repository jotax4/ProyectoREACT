// frontend/src/pages/Auth.jsx
import React, { useState } from 'react';
import { authService } from '../services/authService';

export const Auth = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
    fechaNacimiento: '' // Campo agregado para la fecha de nacimiento
  });

  const [errors, setErrors] = useState({});
  const [serverMsg, setServerMsg] = useState('');

  // Función para validar la mayoría de edad (mínimo 18 años)
  const esMayorDeEdad = (fechaNac) => {
    if (!fechaNac) return false;
    const hoy = new Date();
    const nacimiento = new Date(fechaNac);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }

    return edad >= 18;
  };

  // Validaciones con Regex y reglas de negocio
  const validateField = (name, value) => {
    let errorMsg = '';

    if (name === 'email') {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!value.trim()) {
        errorMsg = 'El correo electrónico es obligatorio.';
      } else if (!emailRegex.test(value)) {
        errorMsg = 'Ingrese un correo electrónico válido (ejemplo: usuario@dominio.com).';
      }
    }

    if (name === 'password') {
      if (!value) {
        errorMsg = 'La contraseña es obligatoria.';
      } else if (value.length < 6) {
        errorMsg = 'La contraseña debe tener al menos 6 caracteres.';
      }
    }

    if (name === 'nombre' && !isLogin) {
      if (!value.trim()) {
        errorMsg = 'El nombre completo es obligatorio.';
      } else if (value.trim().length < 3) {
        errorMsg = 'El nombre debe tener al menos 3 caracteres.';
      }
    }

    if (name === 'fechaNacimiento' && !isLogin) {
      if (!value) {
        errorMsg = 'La fecha de nacimiento es obligatoria.';
      } else if (!esMayorDeEdad(value)) {
        errorMsg = 'Debes ser mayor de 18 años para crear una cuenta.';
      }
    }

    if (name === 'confirmPassword' && !isLogin) {
      if (value !== formData.password) {
        errorMsg = 'Las contraseñas no coinciden.';
      }
    }

    return errorMsg;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validar en tiempo real al escribir
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerMsg('');

    // Validar todo el formulario antes de enviar
    const currentErrors = {};
    if (!isLogin) {
      currentErrors.nombre = validateField('nombre', formData.nombre);
      currentErrors.fechaNacimiento = validateField('fechaNacimiento', formData.fechaNacimiento);
      currentErrors.confirmPassword = validateField('confirmPassword', formData.confirmPassword);
    }
    currentErrors.email = validateField('email', formData.email);
    currentErrors.password = validateField('password', formData.password);

    setErrors(currentErrors);

    // Verificar si existen errores de validación
    const hasErrors = Object.values(currentErrors).some((err) => err !== '');
    if (hasErrors) return;

    if (isLogin) {
      // Proceso de Login
      const result = await authService.login({
        email: formData.email,
        password: formData.password
      });

      if (result.ok) {
        setServerMsg('¡Inicio de sesión exitoso!');
        if (onLoginSuccess) onLoginSuccess(result.data.user);
      } else {
        setServerMsg(result.data.error || 'Credenciales inválidas.');
      }
    } else {
      // Proceso de Registro
      const result = await authService.register({
        nombre: formData.nombre,
        email: formData.email,
        password: formData.password,
        fechaNacimiento: formData.fechaNacimiento
      });

      if (result.ok) {
        setServerMsg('¡Cuenta creada con éxito! Ahora puedes iniciar sesión.');
        setIsLogin(true);
      } else {
        setServerMsg(result.data.error || 'Error al registrar usuario.');
      }
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</h2>

      {serverMsg && (
        <div style={{ padding: '10px', marginBottom: '15px', backgroundColor: '#e2e3e5', borderRadius: '4px' }}>
          {serverMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {!isLogin && (
          <div style={{ marginBottom: '15px' }}>
            <label>Nombre Completo:</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
            {errors.nombre && <span style={{ color: 'red', fontSize: '12px' }}>{errors.nombre}</span>}
          </div>
        )}

        {!isLogin && (
          <div style={{ marginBottom: '15px' }}>
            <label>Fecha de Nacimiento:</label>
            <input
              type="date"
              name="fechaNacimiento"
              value={formData.fechaNacimiento}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
            {errors.fechaNacimiento && (
              <span style={{ color: 'red', fontSize: '12px' }}>{errors.fechaNacimiento}</span>
            )}
          </div>
        )}

        <div style={{ marginBottom: '15px' }}>
          <label>Correo Electrónico:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
          {errors.email && <span style={{ color: 'red', fontSize: '12px' }}>{errors.email}</span>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Contraseña:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
          {errors.password && <span style={{ color: 'red', fontSize: '12px' }}>{errors.password}</span>}
        </div>

        {!isLogin && (
          <div style={{ marginBottom: '15px' }}>
            <label>Confirmar Contraseña:</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
            {errors.confirmPassword && (
              <span style={{ color: 'red', fontSize: '12px' }}>{errors.confirmPassword}</span>
            )}
          </div>
        )}

        <button
          type="submit"
          style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          {isLogin ? 'Ingresar' : 'Registrarse'}
        </button>
      </form>

      <p style={{ marginTop: '15px', textAlign: 'center' }}>
        {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
        <button
          type="button"
          onClick={() => {
            setIsLogin(!isLogin);
            setErrors({});
            setServerMsg('');
          }}
          style={{ background: 'none', border: 'none', color: '#007bff', textDecoration: 'underline', cursor: 'pointer' }}
        >
          {isLogin ? 'Crea una aquí' : 'Inicia sesión'}
        </button>
      </p>
    </div>
  );
};

export default Auth;