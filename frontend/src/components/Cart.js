import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URLS = {
  cart: process.env.REACT_APP_CART_URL || 'http://localhost:3002'
};

function Cart({ user, onCartUpdate }) {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = token ? JSON.parse(atob(token.split('.')[1])).userId : 'anonymous';
      
      const response = await axios.get(`${API_URLS.cart}/cart`, {
        headers: { 'user-id': userId }
      });
      setCart(response.data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
    setLoading(false);
  };

  const updateQuantity = async (productId, newQuantity) => {
    try {
      const token = localStorage.getItem('token');
      const userId = token ? JSON.parse(atob(token.split('.')[1])).userId : 'anonymous';
      
      await axios.put(`${API_URLS.cart}/cart/update/${productId}`, 
        { quantity: newQuantity },
        { headers: { 'user-id': userId } }
      );
      fetchCart();
      onCartUpdate();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to update cart');
    }
  };

  const removeItem = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const userId = token ? JSON.parse(atob(token.split('.')[1])).userId : 'anonymous';
      
      await axios.delete(`${API_URLS.cart}/cart/remove/${productId}`, {
        headers: { 'user-id': userId }
      });
      fetchCart();
      onCartUpdate();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to remove item');
    }
  };

  const checkout = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = token ? JSON.parse(atob(token.split('.')[1])).userId : 'anonymous';
      
      const response = await axios.post(`${API_URLS.cart}/cart/checkout`, {}, {
        headers: { 'user-id': userId }
      });
      alert(`Checkout successful! Order ID: ${response.data.orderId}`);
      fetchCart();
      onCartUpdate();
    } catch (error) {
      alert(error.response?.data?.error || 'Checkout failed');
    }
  };

  if (loading) {
    return <div className="loading">Loading cart...</div>;
  }

  return (
    <div className="cart-container">
      <h2 style={{ marginBottom: '2rem' }}>Shopping Cart</h2>
      
      {cart.items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          Your cart is empty
        </div>
      ) : (
        <>
          {cart.items.map(item => (
            <div key={item.productId} className="cart-item">
              <div className="cart-item-image">📦</div>
              <div className="cart-item-info">
                <h4>{item.product.name}</h4>
                <p>${item.product.price} each</p>
              </div>
              <div className="quantity-controls">
                <button 
                  className="quantity-btn"
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span style={{ margin: '0 1rem', fontWeight: 'bold' }}>{item.quantity}</span>
                <button 
                  className="quantity-btn"
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                >
                  +
                </button>
              </div>
              <div style={{ fontWeight: 'bold' }}>
                ${(item.product.price * item.quantity).toFixed(2)}
              </div>
              <button 
                onClick={() => removeItem(item.productId)}
                className="btn btn-danger"
                style={{ marginLeft: '1rem' }}
              >
                Remove
              </button>
            </div>
          ))}
          
          <div className="cart-total">
            <h3>Total: ${cart.total.toFixed(2)}</h3>
            <button onClick={checkout} className="btn btn-primary">
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
