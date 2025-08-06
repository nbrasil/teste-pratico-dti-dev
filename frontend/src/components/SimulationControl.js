import React, { useState } from 'react';
import api from '../services/api';
import './SimulationControl.css';

function SimulationControl({ onSimulationComplete, onClear }) {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleStartSimulation = async () => {
        setIsLoading(true);
        setMessage('Alocando entregas...');
        
        try {
            // 1. Aciona o algoritmo de alocação no backend
            const alocacaoResponse = await api.post('/entregas/alocar');
            setMessage(alocacaoResponse.data.message || 'Alocação concluída. Buscando rotas...');
            
            // 2. Busca os voos que foram criados
            const voosResponse = await api.get('/voos');
            
            // 3. Passa os dados dos voos para o componente pai (App.js)
            onSimulationComplete(voosResponse.data);
            
        } catch (error) {
            console.error('Erro ao iniciar a simulação:', error);
            setMessage('Falha na simulação.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="simulation-control-container">
            <button onClick={handleStartSimulation} disabled={isLoading}>
                {isLoading ? 'Processando...' : 'Iniciar Simulação e Planejar Rotas'}
            </button>
            <button onClick={onClear} className="clear-button">Limpar Rotas</button>
            {message && <p className="simulation-message">{message}</p>}
        </div>
    );
}

export default SimulationControl;