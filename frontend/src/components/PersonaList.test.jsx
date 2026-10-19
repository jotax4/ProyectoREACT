// src/components/PersonaList.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PersonaList from './PersonaList';

// describe: Agrupación de pruebas unitarias enfocadas en el listado de personas
describe('PersonaList Component', () => {
  // Datos estáticos simulados que representarán el listado de personas inyectado mediante props
  const personasMock = [
    { id: 1, nombre: 'Ana Gómez' },
    { id: 2, nombre: 'Luis Martínez' }
  ];

  // it: Confirma que todos los registros pasados por el array aparezcan en el DOM
  it('debería renderizar la lista de personas adecuadamente', () => {
    render(<PersonaList personas={personasMock} onDelete={vi.fn()} />); // Renderiza el componente con los mocks correspondientes
    
    // screen.getByText: Busca textos explícitos en el DOM renderizado para confirmar visibilidad
    expect(screen.getByText('Ana Gómez')).toBeInTheDocument(); // Valida la presencia de la primera persona
    expect(screen.getByText('Luis Martínez')).toBeInTheDocument(); // Valida la presencia de la segunda persona
  });

  // it: Prueba que la acción de eliminar invoque el callback correspondiente con el ID adecuado
  it('debería llamar a onDelete con el ID correcto cuando se hace clic en el botón de eliminar', () => {
    const mockOnDelete = vi.fn(); // Crea una función espía mock para interceptar la eliminación
    render(<PersonaList personas={personasMock} onDelete={mockOnDelete} />); // Renderiza pasando el spy en la prop onDelete
    
    // screen.getAllByRole: Recupera todos los botones con texto o comportamiento de eliminación
    const botonesEliminar = screen.getAllByRole('button', { name: /eliminar/i });
    
    // fireEvent.click: Simula un click sobre el primer botón de eliminar (perteneciente a Ana Gómez con ID 1)
    fireEvent.click(botonesEliminar[1]);
    
    // expect: Comprueba de forma estricta que la función onDelete recibió el identificador '1'
    expect(mockOnDelete).toHaveBeenCalledWith(2);
  });
});
