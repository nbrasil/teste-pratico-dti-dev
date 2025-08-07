# Simulador de Logística de Drones
Este é um projeto full-stack que simula um sistema de logística para entregas urbanas utilizando drones. A aplicação consiste em um backend Node.js que gerencia a lógica de alocação de pacotes e um frontend em React que oferece uma interface para criar pedidos e visualizar as operações em tempo real.

# ✨ Funcionalidades
Criação de Pedidos: Interface para cadastrar novos pedidos com localização, peso e prioridade.

Algoritmo de Alocação Inteligente: O backend agrupa pacotes em voos otimizados, respeitando a capacidade de peso e o alcance de cada drone, e priorizando as entregas mais urgentes.

Simulação de Ciclo de Vida: Controle para iniciar e finalizar voos, com atualização de status em tempo real para drones e pedidos.

Visualização de Rotas: Um mapa 2D que exibe as rotas planejadas para cada voo, incluindo a base, pontos de entrega e zonas de exclusão (obstáculos).

Cálculos Dinâmicos: Simulação de consumo de bateria e estimativa de tempo de entrega com base na distância da rota.

Validação de Negócio: O sistema impede o cadastro de pedidos em localizações que colidem com obstáculos pré-definidos.

Teste unitário: em geometry.js, testando o cálculo das rotas.

# 🛠️ Tecnologias Utilizadas
Backend:

Node.js: Ambiente de execução JavaScript no servidor.

Express.js: Framework para a construção da API RESTful.

SQLite: Banco de dados relacional leve e baseado em arquivo.

CORS: Middleware para habilitar requisições entre o frontend e o backend.

Nodemon: Para reiniciar o servidor automaticamente durante o desenvolvimento.

Frontend:

React: Biblioteca para a construção da interface de usuário.

Axios: Cliente HTTP para comunicação com a API do backend.

React Toastify: Para exibir notificações elegantes na interface.

CSS: Estilização com abordagem "Mobile-First" para responsividade.

# 📁 Estrutura do Repositório
Este é um monorepo, contendo as duas partes da aplicação na mesma estrutura de pastas:

/backend: Contém toda a lógica do servidor, API e banco de dados.

/frontend: Contém toda a aplicação React e a interface do usuário.

# 🚀 Como Rodar o Projeto Localmente
Siga os passos abaixo para configurar e executar a aplicação na sua máquina.

Pré-requisitos
Node.js (versão 16 ou superior)

npm (geralmente instalado com o Node.js)

1. Clonando o Repositório

git clone https://github.com/nbrasil/teste-pratico-dti-dev.git
cd teste-pratico-dti-dev.git

2. Configuração do Backend

# 1. Navegue para a pasta do backend
cd backend

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
O servidor do backend estará rodando em http://localhost:3001.

3. Configuração do Frontend
Abra um novo terminal para executar os seguintes comandos.

# 1. Navegue para a pasta do frontend a partir da raiz do projeto
cd frontend

# 2. Instale as dependências
npm install

# 3. Crie o arquivo de ambiente
# Crie um arquivo chamado .env na raiz da pasta /frontend
# e adicione a seguinte linha dentro dele:
REACT_APP_API_BASE_URL=http://localhost:3001/api

# 4. Inicie a aplicação React
npm start
A aplicação frontend estará disponível em http://localhost:3000 e se conectará automaticamente ao backend.