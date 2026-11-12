// src/pages/Auth.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Auth from './Auth';

describe('Pruebas de validación en Auth', () => {

  it('debería mostrar error si el usuario es menor de 18 años al intentar registrarse', () => {
    const { container } = render(<Auth />);

    // Ir a vista de registro
    const botonModoRegistro = screen.getByRole('button', { name: /crea una aquí/i });
    fireEvent.click(botonModoRegistro);

    // Seleccionar por name="fechaNacimiento"
    const inputFecha = container.querySelector('input[name="fechaNacimiento"]');
    const botonRegistrarse = screen.getByRole('button', { name: /registrarse/i });

    // Fecha menor de edad
    fireEvent.change(inputFecha, { target: { value: '2015-01-01' } });
    fireEvent.click(botonRegistrarse);

    expect(
      screen.getByText(/debes ser mayor de 18 años para crear una cuenta/i)
    ).toBeInTheDocument();
  });

  it('no debería mostrar error de edad si el usuario es mayor de 18 años', () => {
    const { container } = render(<Auth />);

    fireEvent.click(screen.getByRole('button', { name: /crea una aquí/i }));

    const inputFecha = container.querySelector('input[name="fechaNacimiento"]');

    // Fecha mayor de edad
    fireEvent.change(inputFecha, { target: { value: '1995-05-20' } });

    expect(
      screen.queryByText(/debes ser mayor de 18 años para crear una cuenta/i)
    ).not.toBeInTheDocument();
  });

});