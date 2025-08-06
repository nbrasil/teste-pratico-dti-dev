const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');

// Rota POST para criar um novo pedido
router.post('/pedidos', pedidoController.createPedido);
router.get('/pedidos', pedidoController.getPedidos);

module.exports = router;