import { useEffect, useState } from "react";

function PersonaForm({ onSave, personaEditando }) {

  const [id, setId] = useState("");
  const [nombre, setNombre] = useState("");

  // Si se selecciona editar
  useEffect(() => {
    if (personaEditando) {
      setId(personaEditando.id);
      setNombre(personaEditando.nombre);
    }
  }, [personaEditando]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const persona = { id, nombre };

    onSave(persona);

    // Limpiar formulario
    setId("");
    setNombre("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        //type="text"
        type="hidden"
        placeholder="ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
        //required
      />

      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />

      <button type="submit">
        {personaEditando ? "Actualizar" : "Crear"}
      </button>
    </form>
  );
}

export default PersonaForm;