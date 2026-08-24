import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem, getCategories } from '../services/api';

function MenuManagement() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    is_available: true,
    preparation_time: 10
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [itemsRes, categoriesRes] = await Promise.all([
        getMenuItems(),
        getCategories()
      ]);
      setItems(itemsRes.data);
      setCategories(categoriesRes.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load menu data');
      setLoading(false);
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        is_available: item.is_available,
        preparation_time: item.preparation_time
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        is_available: true,
        preparation_time: 10
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateMenuItem(editingItem.id, formData);
      } else {
        await createMenuItem(formData);
      }
      handleCloseModal();
      fetchData();
    } catch (err) {
      setError('Failed to save menu item');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteMenuItem(id);
        fetchData();
      } catch (err) {
        setError('Failed to delete menu item');
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Loading menu items...</p>
      </div>
    );
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Menu Management</h1>
        <Button variant="primary" onClick={() => handleOpenModal()}>
          <FaPlus /> Add Menu Item
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Prep Time</th>
            <th>Available</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.category_name}</td>
              <td>${item.price}</td>
              <td>{item.preparation_time} min</td>
              <td>{item.is_available ? '✅' : '❌'}</td>
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => handleOpenModal(item)}>
                  <FaEdit />
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(item.id)}>
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingItem ? 'Edit Menu Item' : 'Add Menu Item'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Price ($)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Preparation Time (minutes)</Form.Label>
              <Form.Control
                type="number"
                name="preparation_time"
                value={formData.preparation_time}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Available"
                name="is_available"
                checked={formData.is_available}
                onChange={handleChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingItem ? 'Update' : 'Add'} Item
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default MenuManagement;