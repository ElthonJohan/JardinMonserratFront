import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Form, Row, Col } from 'react-bootstrap';
import { AppNavbar, Loading } from '../components/shared';
import axiosInstance from '../api/axiosConfig';
import toast from 'react-hot-toast';

const RolesPage = () => {
  const [roles, setRoles] = useState([]);
  const [permisosAgrupados, setPermisosAgrupados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'form'
  
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    permission_ids: []
  });

  const fetchDatos = async () => {
    try {
      setLoading(true);
      const [resRoles, resPerms] = await Promise.all([
        axiosInstance.get('/roles/'),
        axiosInstance.get('/permisos/')
      ]);
      setRoles(resRoles.data.results || resRoles.data);
      setPermisosAgrupados(resPerms.data.results || resPerms.data);
    } catch (error) {
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatos();
  }, []);

  const handleCreate = () => {
    setFormData({ id: null, name: '', permission_ids: [] });
    setViewMode('form');
  };

  const handleEdit = (role) => {
    setFormData({
      id: role.id,
      name: role.name,
      permission_ids: role.permissions.map(p => p.id)
    });
    setViewMode('form');
  };

  const handleTogglePermission = (permId) => {
    setFormData(prev => {
      const isSelected = prev.permission_ids.includes(permId);
      return {
        ...prev,
        permission_ids: isSelected 
          ? prev.permission_ids.filter(id => id !== permId)
          : [...prev.permission_ids, permId]
      };
    });
  };

  const handleSelectAllRow = (moduloDict) => {
    const rowIds = Object.values(moduloDict.permisos).map(p => p.id);
    const allSelected = rowIds.every(id => formData.permission_ids.includes(id));
    
    setFormData(prev => {
      if (allSelected) {
        return {
          ...prev,
          permission_ids: prev.permission_ids.filter(id => !rowIds.includes(id))
        };
      } else {
        const newSet = new Set([...prev.permission_ids, ...rowIds]);
        return {
          ...prev,
          permission_ids: Array.from(newSet)
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        permission_ids: formData.permission_ids
      };
      
      if (formData.id) {
        await axiosInstance.put(`/roles/${formData.id}/`, payload);
        toast.success('Rol actualizado');
      } else {
        await axiosInstance.post('/roles/', payload);
        toast.success('Rol creado');
      }
      
      setViewMode('list');
      fetchDatos();
    } catch (error) {
      toast.error('Error al guardar el rol');
    }
  };

  if (loading) return <Loading message="Cargando roles..." />;

  // LIST VIEW
  if (viewMode === 'list') {
    return (
      <div className="page-container">
        <AppNavbar />
        <Container className="my-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="page-title">Gestión de Roles</h2>
            <Button variant="danger" onClick={handleCreate}>
              + Nuevo Rol
            </Button>
          </div>

          <Card className="glass-card">
            <Card.Body>
              <Table responsive hover className="mt-3 align-middle">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre de Rol</th>
                    <th>Cant. Permisos</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.map((r) => (
                    <tr key={r.id}>
                      <td>{r.id}</td>
                      <td>{r.name}</td>
                      <td>{r.permissions?.length || 0}</td>
                      <td>
                        <Button variant="outline-primary" size="sm" onClick={() => handleEdit(r)}>
                          Editar
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {roles.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center text-muted py-4">
                        No hay roles registrados
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Container>
      </div>
    );
  }

  // FORM VIEW
  return (
    <div className="page-container">
      <AppNavbar />
      <Container className="my-5">
        <Button variant="light" onClick={() => setViewMode('list')} className="mb-4">
          &larr; Volver a la lista
        </Button>
        <Card className="glass-card shadow-lg border-0">
          <Card.Header className="bg-white border-0 pt-4 pb-0">
            <h3 className="page-title mb-0">{formData.id ? 'Editar Rol' : 'Crear Rol'}</h3>
          </Card.Header>
          <Card.Body className="p-4">
            <Form onSubmit={handleSubmit}>
              <Row className="mb-4">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-bold text-muted">Nombre del Rol</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="Ej. Secretaria"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      className="py-2"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <h5 className="mb-3 text-secondary fw-bold border-bottom pb-2">Matriz de Permisos</h5>
              
              <div className="table-responsive">
                <Table bordered hover className="align-middle">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: '25%' }}>Módulo</th>
                      <th className="text-center" style={{ width: '15%' }}>Todos</th>
                      <th className="text-center" style={{ width: '15%' }}>Ver</th>
                      <th className="text-center" style={{ width: '15%' }}>Insertar</th>
                      <th className="text-center" style={{ width: '15%' }}>Editar</th>
                      <th className="text-center" style={{ width: '15%' }}>Eliminar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {permisosAgrupados.map((mod, idx) => {
                      const rowIds = Object.values(mod.permisos).map(p => p.id);
                      const allSelected = rowIds.length > 0 && rowIds.every(id => formData.permission_ids.includes(id));
                      
                      return (
                        <tr key={idx}>
                          <td className="fw-bold">{mod.modulo}</td>
                          <td className="text-center bg-light">
                            <Form.Check 
                              type="switch"
                              id={`switch-all-${idx}`}
                              checked={allSelected}
                              onChange={() => handleSelectAllRow(mod)}
                            />
                          </td>
                          {['view', 'add', 'change', 'delete'].map(action => {
                            const pData = mod.permisos[action];
                            return (
                              <td key={action} className="text-center">
                                {pData ? (
                                  <Form.Check 
                                    type="switch"
                                    id={`switch-${pData.id}`}
                                    checked={formData.permission_ids.includes(pData.id)}
                                    onChange={() => handleTogglePermission(pData.id)}
                                  />
                                ) : (
                                  <span className="text-muted">-</span>
                                )}
                              </td>
                            )
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>

              <div className="d-flex justify-content-end mt-4">
                <Button variant="secondary" className="me-2" onClick={() => setViewMode('list')}>
                  Cancelar
                </Button>
                <Button variant="danger" type="submit" className="px-5">
                  Guardar Rol
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default RolesPage;
