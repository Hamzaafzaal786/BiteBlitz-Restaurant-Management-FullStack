import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Spinner, Alert, Modal, Form } from 'react-bootstrap';
import { FaPlus, FaCheck } from 'react-icons/fa';
import { getReservations, createReservation, getTables } from '../services/api';

function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    guests: '',
    table: '',
    special_requests: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [reservationsRes, tablesRes] = await Promise.all([
        getReservations(),
        getTables()
      ]);
      setReservations(reservationsRes.data);
      setTables(tablesRes.data);
      setError(null);
    } catch (err) {
      setError('Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setFormData({
      customer_name: '',
      phone: '',
      email: '',
      date: '',
      time: '',
      guests: '',
      table: '',
      special_requests: ''
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createReservation(formData);
      handleCloseModal();
      fetchData();
    } catch (err) {
      setError('Failed to create reservation');
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Loading reservations...</p>
      </div>
    );
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>📅 Reservations</h1>
        <Button variant="primary" onClick={handleOpenModal}>
          <FaPlus /> New Reservation
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Phone</th>
            <th>Date</th>
            <th>Time</th>
            <th>Guests</th>
            <th>Table</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => (
            <tr key={reservation.id}>
              <td>{reservation.customer_name}</td>
              <td>{reservation.phone}</td>
              <td>{reservation.date}</td>
              <td>{reservation.time}</td>
              <td>{reservation.guests}</td>
              <td>Table {reservation.table_number}</td>
              <td>
                <Badge bg={reservation.is_confirmed ? 'success' : 'warning'}>
                  {reservation.is_confirmed ? 'Confirmed' : 'Pending'}
                </Badge>
              </td>
              <td>
                <Button 
                  variant="success" 
                  size="sm"
                  disabled={reservation.is_confirmed}
                >
                  <FaCheck /> Confirm
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* New Reservation Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>New Reservation</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Customer Name</Form.Label>
              <Form.Control
                type="text"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Time</Form.Label>
              <Form.Control
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Number of Guests</Form.Label>
              <Form.Control
                type="number"
                name="guests"
                value={formData.guests}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Table</Form.Label>
              <Form.Select
                name="table"
                value={formData.table}
                onChange={handleChange}
                required
              >
                <option value="">Select Table</option>
                {tables.map((table) => (
                  <option key={table.id} value={table.id}>
                    Table {table.table_number} - {table.capacity} seats
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Special Requests</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="special_requests"
                value={formData.special_requests}
                onChange={handleChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Create Reservation
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default Reservations;