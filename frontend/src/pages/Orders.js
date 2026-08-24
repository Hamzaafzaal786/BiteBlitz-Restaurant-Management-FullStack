import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Spinner, Alert, Modal, Dropdown } from 'react-bootstrap';
import { FaEye, FaEdit, FaPlus } from 'react-icons/fa';
import { getOrders, updateOrderStatus, getTables, getStaff, getMenuItems, createOrder } from '../services/api';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState([]);
  const [staff, setStaff] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [formData, setFormData] = useState({
    table: '',
    staff: '',
    items: [],
    customer_name: '',
    customer_phone: '',
    is_takeaway: false
  });

  const statusColors = {
    pending: 'warning',
    preparing: 'info',
    ready: 'primary',
    served: 'success',
    completed: 'secondary',
    cancelled: 'danger'
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordersRes, tablesRes, staffRes, menuRes] = await Promise.all([
        getOrders(),
        getTables(),
        getStaff(),
        getMenuItems()
      ]);
      setOrders(ordersRes.data);
      setTables(tablesRes.data);
      setStaff(staffRes.data);
      setMenuItems(menuRes.data);
      setError(null);
    } catch (err) {
      setError('Failed to load orders data');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      fetchData();
    } catch (err) {
      setError('Failed to update order status');
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const getStatusBadge = (status) => {
    return <Badge bg={statusColors[status] || 'secondary'}>{status.toUpperCase()}</Badge>;
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>🧾 Orders</h1>
        <Button variant="primary" onClick={() => {}}>
          <FaPlus /> New Order
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Order #</th>
            <th>Table</th>
            <th>Staff</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>#{order.id}</td>
              <td>Table {order.table_number}</td>
              <td>{order.staff_name}</td>
              <td>{order.items?.length || 0} items</td>
              <td>${order.total_amount}</td>
              <td>{getStatusBadge(order.status)}</td>
              <td>{new Date(order.order_date).toLocaleTimeString()}</td>
              <td>
                <Button 
                  variant="info" 
                  size="sm" 
                  className="me-2"
                  onClick={() => handleViewOrder(order)}
                >
                  <FaEye />
                </Button>
                <Dropdown>
                  <Dropdown.Toggle variant="warning" size="sm">
                    <FaEdit />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {['pending', 'preparing', 'ready', 'served', 'completed', 'cancelled'].map((status) => (
                      <Dropdown.Item 
                        key={status}
                        onClick={() => handleStatusUpdate(order.id, status)}
                        disabled={order.status === status}
                      >
                        {status.toUpperCase()}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Order Details Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Order #{selectedOrder?.id} Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <>
              <div className="row">
                <div className="col-md-6">
                  <p><strong>Table:</strong> {selectedOrder.table_number}</p>
                  <p><strong>Staff:</strong> {selectedOrder.staff_name}</p>
                  <p><strong>Status:</strong> {getStatusBadge(selectedOrder.status)}</p>
                </div>
                <div className="col-md-6">
                  <p><strong>Date:</strong> {new Date(selectedOrder.order_date).toLocaleString()}</p>
                  <p><strong>Total:</strong> ${selectedOrder.total_amount}</p>
                  <p><strong>Takeaway:</strong> {selectedOrder.is_takeaway ? 'Yes' : 'No'}</p>
                </div>
              </div>
              <hr />
              <h6>Order Items</h6>
              <Table striped bordered size="sm">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items?.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.menu_item_name}</td>
                      <td>{item.quantity}</td>
                      <td>${item.item_price}</td>
                      <td>${(item.quantity * item.item_price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th colSpan="3">Grand Total</th>
                    <th>${selectedOrder.total_amount}</th>
                  </tr>
                </tfoot>
              </Table>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Orders;