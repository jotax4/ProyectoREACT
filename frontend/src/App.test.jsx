import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

import { authService } from './services/authService';
import { productService } from './services/productService';
import { categoryService } from './services/categoryService';
import { orderService } from './services/orderService';
import { personaService } from './services/personaService';

vi.mock('./services/authService', () => ({
  authService: {
    getCurrentUser: vi.fn(),
    getToken: vi.fn(),
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  },
}));

vi.mock('./services/productService', () => ({
  productService: {
    getProducts: vi.fn(),
    createProduct: vi.fn(),
    updateProduct: vi.fn(),
    deleteProduct: vi.fn(),
  },
}));

vi.mock('./services/categoryService', () => ({
  categoryService: {
    getCategories: vi.fn(),
    createCategory: vi.fn(),
    updateCategory: vi.fn(),
    deleteCategory: vi.fn(),
  },
}));

vi.mock('./services/orderService', () => ({
  orderService: {
    createOrder: vi.fn(),
    getOrders: vi.fn(),
    getMyOrders: vi.fn(),
    getOrderById: vi.fn(),
    updateOrderStatus: vi.fn(),
  },
}));

vi.mock('./services/personaService', () => ({
  personaService: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    delete: vi.fn(),
  },
}));

const MOCK_CATEGORIAS = [
  { id: 1, nombre: 'Consolas', descripcion: 'Consolas de última generación' },
];

const MOCK_PRODUCTOS = [
  {
    id: 1,
    nombre: 'PlayStation 5',
    precio: 499990,
    oferta: false,
    precioOferta: 0,
    imagen: 'https://example.com/ps5.jpg',
    categoria: { id: 1, nombre: 'Consolas' },
  },
];

const renderApp = (initialRoute = '/') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <App />
    </MemoryRouter>
  );
};

// Cambia al modo "Crear Cuenta" haciendo clic en "Crea una aquí"
const activarModoRegistro = () => {
  const btnCrearCuenta = screen.queryByRole('button', { name: /crea una aquí/i });
  if (btnCrearCuenta) {
    fireEvent.click(btnCrearCuenta);
  }
};

// Completa todos los campos del formulario de registro de Auth.jsx y lo envía
const abrirYCompletarRegistro = (container, { nombre, rut, fechaNacimiento, email, password }) => {
  activarModoRegistro();

  fireEvent.change(container.querySelector('input[name="nombre"]'), { target: { value: nombre } });
  fireEvent.change(container.querySelector('input[name="rut"]'), { target: { value: rut } });
  fireEvent.change(container.querySelector('input[name="fechaNacimiento"]'), {
    target: { value: fechaNacimiento },
  });
  fireEvent.change(container.querySelector('input[name="email"]'), { target: { value: email } });
  fireEvent.change(container.querySelector('input[name="password"]'), { target: { value: password } });
  fireEvent.change(container.querySelector('input[name="confirmPassword"]'), {
    target: { value: password },
  });

  fireEvent.submit(container.querySelector('form'));
};

describe('Pruebas Funcionales App.jsx - Requerimientos de Sistema', () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    authService.getCurrentUser.mockReturnValue(null);
    authService.getToken.mockReturnValue(null);
    authService.login.mockResolvedValue({ ok: true, data: { user: null } });
    productService.getProducts.mockResolvedValue(MOCK_PRODUCTOS);
    categoryService.getCategories.mockResolvedValue(MOCK_CATEGORIAS);
    orderService.getOrders.mockResolvedValue([]);
    orderService.getMyOrders.mockResolvedValue([]);
    personaService.getAll.mockResolvedValue([]);
  });

  // =========================================================================
  // REQUERIMIENTO 1:
  // 1. La funcionalidad debe estar disponible para el tipo de usuario indicado.
  // 2. Los datos ingresados deben validarse antes de completar la operación.
  // 3. El sistema debe informar el resultado de la operación al usuario.
  // =========================================================================
  describe('Req 1: Disponibilidad por rol, validación de datos e informe de resultado', () => {
    it('1.1 restringe /admin para rol CLIENTE y lo habilita exclusivamente para rol ADMIN', async () => {
      authService.getCurrentUser.mockReturnValue({
        id: 2,
        nombre: 'Cliente Prueba',
        email: 'cliente@levelupgamer.cl',
        rol: 'CLIENTE',
      });

      const { unmount } = renderApp('/admin');

      await waitFor(() => {
        expect(screen.getByText(/BIENVENIDO A/i)).toBeInTheDocument();
      });
      expect(screen.queryByRole('link', { name: /^Admin$/i })).not.toBeInTheDocument();
      unmount();

      authService.getCurrentUser.mockReturnValue({
        id: 1,
        nombre: 'Admin Prueba',
        email: 'admin@levelupgamer.cl',
        rol: 'ADMIN',
      });

      renderApp('/admin');

      await waitFor(() => {
        expect(screen.getByText('Panel de Administración')).toBeInTheDocument();
      });
      expect(screen.getByRole('link', { name: /^Admin$/i })).toBeInTheDocument();
    });

    it('1.2 valida los datos ingresados antes de completar la operación y bloquea envíos inválidos', async () => {
      authService.getCurrentUser.mockReturnValue({
        id: 1,
        nombre: 'Admin Prueba',
        email: 'admin@levelupgamer.cl',
        rol: 'ADMIN',
      });

      const { container } = renderApp('/admin');

      await waitFor(() => {
        expect(screen.getByText('Panel de Administración')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /categorías/i }));

      const inputNombre = container.querySelector('input[type="text"]');
      fireEvent.change(inputNombre, { target: { value: '   ' } });

      fireEvent.submit(container.querySelector('form'));

      await waitFor(() => {
        expect(screen.getByText('El nombre de la categoría es obligatorio.')).toBeInTheDocument();
      });
      expect(categoryService.createCategory).not.toHaveBeenCalled();
    });

    it('1.3 completa la operación cuando los datos son válidos e informa el resultado al usuario', async () => {
      authService.getCurrentUser.mockReturnValue({
        id: 1,
        nombre: 'Admin Prueba',
        email: 'admin@levelupgamer.cl',
        rol: 'ADMIN',
      });
      categoryService.createCategory.mockResolvedValueOnce({
        id: 2,
        nombre: 'Sillas Gamer',
        descripcion: 'Ergonómicas',
      });

      const { container } = renderApp('/admin');

      await waitFor(() => {
        expect(screen.getByText('Panel de Administración')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /categorías/i }));

      const inputNombre = container.querySelector('input[type="text"]');
      fireEvent.change(inputNombre, { target: { value: 'Sillas Gamer' } });

      fireEvent.submit(container.querySelector('form'));

      await waitFor(() => {
        expect(categoryService.createCategory).toHaveBeenCalledWith({
          nombre: 'Sillas Gamer',
          descripcion: '',
        });
        expect(screen.getByText('Categoría creada correctamente.')).toBeInTheDocument();
      });
    });
  });

  // =========================================================================
  // REQUERIMIENTO 2:
  // 1. Se solicita la fecha de nacimiento.
  // 2. El sistema valida que el usuario tenga 18 años o más.
  // 3. Si es menor de 18, no permite completar el registro.
  // =========================================================================
  describe('Req 2: Solicitud de fecha de nacimiento y validación de mayoría de edad (>= 18 años)', () => {
    it('2.1 solicita la fecha de nacimiento en el formulario de registro', async () => {
      const { container } = renderApp('/login');

      activarModoRegistro();

      const dateInput = container.querySelector('input[name="fechaNacimiento"]');
      expect(dateInput).not.toBeNull();
      expect(screen.getByText('Fecha de Nacimiento:')).toBeInTheDocument();
    });

    it('2.2 impide completar el registro si el usuario es menor de 18 años', async () => {
      const { container } = renderApp('/login');

      abrirYCompletarRegistro(container, {
        nombre: 'Usuario Menor',
        rut: '22333444-5',
        fechaNacimiento: '2012-05-10',
        email: 'menor@gmail.com',
        password: 'Password123',
      });

      await waitFor(() => {
        expect(
          screen.getByText('Debes ser mayor de 18 años para crear una cuenta.')
        ).toBeInTheDocument();
      });
      expect(authService.register).not.toHaveBeenCalled();
    });

    it('2.3 permite completar el registro si el usuario tiene 18 años o más', async () => {
      authService.register.mockResolvedValueOnce({
        ok: true,
        data: { message: 'Usuario registrado' },
      });

      const { container } = renderApp('/login');

      abrirYCompletarRegistro(container, {
        nombre: 'Usuario Adulto',
        rut: '18333444-5',
        fechaNacimiento: '2000-05-10',
        email: 'adulto@gmail.com',
        password: 'Password123',
      });

      await waitFor(() => {
        expect(authService.register).toHaveBeenCalledTimes(1);
        expect(
          screen.getByText('¡Cuenta creada con éxito! Ahora puedes iniciar sesión.')
        ).toBeInTheDocument();
      });
    });
  });

  // =========================================================================
  // REQUERIMIENTO 3:
  // 1. El correo debe cumplir el formato establecido.
  // =========================================================================
  describe('Req 3: Validación de formato de correo electrónico', () => {
    it('3.1 rechaza un correo que no cumple el formato establecido y bloquea el registro', async () => {
      const { container } = renderApp('/login');

      abrirYCompletarRegistro(container, {
        nombre: 'Usuario Correo Malo',
        rut: '18333444-5',
        fechaNacimiento: '2000-05-10',
        email: 'correo-sin-formato-valido',
        password: 'Password123',
      });

      await waitFor(() => {
        expect(screen.getByText('Ingrese un correo electrónico válido.')).toBeInTheDocument();
      });
      expect(authService.register).not.toHaveBeenCalled();
    });

    it('3.2 acepta un correo con formato válido y procesa la solicitud', async () => {
      authService.register.mockResolvedValueOnce({
        ok: true,
        data: { message: 'Usuario registrado' },
      });

      const { container } = renderApp('/login');

      abrirYCompletarRegistro(container, {
        nombre: 'Usuario Correo Valido',
        rut: '18333444-5',
        fechaNacimiento: '2000-05-10',
        email: 'usuario.valido@duocuc.cl',
        password: 'Password123',
      });

      await waitFor(() => {
        expect(authService.register).toHaveBeenCalledTimes(1);
        expect(
          screen.getByText('¡Cuenta creada con éxito! Ahora puedes iniciar sesión.')
        ).toBeInTheDocument();
      });
    });
  });
});