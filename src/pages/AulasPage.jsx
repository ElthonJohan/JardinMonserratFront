import { useEffect, useState } from "react";
import {
  getAulas,
  createAula,
  updateAula,
  deleteAula,
} from "../services/aulaService";

import AulaForm from "../components/AulaForm";
import AulaTable from "../components/AulaTable";

export default function AulasPage() {
  const [aulas, setAulas] = useState([]);
  const [editData, setEditData] = useState(null);

  const loadData = async () => {
    const res = await getAulas();
    setAulas(res.data.results || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (data) => {
    if (editData) {
      await updateAula(editData.id, data);
    } else {
      await createAula(data);
    }

    setEditData(null);
    loadData();
  };

  const handleEdit = (item) => setEditData(item);

  const handleDelete = async (id) => {
    await deleteAula(id);
    loadData();
  };

  return (
    <div className="container mt-4">
      <h2>Gestión de Aulas</h2>

      <AulaForm onSubmit={handleSubmit} initialData={editData} />

      <AulaTable
        data={aulas}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}