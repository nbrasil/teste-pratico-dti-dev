const db = require('../database/db');

exports.getDronesStatus = (req, res) => {
    const sql = 'SELECT id, status, bateria FROM drones';
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(rows);
    });
};