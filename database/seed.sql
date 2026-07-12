INSERT INTO users (name, email, password_hash, role) VALUES
('Admin Guard', 'admin@guardstudy.local', '$2y$10$wJ9wBRB.7qG2r6pglvJ7QOzLme25Ge5aPrlh2uXPhn5J21.zlUKGm', 'admin'),
('Maria Clara', 'maria@guardstudy.local', '$2y$10$wJ9wBRB.7qG2r6pglvJ7QOzLme25Ge5aPrlh2uXPhn5J21.zlUKGm', 'user');

INSERT INTO topics (user_id, name, description, status) VALUES
(2, 'PHP 8 e POO', 'Classes, objetos, tipagem e excecoes.', 'ativo'),
(2, 'PDO e MySQL', 'Conexao, prepared statements e repositorios.', 'ativo'),
(2, 'APIs REST', 'Rotas, status HTTP e respostas JSON.', 'ativo');

INSERT INTO study_logs (user_id, topic_id, title, content, duration_minutes, studied_at) VALUES
(2, 1, 'Revisao de classes', 'Criei exemplos com construtores e propriedades readonly.', 50, '2026-07-06'),
(2, 2, 'Prepared statements', 'Pratiquei INSERT, UPDATE e SELECT usando parametros nomeados.', 45, '2026-07-07');

INSERT INTO checkpoints (user_id, topic_id, study_log_id, title, description, is_completed, completed_at) VALUES
(2, 1, 1, 'Explicar encapsulamento', 'Conseguir explicar public, private e readonly com exemplo.', 1, '2026-07-06 18:00:00'),
(2, 2, 2, 'Criar CRUD REST', 'Implementar rotas GET, POST, PUT e DELETE com Slim.', 0, NULL);

INSERT INTO mistakes (user_id, study_log_id, checkpoint_id, title, description, correction, is_reviewed, reviewed_at) VALUES
(2, 2, 2, 'Esqueci o execute', 'Preparei a query mas nao executei antes do fetch.', 'Sempre chamar execute com os parametros antes de ler o resultado.', 0, NULL);

INSERT INTO review_schedules (user_id, study_log_id, checkpoint_id, mistake_id, title, scheduled_for, status, notes) VALUES
(2, 1, 1, NULL, 'Revisar encapsulamento', '2026-07-13', 'pending', 'Rever explicacao e escrever exemplo curto.'),
(2, 2, 2, 1, 'Revisar prepared statements', '2026-07-14', 'pending', 'Refazer um CRUD simples usando execute.');
