import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Spinner, Alert, Button } from 'react-bootstrap';
import { FaShoppingCart, FaUsers, FaMoneyBillWave, FaChair } from 'react-icons/fa';
import { getDashboardSummary } from '../services/api';

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await getDashboardSummary();
      setData(response.data);
      setError(null);
    } catch (err) {
      console.error('Dashboard error:', err);
      
      // Check if it's an authentication error
      if (err.response?.status === 401) {
        // Unauthorized - clear tokens and redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return;
      }
      
      // Handle other errors
      if (err.response?.data) {
        setError(typeof err.response.data === 'string' ? err.response.data : 'Failed to load dashboard data');
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Failed to load dashboard data. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle loading state
  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading dashboard...</p>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <Alert variant="danger" className="mt-3">
        <Alert.Heading>Error Loading Dashboard</Alert.Heading>
        <p>{error}</p>
        <hr />
        <div className="d-flex justify-content-end">
          <Button variant="outline-danger" onClick={fetchDashboardData}>
            Retry
          </Button>
        </div>
      </Alert>
    );
  }

  // Stats cards data
  const stats = [
    { 
      title: 'Today\'s Orders', 
      value: data?.total_orders || 0, 
      icon: <FaShoppingCart />, 
      color: 'primary',
      bgColor: '#e3f2fd'
    },
    { 
      title: 'Active Orders', 
      value: data?.active_orders || 0, 
      icon: <FaUsers />, 
      color: 'warning',
      bgColor: '#fff3cd'
    },
    { 
      title: 'Revenue Today', 
      value: `$${data?.total_revenue || '0.00'}`, 
      icon: <FaMoneyBillWave />, 
      color: 'success',
      bgColor: '#d4edda'
    },
    { 
      title: 'Available Tables', 
      value: data?.available_tables || 0, 
      icon: <FaChair />, 
      color: 'info',
      bgColor: '#d1ecf1'
    },
  ];

  return (
    <>
      <h1 className="mb-4">📊 Dashboard</h1>
      <p className="text-muted mb-4">Welcome to BiteBlitz Restaurant Management System</p>
      
      {/* Stats Cards */}
      <Row>
        {stats.map((stat, index) => (
          <Col md={3} key={index} className="mb-3">
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-2">{stat.title}</h6>
                    <h2 className="mb-0">{stat.value}</h2>
                  </div>
                  <div 
                    className="rounded-circle p-3" 
                    style={{ 
                      backgroundColor: stat.bgColor,
                      fontSize: '1.8rem',
                      color: `var(--bs-${stat.color})`
                    }}
                  >
                    {stat.icon}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Popular Items and Reservations */}
      <Row className="mt-4">
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">🔥 Popular Items</h5>
            </Card.Header>
            <Card.Body>
              {data?.popular_items && data.popular_items.length > 0 ? (
                <ul className="list-group list-group-flush">
                  {data.popular_items.map((item, index) => (
                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                      <span>
                        <span className="badge bg-secondary me-2">{index + 1}</span>
                        {item.menu_item__name || 'Unknown Item'}
                      </span>
                      <span className="badge bg-primary rounded-pill">
                        {item.total_quantity} sold
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted text-center my-3">No sales data available yet</p>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Header className="bg-success text-white">
              <h5 className="mb-0">📅 Today's Reservations</h5>
            </Card.Header>
            <Card.Body>
              <div className="text-center py-3">
                <h1 className="display-3">{data?.today_reservations || 0}</h1>
                <p className="text-muted">Reservations for today</p>
                <hr />
                <div className="d-flex justify-content-around">
                  <div>
                    <small className="text-muted">Total Orders</small>
                    <h5>{data?.total_orders || 0}</h5>
                  </div>
                  <div>
                    <small className="text-muted">Active Orders</small>
                    <h5>{data?.active_orders || 0}</h5>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row className="mt-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-info text-white">
              <h5 className="mb-0">⚡ Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3} className="mb-2">
                  <button 
                    className="btn btn-outline-primary w-100 py-3"
                    onClick={() => window.location.href = '/orders'}
                  >
                    🧾 New Order
                  </button>
                </Col>
                <Col md={3} className="mb-2">
                  <button 
                    className="btn btn-outline-success w-100 py-3"
                    onClick={() => window.location.href = '/menu'}
                  >
                    📝 Manage Menu
                  </button>
                </Col>
                <Col md={3} className="mb-2">
                  <button 
                    className="btn btn-outline-warning w-100 py-3"
                    onClick={() => window.location.href = '/tables'}
                  >
                    🪑 View Tables
                  </button>
                </Col>
                <Col md={3} className="mb-2">
                  <button 
                    className="btn btn-outline-danger w-100 py-3"
                    onClick={() => window.location.href = '/reservations'}
                  >
                    📅 Reservations
                  </button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default Dashboard;