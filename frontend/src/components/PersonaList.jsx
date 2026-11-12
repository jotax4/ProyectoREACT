function PersonaList({ personas, onDelete, onEdit }) {

  return (
    <table border="1" style={{ marginTop: "20px" }}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        {personas.map((p) => (
          <tr key={p.id}>
            <td>{p.id}</td>
            <td>{p.nombre}</td>
            <td>
              <button onClick={() => onEdit(p)}>
                Editar
              </button>

              <button onClick={() => onDelete(p.id)}>
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default PersonaList;