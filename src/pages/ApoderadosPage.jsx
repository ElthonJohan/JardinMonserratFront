import { useEffect, useState } from "react";
import {
  getApoderados,
  createApoderado,
  updateApoderado,
  deleteApoderado,
} from "../api/apoderadosApi.js";

import ApoderadoForm from "../components/apoderados/ApoderadoForm.jsx";
import ApoderadoTable from "../components/apoderados/ApoderadoTable.jsx";

export default function ApoderadosPage() {
  const [apoderados, setApoderados] = useState([]);
  const [editData, setEditData] = useState(null);

  const loadData = async () => {
    const res = await getApoderados();
    //setApoderados(res.data.results || []);
      setApoderados(res && res.results ? res.results : []);

  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (data) => {
    if (editData) {
      await updateApoderado(editData.id, data);
    } else {
      await createApoderado(data);
    }

    setEditData(null);
    loadData();
  };

  const handleEdit = (item) => setEditData(item);

  const handleDelete = async (id) => {
    await deleteApoderado(id);
    loadData();
  };

  return (
    <div className="container mt-4">
      <h2>Gestión de Apoderados</h2>

      <ApoderadoForm onSubmit={handleSubmit} initialData={editData} />

      <ApoderadoTable
        data={apoderados}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}