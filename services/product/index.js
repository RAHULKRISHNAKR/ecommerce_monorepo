const express = require('express');
const app = express();

app.get('/products', (req, res) => {
  res.json([
    { id: 1, name: "Clay Panda" },
    { id: 2, name: "Mini Cactus" }
  ]);
});

app.listen(3003, () => console.log('Product service running on port 3003'));
