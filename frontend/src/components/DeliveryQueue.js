
import React from 'react'; 
import './DeliveryQueue.css';

function DeliveryQueue({ queue }) {
    // Se a fila estiver vazia ou não for um array, mostra uma mensagem
    if (!queue || queue.length === 0) {
        return (
            <div className="queue-container">
                <h2>Fila de Pedidos Pendentes</h2>
                <p>Nenhum pedido na fila.</p>
            </div>
        );
    }

    return (
        <div className="queue-container">
            <h2>Fila de Pedidos Pendentes</h2>
            <ul>
                {queue.map(item => (
                    <li key={item.id} className={`prioridade-${item.prioridade.toLowerCase()}`}>
                        <strong>Pedido #{item.id}</strong> - Destino: ({item.localizacao_x},{item.localizacao_y}), Peso: {item.peso_kg}kg
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default DeliveryQueue;