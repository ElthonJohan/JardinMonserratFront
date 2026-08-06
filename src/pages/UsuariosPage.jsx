import React, { useState, useEffect, useMemo } from 'react';
import { Container, Card, Button, Modal, Form } from 'react-bootstrap';
import { AppNavbar, Loading, DataTable } from '../components/shared';
import Select from 'react-select';
import axiosInstance from '../api/axiosConfig';
import toast from 'react-hot-toast';

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  
  const [formData, setFormData] = useState({
    id: null,
    username: '',
    password: '',
    role_id: ''
  });

  const columns = useMemo(
    () => [
      { key: 'id', label: 'ID' },
      { key: 'username', label: 'Username' },
      {
        key: 'groups',
        label: 'Rol / Grupo',
        render: (val) => (val && val.length > 0 ? val.map((g) => g.name).join(', ') : 'Sin rol')
      },
      {
        key: 'acciones',
        label: 'Acciones',
        render: (_v, row) => (
          <div className="d-flex gap-2">
            <Button variant="outline-primary" size="sm" onClick={() => openModal(row)}>
              Editar
            </Button>
            <Button variant="outline-danger" size="sm" onClick={() => handleDelete(row.id)}>
              Eliminar
            </Button>
          </div>
        )
      }
    ],
    []
  );

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
                <Select
                  options={roles.map(r => ({ value: r.id, label: r.name }))}
                  value={roles.map(r => ({ value: r.id, label: r.name })).find(o => String(o.value) === String(roleFilter)) || null}
                  onChange={(selected) => setRoleFilter(selected ? selected.value : '')}
                  placeholder="Todos los roles"
                  isClearable
                  noOptionsMessage={() => "No se encontraron roles"}
                />
              </div>
              <div className="col-md-2 d-flex align-items-end">
                <Button
                  variant="outline-secondary"
                  className="w-100"
                  onClick={() => {
                    setSearchTerm('');
                    setRoleFilter('');
                  }}
                >
                  Limpiar
                </Button>
              </div>
            </div>

            <DataTable
              columns={columns}
              data={filteredUsuarios}
              loading={loading}
              paginated={true}
            />
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
                <Select
                  options={roles.map(r => ({ value: r.id, label: r.name }))}
                  value={roles.map(r => ({ value: r.id, label: r.name })).find(o => String(o.value) === String(formData.role_id)) || null}
                  onChange={(selected) => handleChange({ target: { name: 'role_id', value: selected ? selected.value : '' } })}
                  placeholder="Seleccione un rol"
                  isClearable
                  noOptionsMessage={() => "No se encontraron roles"}
                />
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
