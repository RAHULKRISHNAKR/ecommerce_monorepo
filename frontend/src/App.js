import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

// Components
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import ProductDetail from './components/ProductDetail';

// API Base URLs
const API_URLS = {
  auth: process.env.REACT_APP_AUTH_URL || 'http://localhost:3001',
  cart: process.env.REACT_APP_CART_URL || 'http://localhost:3002',
  product: process.env.REACT_APP_PRODUCT_URL || 'http://localhost:3003'
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      verifyToken(token);
    } else {
      setLoading(false);
    }
    fetchCartCount();
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await axios.get(`${API_URLS.auth}/verify`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data.user);
    } catch (error) {
      localStorage.removeItem('token');
    }
    setLoading(false);
  };

  const fetchCartCount = async () => {
    try {
      const response = await axios.get(`${API_URLS.cart}/cart`, {
        headers: { 'user-id': user?.userId || 'anonymous' }
      });
      setCartCount(response.data.items.length);
    } catch (error) {
      console.error('Failed to fetch cart count');
    }
  };

  const handleLogin = (userData, token) => {
    setUser(userData);
    localStorage.setItem('token', token);
    fetchCartCount();
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    setCartCount(0);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Navbar user={user} onLogout={handleLogout} cartCount={cartCount} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<ProductList onCartUpdate={fetchCartCount} />} />
            <Route path="/login" element={
              user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />
            } />
            <Route path="/register" element={
              user ? <Navigate to="/" /> : <Register onLogin={handleLogin} />
            } />
            <Route path="/cart" element={<Cart user={user} onCartUpdate={fetchCartCount} />} />
            <Route path="/product/:id" element={<ProductDetail onCartUpdate={fetchCartCount} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
