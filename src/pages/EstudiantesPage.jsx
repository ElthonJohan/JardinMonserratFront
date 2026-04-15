import { useEffect, useState } from "react";
import EstudianteForm from "../components/EstudianteForm";
import EstudianteTable from "../components/EstudianteTable";
import {
  getEstudiantes,
  createEstudiante,
  updateEstudiante,
  deleteEstudiante,
  getAulas,
  getApoderados,
} from "../services/estudianteService";

import toast from "react-hot-toast";

export default function EstudiantesPage() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [aulas, setAulas] = useState([]);
  const [apoderados, setApoderados] = useState([]);
  const [editing, setEditing] = useState(null);

  const loadData = async () => {
  try {
    const [estRes, aulaRes, apoRes] = await Promise.all([
      getEstudiantes(),
      getAulas(),
      getApoderados(),
    ]);

    // 🔥 NORMALIZAR TODO
    const estudiantesData = estRes.data?.results || estRes.data;
    const aulasData = aulaRes.data?.results || aulaRes.data;
    const apoderadosData = apoRes.data?.results || apoRes.data;

    setEstudiantes(Array.isArray(estudiantesData) ? estudiantesData : []);
    setAulas(Array.isArray(aulasData) ? aulasData : []);
    setApoderados(Array.isArray(apoderadosData) ? apoderadosData : []);

  } catch (error) {
    console.error("ERROR 👉", error.response?.data);
  }
};
  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (data) => {
    try {
      if (editing) {
        await updateEstudiante(editing.id, data);
        toast.success("Actualizado correctamente");
      } else {
        await createEstudiante(data);
        toast.success("Creado correctamente");
      }

      setEditing(null);
      loadData();
    } catch {
      toast.error("Error al guardar");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("¿Eliminar estudiante?")) {
      await deleteEstudiante(id);
      toast.success("Eliminado");
      loadData();
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Gestión de Estudiantes</h1>

      <EstudianteForm
        onSubmit={handleCreate}
        initialData={editing}
        aulas={aulas}
        apoderados={apoderados}
      />

      <EstudianteTable
        data={estudiantes}
        onEdit={setEditing}
        onDelete={handleDelete}
      />
    </div>
  );
}