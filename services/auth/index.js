const express = require('express');
const app = express();
app.use(express.json());

app.post('/login', (req, res) => {
  res.json({ message: "Login successful" });
});

app.listen(3001, () => console.log('Auth service running on port 3001'));
