
import React, { useState } from 'react';
import './PedidoForm.css';
import api from '../services/api'; 
import { toast } from 'react-toastify';

// prop onPedidoCriado para notificar o componente pai
function PedidoForm({ onPedidoCriado }) { 
    const [localizacaoX, setLocalizacaoX] = useState('');
    const [localizacaoY, setLocalizacaoY] = useState('');
    const [peso, setPeso] = useState('');
    const [prioridade, setPrioridade] = useState('baixa');

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        const novoPedido = {
            localizacao_x: parseInt(localizacaoX),
            localizacao_y: parseInt(localizacaoY),
            peso_kg: parseFloat(peso),
            prioridade: prioridade,
        };

        
        try {
            await api.post('/pedidos', novoPedido); 
            toast.success('Pedido criado com sucesso!');
            
            // Limpa o formulário
            setLocalizacaoX('');
            setLocalizacaoY('');
            setPeso('');
            setPrioridade('baixa');

            // Notifica o componente pai que um novo pedido foi criado
            if (onPedidoCriado) {
                onPedidoCriado();
            }

        } catch (error) {
            console.error('Erro ao criar pedido:', error);
            if (error.response && error.response.data && error.response.data.error) {
                // Exibe a mensagem de erro vinda diretamente da API
                toast.error(error.response.data.error);
            } else {
                // Se for um erro genérico (ex: rede caiu), exibe uma mensagem padrão
                toast.error('Falha ao criar o pedido. Verifique sua conexão.');
            }
            toast.error('Falha ao criar o pedido. Verifique o console para mais detalhes.');
        }
    };

    
    return (
        <div className="pedido-form-container">
            <h2>Criar Novo Pedido</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Localização X:</label>
                    <input 
                        type="number" 
                        value={localizacaoX} 
                        onChange={(e) => setLocalizacaoX(e.target.value)}
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Localização Y:</label>
                    <input 
                        type="number" 
                        value={localizacaoY} 
                        onChange={(e) => setLocalizacaoY(e.target.value)}
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Peso (kg):</label>
                    <input 
                        type="number"
                        step="0.1"
                        value={peso} 
                        onChange={(e) => setPeso(e.target.value)}
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Prioridade:</label>
                    <select value={prioridade} onChange={(e) => setPrioridade(e.target.value)}>
                        <option value="baixa">Baixa</option>
                        <option value="media">Média</option>
                        <option value="alta">Alta</option>
                    </select>
                </div>
                <button type="submit">Enviar Pedido</button>
            </form>
        </div>
    );
}

export default PedidoForm;