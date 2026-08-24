import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import MenuManagement from './pages/MenuManagement';
import Orders from './pages/Orders';
import Tables from './pages/Tables';
import Reservations from './pages/Reservations';
import Login from './pages/Login';

function App() {
  const isAuthenticated = localStorage.getItem('access_token');

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={
          isAuthenticated ? (
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/menu" element={<MenuManagement />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/tables" element={<Tables />} />
                <Route path="/reservations" element={<Reservations />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
        } />
      </Routes>
    </Router>
  );
}

export default App;