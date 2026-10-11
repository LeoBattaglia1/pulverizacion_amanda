export default function Sidebar({ activeSection, setActiveSection }) {
  const modulos = [
    { id: "clientes", nombre: "Clientes y Campos" },
    { id: "resumen", nombre: "Resumen / General" },
    { id: "maquinas", nombre: "Máquinas" },
    { id: "empleados", nombre: "Empleados" },
    { id: "insumos", nombre: "Insumos" },
    { id: "proveedores", nombre: "Proveedores" },
    { id: "contador", nombre: "Contador" },
    { id: "turnos", nombre: "Turnos" },
  ];

  return (
    <aside className="sidebar">
      <ul>
        {modulos.map((mod) => (
          <li
            key={mod.id}
            onClick={() => setActiveSection(mod.id)}
            style={{
              backgroundColor:
                activeSection === mod.id ? "#334155" : "transparent",
            }}
          >
            <span>{mod.nombre}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
