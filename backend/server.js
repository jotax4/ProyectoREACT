import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Base de datos en memoria
let products = [
  { id: 1, nombre: 'Consola PlayStation 5', categoria: 'Consolas', precio: 549990, oferta: true, precioOferta: 499990, imagen: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500' },
  { id: 2, nombre: 'Juego Nintendo Switch Zelda', categoria: 'Juegos', precio: 59990, oferta: false, precioOferta: 0, imagen: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=500' },
  { id: 3, nombre: 'Control Inalámbrico Xbox', categoria: 'Accesorios', precio: 69990, oferta: true, precioOferta: 54990, imagen: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=500' },
  { id: 4, nombre: 'Audífonos Gamer Inalámbricos HyperX', categoria: 'Accesorios', precio: 89990, oferta: true, precioOferta: 69990, imagen: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500' },
  { id: 5, nombre: 'Silla Gamer Ergonómica Premium', categoria: 'Accesorios', precio: 159990, oferta: false, precioOferta: 0, imagen: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=500' },
  { id: 6, nombre: 'Consola Portátil PlayStation Portal', categoria: 'Consolas', precio: 249990, oferta: true, precioOferta: 219990, imagen: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500' }
];

let orders = [];

// --- ENDPOINTS PRODUCTOS ---

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.post('/api/products', (req, res) => {
  const { nombre, categoria, precio, oferta, precioOferta, imagen } = req.body;

  // Validación de campos requeridos
  if (!nombre || !categoria || !precio) {
    return res.status(400).json({ error: 'Nombre, categoría y precio son obligatorios.' });
  }

  if (Number(precio) <= 0) {
    return res.status(400).json({ error: 'El precio debe ser un número positivo.' });
  }

  const newProduct = {
    id: Date.now(),
    nombre: String(nombre).trim(),
    categoria: String(categoria).trim(),
    precio: Number(precio),
    oferta: Boolean(oferta),
    precioOferta: oferta ? Number(precioOferta || 0) : 0,
    imagen: imagen || 'https://via.placeholder.com/500'
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

app.delete('/api/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = products.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Producto no encontrado.' });
  }

  products.splice(index, 1);
  res.json({ message: 'Producto eliminado con éxito.' });
});

// --- ENDPOINTS ÓRDENES ---

app.get('/api/orders', (req, res) => {
  res.json(orders);
});

app.post('/api/orders', (req, res) => {
  const { cliente, items, total } = req.body;

  if (!cliente || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'La orden debe incluir datos del cliente y al menos un producto.' });
  }

  const newOrder = {
    id: Date.now(),
    fecha: new Date().toLocaleDateString('es-CL'),
    cliente,
    items,
    total: Number(total || 0)
  };

  orders.push(newOrder);
  res.status(201).json(newOrder);
});

// Iniciar servidor
app.listen(PORT, () => console.log(`Backend activo en http://localhost:${PORT}`));