const express = require('express');
const router = express.Router();
const vooController = require('../controllers/vooController');

// Rota para iniciar um voo específico
router.post('/voos/:id/iniciar', vooController.iniciarVoo);

// Rota para finalizar um voo específico
router.post('/voos/:id/finalizar', vooController.finalizarVoo);
router.get('/voos', vooController.listarVoos);

module.exports = router;