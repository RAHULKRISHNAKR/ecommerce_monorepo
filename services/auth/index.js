const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const JWT_SECRET = 'your-secret-key';

// Mock user database
const users = [
  { id: 1, email: 'user@example.com', password: '$2a$10$xGxZ8zJO7KN9Y8VqEHGU2uVfL9N8F5mL6K8r3Q4s8T9mN1P7R2Y6Z' }, // password: 123456
  { id: 2, email: 'admin@example.com', password: '$2a$10$xGxZ8zJO7KN9Y8VqEHGU2uVfL9N8F5mL6K8r3Q4s8T9mN1P7R2Y6Z' }
];

app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { 
    id: users.length + 1, 
    email, 
    password: hashedPassword 
  };
  users.push(newUser);

  const token = jwt.sign({ userId: newUser.id, email }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, user: { id: newUser.id, email } });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user.id, email }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, user: { id: user.id, email } });
});

app.get('/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

app.listen(3001, () => console.log('Auth service running on port 3001'));
