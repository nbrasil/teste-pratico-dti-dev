
import axios from 'axios';

// Cria uma instância do axios com a URL base da nossa API
const api = axios.create({
    baseURL: 'http://localhost:3001/api' // A porta deve ser a mesma do seu backend
});

export default api;