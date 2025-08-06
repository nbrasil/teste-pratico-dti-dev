const express = require('express');
const router = express.Router();
const droneController = require('../controllers/droneController');

// Rota GET para listar o status de todos os drones
router.get('/drones/status', droneController.getDronesStatus);

module.exports = router;