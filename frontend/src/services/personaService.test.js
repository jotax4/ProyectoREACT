// src/services/personaService.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { personaService } from './personaService';

// describe: Agrupa un conjunto de pruebas relacionadas para el servicio de personas
describe('Vamos a probar el personaService.js', () => {
  
  // beforeEach: Se ejecuta antes de cada test para limpiar los mocks y simular un estado limpio
  beforeEach(() => {
    vi.restoreAllMocks(); // Restaura el comportamiento original de todos los mocks creados
    global.fetch = vi.fn(); // Reemplaza la función fetch global con una función simulada (mock) de Vitest
  });

  // it: Define un caso de prueba individual para verificar la obtención de todas las personas
  it('debería obtener todas las personas correctamente', async () => {
    const mockPersonas = [{ id: 1, nombre: 'Leo' }]; // Datos simulados que esperamos recibir
    
    // vi.mocked: Resuelve una promesa simulando una respuesta HTTP exitosa (ok: true) con los datos en formato JSON
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPersonas,
    });

    const resultado = await personaService.getAll(); // Llama al método getAll del servicio
    
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:9090/api/v1/entities/personas'); // Verifica que se llamó a la URL correcta
    expect(resultado).toEqual(mockPersonas); // Verifica que el resultado obtenido coincide con los datos simulados
  });

  // it: Caso de prueba para verificar la creación exitosa de una nueva persona
  it('debería crear una persona correctamente', async () => {
    const nuevaPersona = { nombre: 'María López' }; // Datos de entrada para la creación
    const personaCreada = { id: 2, nombre: 'María López' }; // Datos devueltos por el servidor
    
    // mockResolvedValueOnce: Simula la respuesta HTTP exitosa de creación
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => personaCreada,
    });

    const response = await personaService.create(nuevaPersona); // Llama al método de creación del servicio
    
    // expect: Asegura que fetch se ejecutó con el método POST a la URL de Spring Boot
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:9090/api/v1/entities/personas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevaPersona),
    });
  });

  // it: Caso de prueba para verificar la eliminación de una persona mediante su ID
  it('debería eliminar una persona correctamente', async () => {
    // mockResolvedValueOnce: Simula una respuesta exitosa sin contenido
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
    });

    await personaService.delete(1); // Llama al método delete pasando el ID 1
    
    // expect: Comprueba que fetch se invocó apuntando al endpoint específico del ID con el método DELETE
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:9090/api/v1/entities/personas/1', {
      method: 'DELETE',
    });
  });
});