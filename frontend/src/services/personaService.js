// src/services/personaService.js
const BASE_URL = "http://localhost:9090/api/v1/entities/personas";

export const personaService = {

  // GET
  getAll: async () => {
    const response = await fetch(BASE_URL);
    return await response.json();
  },

  // POST
  create: async (persona) => {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(persona)
    });
    return response;
  },

  // PUT
  update: async (id, persona) => {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(persona)
    });
    return response;
  },

  // DELETE
  remove: async (id) => {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE"
    });
    return response;
  },

  // Alias para compatibilidad con pruebas unitarias
  delete: async (id) => {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE"
    });
    return response;
  }

};

export default personaService;