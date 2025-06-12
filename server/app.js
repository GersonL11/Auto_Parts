const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/test', (req, res) => {
  res.json({ message: 'API funcionando' });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});