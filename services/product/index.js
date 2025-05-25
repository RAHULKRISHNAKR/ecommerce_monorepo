const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Mock product database
let products = [
  { 
    id: 1, 
    name: "Clay Panda", 
    price: 29.99, 
    description: "Handcrafted ceramic panda figurine",
    category: "Home Decor",
    stock: 15,
    image: "https://example.com/clay-panda.jpg"
  },
  { 
    id: 2, 
    name: "Mini Cactus", 
    price: 12.99, 
    description: "Small succulent plant perfect for desks",
    category: "Plants",
    stock: 25,
    image: "https://example.com/mini-cactus.jpg"
  },
  {
    id: 3,
    name: "Wireless Headphones",
    price: 89.99,
    description: "High-quality Bluetooth headphones with noise cancellation",
    category: "Electronics",
    stock: 8,
    image: "https://example.com/headphones.jpg"
  },
  {
    id: 4,
    name: "Coffee Mug",
    price: 15.99,
    description: "Ceramic coffee mug with heat-resistant handle",
    category: "Kitchen",
    stock: 30,
    image: "https://example.com/coffee-mug.jpg"
  }
];

app.get('/products', (req, res) => {
  const { category, search } = req.query;
  let filteredProducts = products;

  if (category) {
    filteredProducts = filteredProducts.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    );
  }

  res.json(filteredProducts);
});

app.get('/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

app.post('/products', (req, res) => {
  const { name, price, description, category, stock, image } = req.body;
  
  if (!name || !price || !description || !category) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newProduct = {
    id: products.length + 1,
    name,
    price: parseFloat(price),
    description,
    category,
    stock: stock || 0,
    image: image || ''
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

app.put('/products/:id', (req, res) => {
  const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const updatedProduct = { ...products[productIndex], ...req.body, id: parseInt(req.params.id) };
  products[productIndex] = updatedProduct;
  res.json(updatedProduct);
});

app.delete('/products/:id', (req, res) => {
  const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  products.splice(productIndex, 1);
  res.json({ message: 'Product deleted successfully' });
});

app.get('/categories', (req, res) => {
  const categories = [...new Set(products.map(p => p.category))];
  res.json(categories);
});

app.listen(3003, () => console.log('Product service running on port 3003'));
