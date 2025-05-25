import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URLS = {
  cart: process.env.REACT_APP_CART_URL || 'http://localhost:3002',
  product: process.env.REACT_APP_PRODUCT_URL || 'http://localhost:3003'
};

function ProductList({ onCartUpdate }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [search, selectedCategory]);

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedCategory) params.append('category', selectedCategory);
      
      const response = await axios.get(`${API_URLS.product}/products?${params}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URLS.product}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const addToCart = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const userId = token ? JSON.parse(atob(token.split('.')[1])).userId : 'anonymous';
      
      await axios.post(`${API_URLS.cart}/cart/add`, 
        { productId, quantity: 1 },
        { headers: { 'user-id': userId } }
      );
      onCartUpdate();
      alert('Product added to cart!');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to add to cart');
    }
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div>
      <div className="search-filter">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <div className="product-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <Link to={`/product/${product.id}`}>
              <div className="product-image">
                📦
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <div className="product-price">${product.price}</div>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>
                  Stock: {product.stock} | Category: {product.category}
                </p>
              </div>
            </Link>
            <div style={{ padding: '0 1.5rem 1.5rem' }}>
              <button 
                onClick={() => addToCart(product.id)}
                className="btn btn-primary"
                style={{ width: '100%' }}
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          No products found matching your criteria.
        </div>
      )}
    </div>
  );
}

export default ProductList;
