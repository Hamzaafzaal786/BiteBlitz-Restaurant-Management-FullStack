import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Spinner, Alert, Modal, Form, Badge } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { getTables, updateTableStatus, createTable, deleteTable } from '../services/api';

function Tables() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [formData, setFormData] = useState({
    table_number: '',
    capacity: '',
    status: 'available'
  });

  const statusColors = {
    available: 'success',
    occupied: 'danger',
    reserved: 'warning',
    cleaning: 'secondary'
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      setLoading(true);
      const response = await getTables();
      setTables(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load tables');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (table = null) => {
    if (table) {
      setEditingTable(table);
      setFormData({
        table_number: table.table_number,
        capacity: table.capacity,
        status: table.status
      });
    } else {
      setEditingTable(null);
      setFormData({
        table_number: '',
        capacity: '',
        status: 'available'
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTable(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTable) {
        await updateTableStatus(editingTable.id, formData.status);
      } else {
        await createTable(formData);
      }
      handleCloseModal();
      fetchTables();
    } catch (err) {
      setError('Failed to save table');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this table?')) {
      try {
        await deleteTable(id);
        fetchTables();
      } catch (err) {
        setError('Failed to delete table');
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateTableStatus(id, newStatus);
      fetchTables();
    } catch (err) {
      setError('Failed to update table status');
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Loading tables...</p>
      </div>
    );
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>🪑 Tables</h1>
        <Button variant="primary" onClick={() => handleOpenModal()}>
          <FaPlus /> Add Table
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        {tables.map((table) => (
          <Col md={3} key={table.id} className="mb-3">
            <Card className={`border-${statusColors[table.status]}`}>
              <Card.Header className={`bg-${statusColors[table.status]} text-white`}>
                <h4 className="mb-0">Table {table.table_number}</h4>
              </Card.Header>
              <Card.Body className="text-center">
                <h2 className="display-4">{table.capacity}</h2>
                <p className="text-muted">Seats</p>
                <Badge bg={statusColors[table.status]} className="mb-2">
                  {table.status_display}
                </Badge>
                <div className="mt-3">
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    className="me-2"
                    onClick={() => handleOpenModal(table)}
                  >
                    <FaEdit />
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => handleDelete(table.id)}
                  >
                    <FaTrash />
                  </Button>
                </div>
                <div className="mt-2">
                  <Form.Select 
                    size="sm"
                    value={table.status}
                    onChange={(e) => handleStatusChange(table.id, e.target.value)}
                  >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="reserved">Reserved</option>
                    <option value="cleaning">Cleaning</option>
                  </Form.Select>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Add/Edit Table Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingTable ? 'Edit Table' : 'Add Table'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Table Number</Form.Label>
              <Form.Control
                type="number"
                name="table_number"
                value={formData.table_number}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Capacity (Seats)</Form.Label>
              <Form.Control
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {editingTable && (
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="reserved">Reserved</option>
                  <option value="cleaning">Cleaning</option>
                </Form.Select>
              </Form.Group>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingTable ? 'Update' : 'Add'} Table
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default Tables;