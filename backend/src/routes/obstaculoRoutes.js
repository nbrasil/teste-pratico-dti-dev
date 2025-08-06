const express = require('express');
const router = express.Router();
const obstaculoController = require('../controllers/obstaculoController');

// Rota GET para listar todos os obstáculos
router.get('/obstaculos', obstaculoController.listarObstaculos);

module.exports = router;