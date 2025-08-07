const { dbAll } = require('../database/db-helpers');

exports.listarObstaculos = async (req, res) => {
    try {
        const sql = 'SELECT * FROM obstaculos';
        const obstaculos = await dbAll(sql);
        res.status(200).json(obstaculos);
    } catch (error) {
        console.error('Erro ao buscar obstáculos:', error);
        res.status(500).json({ error: 'Falha ao buscar os obstáculos.' });
    }
};