const BASE_URL = "http://localhost:9090/api/v1/entities/personas";

const personaService = {

  // GET
  getAll: async () => {
    const response = await fetch(BASE_URL);
    return await response.json();
  },

  // POST
  create: async (persona) => {
    await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(persona)
    });
  },

  // PUT
  update: async (id, persona) => {
    await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(persona)
    });
  },

  // DELETE
  remove: async (id) => {
    await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE"
    });
  }

};

export default personaService;