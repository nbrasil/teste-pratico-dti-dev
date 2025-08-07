const VELOCIDADE_DRONE_KMH = 40;
// A base da logística sempre começa em (0,0)
const PONTO_BASE = { x: 0, y: 0 };

/**
 * Calcula a distância de Manhattan entre dois pontos.
 * @param {{x: number, y: number}} pontoA
 * @param {{x: number, y: number}} pontoB
 * @returns {number}
 */
function calcularDistanciaManhattan(pontoA, pontoB) {
    return Math.abs(pontoA.x - pontoB.x) + Math.abs(pontoA.y - pontoB.y);
}

/**
 * Calcula a distância total de uma rota, partindo da base,
 * passando por todos os pedidos e retornando à base.
 * @param {Array<{localizacao_x: number, localizacao_y: number}>} pedidos
 * @returns {number}
 */

function calcularDistanciaTotalRota(pontos){
    if (!pontos || pontos.length === 0) {
        return 0;
    }

    let distanciaTotal = 0;
    let pontoAtual = PONTO_BASE;

    for (const ponto of pontos) {
        // Verifica se o objeto tem 'localizacao_x' (vindo de um pedido) ou apenas 'x' (vindo de uma rota)
        const proximoPonto = {
            x: ponto.localizacao_x !== undefined ? ponto.localizacao_x : ponto.x,
            y: ponto.localizacao_y !== undefined ? ponto.localizacao_y : ponto.y
        };

        // verificação de segurança para o caso de o ponto ser inválido
        if (proximoPonto.x === undefined || proximoPonto.y === undefined) {
            console.error('Ponto inválido encontrado na rota:', ponto);
            return NaN; // Retorna NaN para deixar o erro claro se algo der muito errado
        }

        distanciaTotal += calcularDistanciaManhattan(pontoAtual, proximoPonto);
        pontoAtual = proximoPonto;
    }

    // Adiciona a distância do último pedido de volta para a base
    distanciaTotal += calcularDistanciaManhattan(pontoAtual, PONTO_BASE);

    return distanciaTotal;
};
const CONSUMO_BATERIA_POR_KM = 0.2; // 0.2% de bateria por km percorrido

/**
 * Calcula o gasto de bateria para uma determinada rota.
 * @param {Array<{localizacao_x: number, localizacao_y: number}>} rota
 * @returns {number}
 */
function calcularBateriaConsumida(rota) {
    const distanciaTotal = calcularDistanciaTotalRota(rota);
    return Math.round(distanciaTotal * CONSUMO_BATERIA_POR_KM);
};

module.exports = {
    calcularDistanciaTotalRota,
    calcularBateriaConsumida,
    VELOCIDADE_DRONE_KMH
};