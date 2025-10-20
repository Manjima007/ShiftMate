const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const aiUrl = process.env.AI_SERVICE_URL;

app.get('/', (req, res) => {
  res.send(`Core API is Running! Connected to AI at: ${aiUrl}`);
});

app.listen(port, () => {
  console.log(`Core API listening at http://localhost:${port}`);
});
