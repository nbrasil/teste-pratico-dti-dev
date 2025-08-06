const { dbAll, dbRun } = require('../database/db-helpers');
const { calcularBateriaConsumida } = require('../utils/geometry');

// Função para iniciar um voo
exports.iniciarVoo = async (req, res) => {
    const { id } = req.params; // ID do voo

    try {
        const voo = (await dbAll('SELECT * FROM voos WHERE id = ?', [id]))[0];
        if (!voo) return res.status(404).json({ error: 'Voo não encontrado.' });
        if (voo.status !== 'Pendente') return res.status(400).json({ error: 'Este voo não está pendente para início.' });

        const idsPedidos = JSON.parse(voo.lista_de_pedidos);
        const placeholders = idsPedidos.map(() => '?').join(',');

        // Atualiza status do drone, do voo e dos pedidos
        await dbRun("UPDATE drones SET status = 'Em voo' WHERE id = ?", [voo.drone_id]);
        await dbRun("UPDATE voos SET status = 'Em andamento' WHERE id = ?", [id]);
        // dentro de iniciarVoo
        await dbRun(`UPDATE pedidos SET status = ? WHERE id IN (${placeholders})`, ['Em transito', ...idsPedidos]);

        res.status(200).json({ message: `Voo #${id} iniciado. Drone #${voo.drone_id} está em trânsito.` });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao iniciar o voo: ' + error.message });
    }
};

// Função para finalizar um voo
exports.finalizarVoo = async (req, res) => {
    const { id } = req.params; // ID do voo

    try {
        const voo = (await dbAll('SELECT * FROM voos WHERE id = ?', [id]))[0];
        if (!voo) return res.status(404).json({ error: 'Voo não encontrado.' });
        if (voo.status !== 'Em andamento') return res.status(400).json({ error: 'Este voo não está em andamento para ser finalizado.' });

        const drone = (await dbAll('SELECT * FROM drones WHERE id = ?', [voo.drone_id]))[0];
        if (!drone) {
            // Se o drone associado ao voo não for encontrado, retorne um erro claro.
            return res.status(404).json({ error: `Drone com ID ${voo.drone_id} associado a este voo não foi encontrado.` });
        }


        const rota = JSON.parse(voo.rota);
        const bateriaConsumida = calcularBateriaConsumida(rota);

        console.log('[DIAGNÓSTICO DA FUNÇÃO FINALIZAR VOO]');
        console.log('Objeto Drone encontrado:', drone);
        console.log('Valor de drone.bateria:', drone.bateria);
        console.log('Valor de bateriaConsumida:', bateriaConsumida);

        const bateriaRestante = Math.max(0, drone.bateria - bateriaConsumida);

        const idsPedidos = JSON.parse(voo.lista_de_pedidos);
        const placeholders = idsPedidos.map(() => '?').join(',');

        // Atualiza status do drone, bateria, voo e pedidos
        await dbRun("UPDATE drones SET status = 'Idle', bateria = ? WHERE id = ?", [bateriaRestante, voo.drone_id]);
        await dbRun("UPDATE voos SET status = 'Concluido' WHERE id = ?", [id]);
        await dbRun(`UPDATE pedidos SET status = 'Entregue' WHERE id IN (${placeholders})`, [...idsPedidos]);

        res.status(200).json({ message: `Voo #${id} finalizado. Drone #${voo.drone_id} retornou à base com ${bateriaRestante}% de bateria.` });
    } catch (error) {
        console.error('ERRO DETALHADO AO FINALIZAR VOO:', error); 
        res.status(500).json({ error: 'Erro ao finalizar o voo: ' + error.message });
    }
};
// Função para listar todos os voos e suas rotas
exports.listarVoos = async (req, res) => {
    // Pega o parâmetro 'status' da URL (ex: /voos?status=actionable)
    const { status } = req.query; 
    
    let sql = 'SELECT * FROM voos';

    // Se o parâmetro for 'actionable', adiciona um filtro na query SQL
    if (status === 'actionable') {
        sql += " WHERE status = 'Pendente' OR status = 'Em andamento'";
    }

    sql += ' ORDER BY id DESC';

    try {
        const voos = await dbAll(sql);
        const voosFormatados = voos.map(voo => ({
            ...voo,
            lista_de_pedidos: JSON.parse(voo.lista_de_pedidos),
            rota: JSON.parse(voo.rota)
        }));
        res.status(200).json(voosFormatados);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao listar os voos: ' + error.message });
    }
};