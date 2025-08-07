const { calcularDistanciaTotalRota } = require('./geometry');

describe('Testes para Cálculos de Geometria', () => {
    it('deve retornar 0 para uma rota vazia', () => {
        expect(calcularDistanciaTotalRota([])).toBe(0);
    });

    it('deve calcular corretamente a distância de ida e volta para um único ponto', () => {
        const rota = [{ localizacao_x: 3, localizacao_y: 4 }];
        // Distância de Manhattan: (3-0)+(4-0) = 7. Ida e volta = 14.
        expect(calcularDistanciaTotalRota(rota)).toBe(14);
    });

    it('deve funcionar com objetos de rota {x, y}', () => {
        const rota = [{ x: 5, y: 12 }];
        // Distância: (5-0)+(12-0) = 17. Ida e volta = 34.
        expect(calcularDistanciaTotalRota(rota)).toBe(34);
    });
});