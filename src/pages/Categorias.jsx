import React from 'react';
import { Home } from './Home';

export const Categorias = ({ onAddToCart }) => {
  return (
    <div>
      <h2 className="mb-3">Nuestras Categorías</h2>
      <Home onAddToCart={onAddToCart} />
    </div>
  );
};