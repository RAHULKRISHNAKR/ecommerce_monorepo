import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ user, onLogout, cartCount }) {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">🛒 EStore</Link>
      <div className="nav-links">
        <Link to="/">Products</Link>
        <Link to="/cart" className="cart-badge">
          🛍️ Cart
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </Link>
        {user ? (
          <>
            <span>Welcome, {user.email}</span>
            <button onClick={onLogout} className="btn btn-secondary">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-primary">Login</Link>
            <Link to="/register" className="btn btn-secondary">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
