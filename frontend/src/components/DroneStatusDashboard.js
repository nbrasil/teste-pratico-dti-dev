// src/components/DroneStatusDashboard.js
import React, { useState, useEffect } from 'react';
import './DroneStatusDashboard.css';
import api from '../services/api';


function DroneStatusDashboard() {
    // array vazio
    const [drones, setDrones] = useState([]);
    // useEffect para buscar dados quando o componente monta e depois periodicamente
    useEffect(() => {
        const fetchDrones = async () => {
            try {
                const response = await api.get('/drones/status');
                setDrones(response.data);
            } catch (error) {
                console.error('Erro ao buscar status dos drones:', error);
            }
        };

        fetchDrones(); // Busca inicial

        // Configura um intervalo para buscar os dados a cada 5 segundos
        const intervalId = setInterval(fetchDrones, 5000);

        // Função de limpeza: O React executa isso quando o componente "desmonta"

        // Isso previne vazamentos de memória e bugs.

        return () => clearInterval(intervalId);

    }, []); // O array vazio [] garante que o useEffect rode apenas uma vez na montagem

    // Função auxiliar para obter a cor do status
    const getStatusColor = (status) => {
        switch (status) {
            case 'Idle': return 'green';
            case 'Em voo': return 'blue';
            case 'Retornando': return 'orange';
            case 'Carregando': return 'purple';
            default: return 'gray';
        }
    };

    return (
        <div className="dashboard-container">
            <h2>Status dos Drones</h2>
            <div className="drones-list">
                {drones.map(drone => (
                    <div className="drone-card" key={drone.id}>
                        <h3>Drone #{drone.id}</h3>
                        <p>
                            Status: <span style={{ color: getStatusColor(drone.status), fontWeight: 'bold' }}>
                                {drone.status}
                            </span>
                        </p>
                        <p>Bateria: {drone.bateria}%</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DroneStatusDashboard;