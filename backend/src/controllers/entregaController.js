const allocationService = require('../services/allocationService');

exports.alocarEntregas = async (req, res) => {
    try {
        const resultado = await allocationService.alocarVoos();
        res.status(200).json(resultado);
    } catch (error) {
        console.error('Erro no processo de alocação:', error);
        res.status(500).json({ error: 'Falha ao executar a alocação de entregas.' });
    }
};