const express = require('express');
const router = express.Router();
const entregaController = require('../controllers/entregaController');

// Rota POST para acionar a alocação
router.post('/entregas/alocar', entregaController.alocarEntregas);

module.exports = router;