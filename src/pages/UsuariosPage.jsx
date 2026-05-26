import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Modal, Form } from 'react-bootstrap';
import { AppNavbar, Loading } from '../components/shared';
import axiosInstance from '../api/axiosConfig';
import toast from 'react-hot-toast';

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  const [formData, setFormData] = useState({
    id: null,
    username: '',
    password: '',
    role_id: ''
  });

  const fetchDatos = async () => {
    try {
      setLoading(true);
      const [resUsuarios, resRoles] = await Promise.all([
        axiosInstance.get('/auth/usuarios/'),
        axiosInstance.get('/auth/roles/')
      ]);
      setUsuarios(resUsuarios.data.results || resUsuarios.data);
      setRoles(resRoles.data.results || resRoles.data);
    } catch (error) {
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        username: formData.username,
        group_ids: [parseInt(formData.role_id)]
      };

      if (formData.password) {
        payload.password = formData.password;
      }
      
      if (formData.id) {
        await axiosInstance.put(`/auth/usuarios/${formData.id}/`, payload);
        toast.success('Usuario actualizado exitosamente');
      } else {
        if (!formData.password) {
            toast.error('La contraseña es requerida para un nuevo usuario');
            return;
        }
        await axiosInstance.post('/auth/register/', payload);
        toast.success('Usuario creado exitosamente');
      }
      setShowModal(false);
      fetchDatos();
    } catch (error) {
      toast.error('Error al guardar usuario');
    }
  };

  const openModal = (user = null) => {
    if (user) {
      setFormData({
        id: user.id,
        username: user.username,
        password: '', // Dejar en blanco a menos que quiera cambiarla
        role_id: user.groups?.[0]?.id || roles[0]?.id || ''
      });
    } else {
      setFormData({ id: null, username: '', password: '', role_id: roles[0]?.id || '' });
    }
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este usuario?')) {
      try {
        await axiosInstance.delete(`/auth/usuarios/${id}/`);
        toast.success('Usuario eliminado');
        fetchDatos();
      } catch (error) {
        toast.error('Error al eliminar');
      }
    }
  };

  if (loading) return <Loading message="Cargando usuarios..." />;

  return (
    <div className="page-container">
      <AppNavbar />
      <Container className="my-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="page-title">Gestión de Usuarios</h2>
          <Button variant="danger" onClick={() => openModal()}>
            + Nuevo Usuario
          </Button>
        </div>

        <Card className="glass-card">
          <Card.Body>
            <Table responsive hover className="mt-3 align-middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Rol / Grupo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.username}</td>
                    <td>
                      {u.groups && u.groups.length > 0 
                        ? u.groups.map(g => g.name).join(', ') 
                        : 'Sin rol'}
                    </td>
                    <td>
                      <Button variant="outline-primary" size="sm" className="me-2" onClick={() => openModal(u)}>
                        Editar
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(u.id)}>
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
                {usuarios.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center text-muted py-4">
                      No hay usuarios registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        {/* Modal Crear / Editar */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Form onSubmit={handleSubmit}>
            <Modal.Header closeButton>
              <Modal.Title>{formData.id ? 'Editar Usuario' : 'Crear Usuario'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Username (Email o DNI)</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>
                  Contraseña {formData.id ? '(Dejar en blanco para no cambiar)' : '*'}
                </Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  required={!formData.id}
                  value={formData.password}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Rol / Grupo</Form.Label>
                <Form.Select
                  name="role_id"
                  required
                  value={formData.role_id}
                  onChange={handleChange}
                >
                  <option value="">Seleccione un rol</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button variant="danger" type="submit">
                {formData.id ? 'Actualizar' : 'Crear'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Container>
    </div>
  );
};

export default UsuariosPage;
