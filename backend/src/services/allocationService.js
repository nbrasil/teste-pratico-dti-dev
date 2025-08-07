const { dbAll, dbRun } = require('../database/db-helpers');
const { calcularDistanciaTotalRota } = require('../utils/geometry');

const VELOCIDADE_DRONE_KMH = 40; 

async function alocarVoos() {
    console.log('Iniciando processo de alocação de voos...');

    const dronesOciosos = await dbAll("SELECT * FROM drones WHERE status = 'Idle'");
    const pedidosAguardando = await dbAll(`
        SELECT * FROM pedidos WHERE status = 'Aguardando'
        ORDER BY CASE prioridade WHEN 'alta' THEN 1 WHEN 'media' THEN 2 WHEN 'baixa' THEN 3 END, data_pedido ASC
    `);
    const obstaculos = await dbAll("SELECT * FROM obstaculos");

    if (dronesOciosos.length === 0 || pedidosAguardando.length === 0) {
        return { message: 'Sem drones ou pedidos para alocar.' };
    }

    const pedidosAlocados = new Set();
    let voosCriados = 0;

    for (const drone of dronesOciosos) {
        let cargaAtual = [];
        let pesoCargaAtual = 0;

        for (const pedido of pedidosAguardando) {
            if (pedidosAlocados.has(pedido.id)) continue;

            const cargaTemporaria = [...cargaAtual, pedido];

            let rotaValida = true;
            for (const ponto of cargaTemporaria) {
                for (const obs of obstaculos) {
                    const distancia = Math.sqrt(Math.pow(ponto.localizacao_x - obs.x, 2) + Math.pow(ponto.localizacao_y - obs.y, 2));
                    if (distancia < obs.raio) {
                        rotaValida = false;
                        break;
                    }
                }
                if (!rotaValida) break;
            }

            if (!rotaValida) continue;
            
            if (pesoCargaAtual + pedido.peso_kg <= drone.capacidade_kg) {
                const distanciaTemporaria = calcularDistanciaTotalRota(cargaTemporaria);
                if (distanciaTemporaria <= drone.alcance_km) {
                    cargaAtual.push(pedido);
                    pesoCargaAtual += pedido.peso_kg;
                    pedidosAlocados.add(pedido.id);
                }
            }
        }

        if (cargaAtual.length > 0) {
            voosCriados++;
            const idsPedidos = cargaAtual.map(p => p.id);
            const rota = cargaAtual.map(p => ({ x: p.localizacao_x, y: p.localizacao_y }));
            
           
            console.log("\n================= INÍCIO DO DIAGNÓSTICO DE VOO =================");
            
            const distanciaTotal = calcularDistanciaTotalRota(cargaAtual);
            console.log(`[ETAPA 1] Pedidos neste voo: ${JSON.stringify(idsPedidos)}`);
            console.log(`[ETAPA 2] Distância Total Calculada: ${distanciaTotal} (tipo: ${typeof distanciaTotal})`);
            console.log(`[ETAPA 3] Velocidade do Drone (Constante): ${VELOCIDADE_DRONE_KMH} (tipo: ${typeof VELOCIDADE_DRONE_KMH})`);

            const tempoEstimadoHoras = distanciaTotal / VELOCIDADE_DRONE_KMH;
            console.log(`[ETAPA 4] Tempo em Horas (bruto): ${tempoEstimadoHoras} (tipo: ${typeof tempoEstimadoHoras})`);
            
            const tempoEstimadoMinutos = Math.round(tempoEstimadoHoras * 60);
            console.log(`[ETAPA 5] Tempo em Minutos (final): ${tempoEstimadoMinutos} (tipo: ${typeof tempoEstimadoMinutos})`);

            if (isNaN(tempoEstimadoMinutos)) {
                console.error("[ERRO FATAL] O valor de 'tempoEstimadoMinutos' é NaN. O voo será salvo com tempo NULL.");
            }
            console.log("================= FIM DO DIAGNÓSTICO DE VOO =================\n");
            

            await dbRun(
                "INSERT INTO voos (drone_id, lista_de_pedidos, rota, status, tempo_estimado_minutos) VALUES (?, ?, ?, ?, ?)",
                [drone.id, JSON.stringify(idsPedidos), JSON.stringify(rota), 'Pendente', tempoEstimadoMinutos]
            );
            
            await dbRun("UPDATE drones SET status = ? WHERE id = ?", ['Carregando', drone.id]);
            const placeholders = idsPedidos.map(() => '?').join(',');
            await dbRun(`UPDATE pedidos SET status = ? WHERE id IN (${placeholders})`, ['Alocado', ...idsPedidos]);
        }
    }

    return { message: `Alocação concluída. ${voosCriados} voos foram criados.` };
}

module.exports = { alocarVoos };