// NO debe haber ningún <template>, <script> ni <style> aquí.

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware para parsear el cuerpo de las peticiones
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({ message: 'API funcionando' });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});