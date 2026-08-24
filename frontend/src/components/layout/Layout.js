import React from 'react';
import { Container } from 'react-bootstrap';
import Navbar from './Navbar';

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <Container className="mt-4">
        {children}
      </Container>
    </>
  );
}

export default Layout;