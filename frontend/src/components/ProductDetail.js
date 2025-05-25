import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ProductDetail({ onCartUpdate }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`http://localhost:3003/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Failed to fetch product:', error);
    }
    setLoading(false);
  };

  const addToCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = token ? JSON.parse(atob(token.split('.')[1])).userId : 'anonymous';
      
      await axios.post('http://localhost:3002/cart/add', 
        { productId: parseInt(id), quantity },
        { headers: { 'user-id': userId } }
      );
      onCartUpdate();
      alert('Product added to cart!');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to add to cart');
    }
  };

  if (loading) {
    return <div className="loading">Loading product...</div>;
  }

  if (!product) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Product not found</div>;
  }

  return (
    <div className="form-container" style={{ maxWidth: '600px' }}>
      <button onClick={() => navigate(-1)} className="btn btn-secondary" style={{ marginBottom: '1rem' }}>
        ← Back
      </button>
      
      <div className="product-image" style={{ height: '300px', marginBottom: '2rem' }}>
        📦
      </div>
      
      <h1 style={{ marginBottom: '1rem' }}>{product.name}</h1>
      <p style={{ color: '#666', marginBottom: '1rem' }}>{product.description}</p>
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea', marginBottom: '1rem' }}>
        ${product.price}
      </div>
      <p style={{ marginBottom: '1rem' }}>
        <strong>Category:</strong> {product.category}<br/>
        <strong>Stock:</strong> {product.stock} available
      </p>
      
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem' }}>
        <label>Quantity:</label>
        <input
          type="number"
          min="1"
          max={product.stock}
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          style={{ width: '80px', padding: '0.5rem' }}
        />
      </div>
      
      <button 
        onClick={addToCart}
        className="btn btn-primary"
        style={{ width: '100%' }}
        disabled={product.stock === 0}
      >
        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
      </button>
    </div>
  );
}

export default ProductDetail;
