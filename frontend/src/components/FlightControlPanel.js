import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import './FlightControlPanel.css';

function FlightControlPanel() {
    const [flights, setFlights] = useState([]);

    const fetchActionableFlights = useCallback(async () => {
        try {
            const response = await api.get('/voos?status=actionable');
            setFlights(response.data);
        } catch (error) {
            console.error("Erro ao buscar voos acionáveis:", error);
            toast.error("Não foi possível carregar os voos.");
        }
    }, []);

    useEffect(() => {
        fetchActionableFlights();
        const intervalId = setInterval(fetchActionableFlights, 10000); // Atualiza a lista a cada 10s
        return () => clearInterval(intervalId);
    }, [fetchActionableFlights]);

    const handleIniciarVoo = async (flightId) => {
        try {
            await api.post(`/voos/${flightId}/iniciar`);
            toast.success(`Voo #${flightId} iniciado!`);
            fetchActionableFlights(); // Atualiza a lista imediatamente
        } catch (error) {
            toast.error(`Erro ao iniciar voo #${flightId}.`);
        }
    };

    const handleFinalizarVoo = async (flightId) => {
        
        console.log(`[PROVA REAL] Tentando finalizar voo #${flightId} com o método POST.`);
    
        try {
            await api.post(`/voos/${flightId}/finalizar`);
            toast.success(`Voo #${flightId} finalizado com sucesso!`);
            fetchActionableFlights();
        } catch (error) {
            console.error('Erro detalhado ao finalizar voo:', error); 
            toast.error(`Erro ao finalizar voo #${flightId}.`);
        }
    };

    return (
        <div className="flight-panel-container">
            <h3>Painel de Controle de Voos</h3>
            <div className="flight-list">
                {flights.length === 0 ? (
                    <p>Nenhum voo pendente ou em andamento.</p>
                ) : (
                    flights.map(voo => (
                        <div className="flight-card" key={voo.id}>
                            <div className="flight-info">
                                <strong>Voo #{voo.id}</strong> (Drone #{voo.drone_id})
                                <span className={`status-badge status-${voo.status.toLowerCase()}`}>{voo.status}</span>
                            </div>
                            <div className="flight-actions">
                                {voo.status === 'Pendente' && (
                                    <button onClick={() => handleIniciarVoo(voo.id)} className="start-btn">Iniciar Voo</button>
                                )}
                                {voo.status === 'Em andamento' && (
                                    <button type="button" onClick={() => handleFinalizarVoo(voo.id)} className="end-btn">Finalizar Voo</button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default FlightControlPanel;