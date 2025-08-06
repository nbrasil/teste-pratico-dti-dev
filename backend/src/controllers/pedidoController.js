
const { dbAll, dbRun } = require('../database/db-helpers'); // Garanta que dbAll e dbRun estejam importados

// Função para criar um novo pedido (agora com validação de obstáculo)
exports.createPedido = async (req, res) => { // 1. Transformar em async
    const { localizacao_x, localizacao_y, peso_kg, prioridade } = req.body;

    if (!localizacao_x || !localizacao_y || !peso_kg || !prioridade) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    try {
        // 2. Buscar todos os obstáculos do banco de dados
        const obstaculos = await dbAll('SELECT * FROM obstaculos');

        // 3. Verificar se o ponto do pedido colide com algum obstáculo
        for (const obs of obstaculos) {
            // Usamos a fórmula da distância entre dois pontos: sqrt((x2-x1)² + (y2-y1)²)
            const distancia = Math.sqrt(Math.pow(localizacao_x - obs.x, 2) + Math.pow(localizacao_y - obs.y, 2));
            
            if (distancia < obs.raio) {
                // 4. Se colidir, retorna um erro 400 (Bad Request) com uma mensagem específica
                return res.status(400).json({ error: `Localização inválida: dentro da zona de exclusão "${obs.nome}".` });
            }
        }

        // 5. Se não houver colisão, prossegue com a criação do pedido
        const status = 'Aguardando';
        const data_pedido = new Date().toISOString();
        const sql = `INSERT INTO pedidos (localizacao_x, localizacao_y, peso_kg, prioridade, status, data_pedido) VALUES (?, ?, ?, ?, ?, ?)`;

        const result = await dbRun(sql, [localizacao_x, localizacao_y, peso_kg, prioridade, status, data_pedido]);
        
        res.status(201).json({ message: 'Pedido criado com sucesso!', pedidoId: result.lastID });

    } catch (error) {
        console.error("ERRO AO CRIAR PEDIDO:", error);
        res.status(500).json({ error: 'Erro interno ao salvar o pedido no banco de dados.' });
    }
};

exports.getPedidos = (req, res) => {
    const sql = `SELECT * FROM pedidos WHERE status = 'Aguardando' OR status = 'Alocado'`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(rows);
    });
};

module.exports = {
    createPedido: exports.createPedido,
    getPedidos: exports.getPedidos,
};