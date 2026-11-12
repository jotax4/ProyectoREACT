// frontend/src/pages/Auth.jsx
import React, { useState } from 'react';
import { authService } from '../services/authService';

export const Auth = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    nombre: '',
    rut: '', 
    email: '',
    password: '',
    confirmPassword: '',
    fechaNacimiento: ''
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

  // Validaciones de campos
  const validateField = (name, value) => {
    let errorMsg = '';

    if (name === 'rut' && !isLogin) {
      if (!value.trim()) {
        errorMsg = 'El RUT es obligatorio.';
      } else if (value.trim().length < 8) {
        errorMsg = 'Ingrese un RUT válido (ejemplo: 12345678-9).';
      }
    }

    if (name === 'email') {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!value.trim()) {
        errorMsg = 'El correo electrónico es obligatorio.';
      } else if (!emailRegex.test(value)) {
        errorMsg = 'Ingrese un correo electrónico válido.';
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

    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerMsg('');

    const currentErrors = {};
    if (!isLogin) {
      currentErrors.nombre = validateField('nombre', formData.nombre);
      currentErrors.rut = validateField('rut', formData.rut);
      currentErrors.fechaNacimiento = validateField('fechaNacimiento', formData.fechaNacimiento);
      currentErrors.confirmPassword = validateField('confirmPassword', formData.confirmPassword);
    }
    currentErrors.email = validateField('email', formData.email);
    currentErrors.password = validateField('password', formData.password);

    setErrors(currentErrors);

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
        setServerMsg(typeof result.data === 'string' ? result.data : (result.data.error || 'Credenciales inválidas.'));
      }
    } else {
      // Proceso de Registro
      const result = await authService.register({
        nombre: formData.nombre,
        rut: formData.rut,
        email: formData.email,
        password: formData.password,
        fechaNacimiento: formData.fechaNacimiento
      });

      if (result.ok) {
        setServerMsg('¡Cuenta creada con éxito! Ahora puedes iniciar sesión.');
        setIsLogin(true);
      } else {
        setServerMsg(typeof result.data === 'string' ? result.data : (result.data.error || 'Error al registrar usuario.'));
      }
    }
  };

  return (
    <div className="d-flex justify-content-center mt-5 mb-5">
      <div className="card bg-dark border-secondary p-4 shadow-lg" style={{ width: '100%', maxWidth: '450px' }}>
        <h2 className="text-white mb-4 text-center">{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</h2>

        {serverMsg && (
          <div className="alert alert-info text-center py-2" role="alert">
            {serverMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {!isLogin && (
            <div className="mb-3">
              <label className="form-label text-light">Nombre Completo:</label>
              <input
                type="text"
                name="nombre"
                className="form-control"
                value={formData.nombre}
                onChange={handleChange}
              />
              {errors.nombre && <span className="text-danger small mt-1 d-block">{errors.nombre}</span>}
            </div>
          )}

          {!isLogin && (
            <div className="mb-3">
              <label className="form-label text-light">RUT:</label>
              <input
                type="text"
                name="rut"
                placeholder="12345678-9"
                className="form-control"
                value={formData.rut}
                onChange={handleChange}
              />
              {errors.rut && <span className="text-danger small mt-1 d-block">{errors.rut}</span>}
            </div>
          )}

          {!isLogin && (
            <div className="mb-3">
              <label className="form-label text-light">Fecha de Nacimiento:</label>
              <input
                type="date"
                name="fechaNacimiento"
                className="form-control"
                value={formData.fechaNacimiento}
                onChange={handleChange}
              />
              {errors.fechaNacimiento && (
                <span className="text-danger small mt-1 d-block">{errors.fechaNacimiento}</span>
              )}
            </div>
          )}

          <div className="mb-3">
            <label className="form-label text-light">Correo Electrónico:</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <span className="text-danger small mt-1 d-block">{errors.email}</span>}
          </div>

          <div className="mb-3">
            <label className="form-label text-light">Contraseña:</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <span className="text-danger small mt-1 d-block">{errors.password}</span>}
          </div>

          {!isLogin && (
            <div className="mb-4">
              <label className="form-label text-light">Confirmar Contraseña:</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-control"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <span className="text-danger small mt-1 d-block">{errors.confirmPassword}</span>
              )}
            </div>
          )}

          <button type="submit" className="btn btn-primary w-100 py-2 mt-2 fw-bold">
            {isLogin ? 'Ingresar' : 'Registrarse'}
          </button>
        </form>

        <p className="mt-4 text-center text-muted">
          {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
          <button
            type="button"
            className="btn btn-link p-0 border-0 text-decoration-none fw-bold"
            style={{ color: '#c084fc' }}
            onClick={() => {
              setIsLogin(!isLogin);
              setErrors({});
              setServerMsg('');
            }}
          >
            {isLogin ? 'Crea una aquí' : 'Inicia sesión'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;