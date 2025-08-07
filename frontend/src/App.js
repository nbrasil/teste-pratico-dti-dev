
import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import PedidoForm from './components/PedidoForm';
import DroneStatusDashboard from './components/DroneStatusDashboard';
import DeliveryQueue from './components/DeliveryQueue';
import SimulationControl from './components/SimulationControl'; 
import RouteMap from './components/RouteMap'; 
import api from './services/api';
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import FlightControlPanel from './components/FlightControlPanel'; 


function App() {
  const [queue, setQueue] = useState([]);
  const [voos, setVoos] = useState([]); 
  const [obstaculos, setObstaculos] = useState([]);

  const fetchPedidos = useCallback(async () => {
    try {
      const response = await api.get('/pedidos');
      setQueue(response.data);
    } catch (error) {
      console.error("Erro ao buscar a fila de pedidos:", error);
    }
  }, []);

  const fetchObstaculos = useCallback(async () => {
    try {
      const response = await api.get('/obstaculos');
      setObstaculos(response.data);
    } catch (error) {
      console.error("Erro ao buscar os obstáculos:", error);
    }
  }, []);

 
  useEffect(() => {
    fetchPedidos();
    fetchObstaculos(); 
  }, [fetchPedidos, fetchObstaculos]);

  useEffect(() => {
    fetchPedidos();
  }, [fetchPedidos]);

  // Função para ser chamada quando a simulação terminar
  const handleSimulationComplete = (voosData) => {
    setVoos(voosData);
    fetchPedidos(); // Atualiza a fila de pedidos também
  };

  const handleClearRoutes = () => {
    setVoos([]); // Limpa as rotas do mapa
  };

  return (
    <div className="App">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />
      <header className="App-header">
        <h1>Dashboard de Logística de Drones</h1>
      </header>
      <main className="main-container">
        <div className="left-panel">
          <PedidoForm onPedidoCriado={fetchPedidos} />
          <DeliveryQueue queue={queue} />
        </div>
        <div className="right-panel">
          <SimulationControl onSimulationComplete={handleSimulationComplete} onClear={handleClearRoutes} />
          <FlightControlPanel />
          <RouteMap voos={voos} obstaculos={obstaculos}/>
          <DroneStatusDashboard />
        </div>
      </main>
    </div>
  );
}

export default App;