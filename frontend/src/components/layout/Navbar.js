import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, Container, Button } from 'react-bootstrap';

function Navbar() {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('access_token');

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/">
          🍔 BiteBlitz
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          {isAuthenticated && (
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Dashboard</Nav.Link>
              <Nav.Link as={Link} to="/menu">Menu</Nav.Link>
              <Nav.Link as={Link} to="/orders">Orders</Nav.Link>
              <Nav.Link as={Link} to="/tables">Tables</Nav.Link>
              <Nav.Link as={Link} to="/reservations">Reservations</Nav.Link>
            </Nav>
          )}
          <Nav>
            {isAuthenticated ? (
              <Button variant="outline-light" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}

export default Navbar;