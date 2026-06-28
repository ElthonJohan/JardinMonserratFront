import React, { useState, useEffect, useMemo } from 'react';
import { Container, Card, Table, Button, Modal, Form, Pagination } from 'react-bootstrap';
import { AppNavbar, Loading } from '../components/shared';
import axiosInstance from '../api/axiosConfig';
import toast from 'react-hot-toast';

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  
  const [formData, setFormData] = useState({
    id: null,
    username: '',
    password: '',
    role_id: ''
  });

  const fetchDatos = async () => {
    try {
      setLoading(true);

      const resRoles = await axiosInstance.get('/auth/roles/');
      setRoles(resRoles.data.results || resRoles.data);

      const usuariosData = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const resUsuarios = await axiosInstance.get('/auth/usuarios/', {
          params: { page, page_size: 100 }
        });
        const payload = resUsuarios.data;

        if (Array.isArray(payload)) {
          usuariosData.push(...payload);
          hasMore = false;
        } else {
          usuariosData.push(...(payload.results || []));
          hasMore = Boolean(payload.next);
          page += 1;
        }
      }

      setUsuarios(usuariosData);
    } catch (error) {
      toast.error('Error al cargar datos');
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatos();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter]);

  const filteredUsuarios = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return usuarios.filter((usuario) => {
      const matchesSearch = !term ||
        usuario.username?.toLowerCase().includes(term) ||
        usuario.groups?.some((group) => group.name?.toLowerCase().includes(term));

      const matchesRole = !roleFilter || usuario.groups?.some((group) => String(group.id) === roleFilter);

      return matchesSearch && matchesRole;
    });
  }, [usuarios, searchTerm, roleFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredUsuarios.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedUsuarios = filteredUsuarios.slice(startIndex, startIndex + pageSize);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

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
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <Form.Label>Buscar usuario</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Buscar por username o rol..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <Form.Label>Filtrar por rol</Form.Label>
                <Form.Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                  <option value="">Todos los roles</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </Form.Select>
              </div>
              <div className="col-md-2 d-flex align-items-end">
                <Button
                  variant="outline-secondary"
                  className="w-100"
                  onClick={() => {
                    setSearchTerm('');
                    setRoleFilter('');
                    setCurrentPage(1);
                  }}
                >
                  Limpiar
                </Button>
              </div>
            </div>

            <div className="text-muted small mb-3">
              Mostrando {filteredUsuarios.length === 0 ? 0 : startIndex + 1}-{Math.min(startIndex + pageSize, filteredUsuarios.length)} de {filteredUsuarios.length} usuarios
            </div>

            <Table responsive hover className="align-middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Rol / Grupo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsuarios.map((u) => (
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
                {paginatedUsuarios.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center text-muted py-4">
                      No hay usuarios que coincidan con la búsqueda
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>

            {totalPages > 1 && (
              <div className="d-flex justify-content-between align-items-center mt-3">
                <span className="text-muted small">Página {currentPage} de {totalPages}</span>
                <Pagination className="mb-0">
                  <Pagination.Prev
                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                    disabled={currentPage === 1}
                  />
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                    <Pagination.Item
                      key={page}
                      active={page === currentPage}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next
                    onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                    disabled={currentPage === totalPages}
                  />
                </Pagination>
              </div>
            )}
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
