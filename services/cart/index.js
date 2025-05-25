const express = require('express');
const app = express();
app.use(express.json());

app.post('/add', (req, res) => {
  res.json({ message: "Item added to cart" });
});

app.listen(3002, () => console.log('Cart service running on port 3002'));
