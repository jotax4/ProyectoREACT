// src/components/PersonaForm.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PersonaForm from './PersonaForm';

describe('PersonaForm Component', () => {
  
  it('debería renderizar los campos del formulario correctamente', () => {
    const mockOnSave = vi.fn();
    render(<PersonaForm onSave={mockOnSave} />);
    
    expect(screen.getByPlaceholderText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /crear/i })).toBeInTheDocument();
  });

  it('debería llamar a onSave con los datos del formulario al enviar', () => {
    const mockOnSave = vi.fn();
    render(<PersonaForm onSave={mockOnSave} />);
    
    const inputNombre = screen.getByPlaceholderText(/nombre/i);
    const botonCrear = screen.getByRole('button', { name: /crear/i });
    
    fireEvent.change(inputNombre, { target: { value: 'Carlos' } });
    fireEvent.click(botonCrear);
    
    // Se pasa id (vacío al crear) y el nombre ingresado
    expect(mockOnSave).toHaveBeenCalledWith({ id: '', nombre: 'Carlos' });
  });
});