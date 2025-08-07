import React from 'react';
import './RouteMap.css';

// Cores para diferenciar as rotas dos drones
const ROUTE_COLORS = ['#3498db', '#e74c3c', '#2ecc71', '#f1c40f', '#9b59b6', '#1abc9c'];

function RouteMap({ voos = [], obstaculos = []  }) {
    //  tamanho da "caixa de visualização" para o SVG.
    // Isso cria um plano cartesiano com o centro em (0,0).
    const viewBox = "-100 -100 200 200";

    return (
        <div className="route-map-container">
            <h3>Mapa de Rotas</h3>
            <svg viewBox={viewBox} className="route-map-svg">

                {obstaculos.map(obs => (
                    <g key={`obs-${obs.id}`}>
                        <circle 
                            cx={obs.x}
                            cy={obs.y}
                            r={obs.raio}
                            className="obstacle-zone"
                        />
                        <text x={obs.x} y={obs.y} className="obstacle-text">{obs.nome}</text>
                    </g>
                ))}

                {/* Eixo X e Y para referência */}
                <line x1="-100" y1="0" x2="100" y2="0" className="axis" />
                <line x1="0" y1="-100" x2="0" y2="100" className="axis" />

                {/* Ponto da Base (0,0) */}
                <circle cx="0" cy="0" r="3" className="base-point" />
                <text x="5" y="5" className="base-text">Base</text>

                {/* Mapeia cada voo para desenhar sua rota e pontos de entrega */}
                {voos.map((voo, index) => {
                    if (!voo.rota || voo.rota.length === 0) return null;

                    // Constrói a string de pontos para a polyline: "x1,y1 x2,y2 ..."
                    const rotaPoints = voo.rota.map(p => `${p.x},${p.y}`).join(' ');
                    const fullPath = `0,0 ${rotaPoints} 0,0`;
                    const color = ROUTE_COLORS[index % ROUTE_COLORS.length];

                    return (
                        <g key={voo.id} className="route-group">
                            {/* Desenha a linha da rota */}
                            <polyline
                                points={fullPath}
                                style={{ stroke: color }}
                                className="route-line"
                            />
                            
                            {/* Desenha um círculo para cada ponto de entrega */}
                            {voo.rota.map((ponto, pIndex) => (
                                <circle
                                    key={`${voo.id}-${pIndex}`}
                                    cx={ponto.x}
                                    cy={ponto.y}
                                    r="2"
                                    style={{ fill: color }}
                                    className="delivery-point"
                                />
                            ))}
                            <text 
                                x={voo.rota[0].x} 
                                y={voo.rota[0].y - 5} // Posição um pouco acima do primeiro ponto
                                className="route-info-text"
                            >
                                Voo #{voo.id} (~{voo.tempo_estimado_minutos} min)
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}

export default RouteMap;