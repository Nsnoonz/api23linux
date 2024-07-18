const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to my API' });
});

app.post('/api', (req, res) => {
  const data = req.body;
  res.json({ receivedData: data });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
