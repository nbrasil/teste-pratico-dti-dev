const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Define o caminho para o arquivo do banco de dados
const dbPath = path.resolve(__dirname, 'database.sqlite');

// Cria uma nova instância do banco de dados, que cria o arquivo se não existir
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao abrir o banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
        // serialize para garantir que os comandos sejam executados em ordem
        db.serialize(() => {
            // Cria a tabela de Drones se ela não existir
            db.run(`
                CREATE TABLE IF NOT EXISTS drones (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    capacidade_kg REAL NOT NULL,
                    alcance_km REAL NOT NULL,
                    status TEXT NOT NULL CHECK(status IN ('Idle', 'Carregando', 'Em voo', 'Entregando', 'Retornando')),
                    bateria INTEGER NOT NULL
                )
            `, (err) => {
                if (err) {
                    console.error('Erro ao criar tabela drones:', err.message);
                } else {
                    console.log('Tabela "drones" pronta.');
                }
            });
            db.run(`
                CREATE TABLE IF NOT EXISTS pedidos (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    localizacao_x INTEGER NOT NULL,
                    localizacao_y INTEGER NOT NULL,
                    peso_kg REAL NOT NULL,
                    prioridade TEXT NOT NULL CHECK(prioridade IN ('baixa', 'media', 'alta')),
                    status TEXT NOT NULL CHECK(status IN ('Aguardando', 'Alocado', 'Em transito', 'Entregue')),
                    data_pedido TEXT NOT NULL
                )
            `, (err) => {
                if (err) {
                    console.error('Erro ao criar tabela pedidos:', err.message);
                } else {
                    console.log('Tabela "pedidos" pronta.');
                }
            });
            db.run(`
                CREATE TABLE IF NOT EXISTS voos (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    drone_id INTEGER,
                    lista_de_pedidos TEXT,
                    rota TEXT,
                    tempo_estimado_minutos INTEGER,
                    status TEXT NOT NULL CHECK(status IN ('Pendente', 'Em andamento', 'Concluido')),
                    FOREIGN KEY (drone_id) REFERENCES drones (id)
                )
            `, (err) => {
                if (err) {
                    console.error('Erro ao criar tabela voos:', err.message);
                } else {
                    console.log('Tabela "voos" pronta.');
                }
            });
            db.run(`
                CREATE TABLE IF NOT EXISTS obstaculos (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    nome TEXT NOT NULL,
                    x INTEGER NOT NULL,
                    y INTEGER NOT NULL,
                    raio INTEGER NOT NULL
                )
            `);
            // --- INSERÇÃO DOS DADOS FIXOS (SEEDING) ---
            console.log('Populando banco de dados com dados iniciais...');

            // Inserir 3 Drones Padrão
            const dronesStmt = db.prepare("INSERT OR IGNORE INTO drones (id, capacidade_kg, alcance_km, status, bateria) VALUES (?, ?, ?, ?, ?)");
            dronesStmt.run(1, 0.5, 10, 'Idle', 100); // Drone pequeno e rápido
            dronesStmt.run(2, 1.5, 25, 'Idle', 100); // Drone de médio porte
            dronesStmt.run(3, 2.0, 40, 'Idle', 100); // Drone de carga pesada e longo alcance
            dronesStmt.finalize();

            // Inserir 2 Obstáculos Padrão
            const obstaculosStmt = db.prepare("INSERT OR IGNORE INTO obstaculos (id, nome, x, y, raio) VALUES (?, ?, ?, ?, ?)");
            obstaculosStmt.run(1, 'Mineirão', 80, 80, 15);
            obstaculosStmt.run(2, 'Edifício DTI', -50, -30, 10);
            obstaculosStmt.run(3, 'Aeroporto da Pampulha', 20, 20, 20);
            obstaculosStmt.finalize();

            console.log('Banco de dados pronto.');

        });
    }
});

module.exports = db;