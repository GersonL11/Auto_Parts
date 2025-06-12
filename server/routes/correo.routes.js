const express = require('express');
const router = express.Router();
const Correo = require('../models/Correo');

// Obtener todos los correos (más recientes primero)
router.get('/', async (req, res) => {
  try {
    const correos = await Correo.find().sort({ fecha: -1 });
    res.json(correos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener correos' });
  }
});

// Marcar como leído
router.patch('/:id/leido', async (req, res) => {
  try {
    const correo = await Correo.findByIdAndUpdate(req.params.id, { leido: true }, { new: true });
    res.json(correo);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar correo' });
  }
});

// Eliminar correo
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Correo.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'La notificación no fue encontrada.',
        deletedId: req.params.id
      });
    }
    // Respuesta profesional y consistente
    res.json({ 
      success: true,
      message: '✅ La notificación ha sido eliminada exitosamente.',
      deletedId: req.params.id,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: 'Ocurrió un error al intentar eliminar la notificación.',
      detalle: err.message,
      deletedId: req.params.id
    });
  }
});

module.exports = router;
