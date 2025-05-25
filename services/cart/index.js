const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(cors());

// Mock cart database (in real app, this would be in a database)
const carts = new Map();

// Middleware to extract user ID (in real app, this would verify JWT)
const getUserId = (req) => {
  return req.headers['user-id'] || 'anonymous';
};

// Helper function to get product details
const getProductDetails = async (productId) => {
  try {
    const productServiceUrl = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3003';
    const response = await axios.get(`${productServiceUrl}/products/${productId}`);
    return response.data;
  } catch (error) {
    return null;
  }
};

app.get('/cart', async (req, res) => {
  const userId = getUserId(req);
  const cart = carts.get(userId) || { items: [], total: 0 };
  
  // Enrich cart items with product details
  const enrichedItems = await Promise.all(
    cart.items.map(async (item) => {
      const product = await getProductDetails(item.productId);
      return {
        ...item,
        product: product || { name: 'Product not found', price: 0 }
      };
    })
  );

  res.json({ ...cart, items: enrichedItems });
});

app.post('/cart/add', async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const userId = getUserId(req);

  if (!productId) {
    return res.status(400).json({ error: 'Product ID required' });
  }

  // Verify product exists
  const product = await getProductDetails(productId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  if (product.stock < quantity) {
    return res.status(400).json({ error: 'Insufficient stock' });
  }

  let cart = carts.get(userId) || { items: [], total: 0 };
  
  // Check if item already exists in cart
  const existingItemIndex = cart.items.findIndex(item => item.productId === productId);
  
  if (existingItemIndex >= 0) {
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    cart.items.push({ productId, quantity, addedAt: new Date() });
  }

  // Recalculate total
  cart.total = await calculateCartTotal(cart.items);
  carts.set(userId, cart);

  res.json({ message: "Item added to cart", cart });
});

app.put('/cart/update/:productId', async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  const userId = getUserId(req);

  if (quantity < 0) {
    return res.status(400).json({ error: 'Quantity must be positive' });
  }

  let cart = carts.get(userId) || { items: [], total: 0 };
  const itemIndex = cart.items.findIndex(item => item.productId === parseInt(productId));

  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found in cart' });
  }

  if (quantity === 0) {
    cart.items.splice(itemIndex, 1);
  } else {
    cart.items[itemIndex].quantity = quantity;
  }

  cart.total = await calculateCartTotal(cart.items);
  carts.set(userId, cart);

  res.json({ message: "Cart updated", cart });
});

app.delete('/cart/remove/:productId', async (req, res) => {
  const { productId } = req.params;
  const userId = getUserId(req);

  let cart = carts.get(userId) || { items: [], total: 0 };
  cart.items = cart.items.filter(item => item.productId !== parseInt(productId));
  
  cart.total = await calculateCartTotal(cart.items);
  carts.set(userId, cart);

  res.json({ message: "Item removed from cart", cart });
});

app.delete('/cart/clear', (req, res) => {
  const userId = getUserId(req);
  carts.set(userId, { items: [], total: 0 });
  res.json({ message: "Cart cleared" });
});

app.post('/cart/checkout', async (req, res) => {
  const userId = getUserId(req);
  const cart = carts.get(userId) || { items: [], total: 0 };

  if (cart.items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  // Simulate order processing
  const orderId = Math.random().toString(36).substr(2, 9);
  
  // Clear cart after checkout
  carts.set(userId, { items: [], total: 0 });

  res.json({ 
    message: "Checkout successful", 
    orderId,
    total: cart.total
  });
});

// Helper function to calculate cart total
const calculateCartTotal = async (items) => {
  let total = 0;
  for (const item of items) {
    const product = await getProductDetails(item.productId);
    if (product) {
      total += product.price * item.quantity;
    }
  }
  return Math.round(total * 100) / 100; // Round to 2 decimal places
};

app.listen(3002, () => console.log('Cart service running on port 3002'));
