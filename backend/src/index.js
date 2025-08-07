const express = require('express');
const cors = require('cors');
// Importa a configuração do banco de dados para inicializá-lo
require('./database/db'); 

// código básico do Express para criar o servidor e fazê-lo "escutar" por requisições.
const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares essenciais
app.use(cors()); // Permite que o frontend acesse a API
app.use(express.json()); // Permite que a API entenda requisições com corpo em JSON

// Rotas 
const droneRoutes = require('./routes/droneRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');
const entregaRoutes = require('./routes/entregaRoutes');
const vooRoutes = require('./routes/vooRoutes');
const obstaculoRoutes = require('./routes/obstaculoRoutes');

app.use('/api', obstaculoRoutes);
app.use('/api', vooRoutes);
app.use('/api', entregaRoutes);
app.use('/api', droneRoutes);
app.use('/api', pedidoRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});