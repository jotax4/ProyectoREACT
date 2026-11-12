// '@testing-library/jest-dom': Extiende los matchers globales de Vitest/Jest aportando aserciones de interfaz muy útiles
// Esto añade métodos esenciales como .toBeInTheDocument(), .toHaveClass(), .toBeVisible(), etc.
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Desmonta los componentes de React después de cada prueba para evitar fugas de memoria
afterEach(() => {
  cleanup();
});
