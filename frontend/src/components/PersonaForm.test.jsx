// src/components/PersonaForm.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PersonaForm from './PersonaForm';

// describe: Contenedor principal de pruebas para el componente PersonaForm
describe('PersonaForm Component', () => {
  
  // it: Verifica que el formulario renderice los campos principales adecuadamente
  it('debería renderizar los campos del formulario correctamente', () => {
    const mockOnSubmit = vi.fn(); // Crea una función espía simulada para interceptar el envío
    render(<PersonaForm onSubmit={mockOnSubmit} />); // Renderiza el componente en el DOM virtual de prueba
    
    // screen.getByLabelText / getByRole: Busca elementos interactivos específicos en la pantalla
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument(); // Valida que exista el campo de entrada "Nombre"
    expect(screen.getByRole('button', { name: /guardar/i })).toBeInTheDocument(); // Valida la existencia del botón de envío
  });

  // it: Evalúa que el flujo de tipeo y envío invoque la función onSubmit provista por las props
  it('debería llamar a onSubmit con los datos del formulario al enviar', () => {
    const mockOnSubmit = vi.fn(); // Inicializa el mock del evento de envío
    render(<PersonaForm onSubmit={mockOnSubmit} />); // Inserta el componente en el entorno virtual
    
    const inputNombre = screen.getByLabelText(/nombre/i); // Captura el input del formulario
    const botonGuardar = screen.getByRole('button', { name: /guardar/i }); // Captura el botón para guardar
    
    // fireEvent.change: Simula la interacción del usuario modificando el valor del input a 'Carlos'
    fireEvent.change(inputNombre, { target: { value: 'Carlos' } });
    
    // fireEvent.click: Ejecuta un evento de click simulado sobre el botón de envío del formulario
    fireEvent.click(botonGuardar);
    
    // expect: Asegura que el callback del componente fue invocado exactamente con el objeto de datos esperado
    expect(mockOnSubmit).toHaveBeenCalledWith({ nombre: 'Carlos' });
  });
});
