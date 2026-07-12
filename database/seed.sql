INSERT INTO users (name, email, password_hash, role) VALUES
('Admin Guard', 'admin@guardstudy.local', '$2y$10$Xn5tRFUG79MQ3GTseTLnXOHe4R580qL/kFWiQxn8n9BDbNoAtWXxa', 'admin'),
('Fukano Manager', 'fukano@guardstudy.local', '$2y$10$Xn5tRFUG79MQ3GTseTLnXOHe4R580qL/kFWiQxn8n9BDbNoAtWXxa', 'manager'),
('Maria Clara', 'maria@guardstudy.local', '$2y$10$Xn5tRFUG79MQ3GTseTLnXOHe4R580qL/kFWiQxn8n9BDbNoAtWXxa', 'user');

INSERT INTO projects (user_id, name, description, repository_url, project_url, notes, status) VALUES
(2, 'Guard Study API', 'API principal do sistema de estudos.', 'https://github.com/mariaclaramonteirop/guard-study', 'https://guard-study.example.com', '## Anotações\\n- Backend com Slim 4\\n- Front em React\\n- Relacionado com os módulos de estudo', 'ativo');

INSERT INTO topics (user_id, project_id, name, description, status) VALUES
(2, 1, 'PHP 8 e POO', 'Classes, objetos, tipagem e excecoes.', 'ativo'),
(2, 1, 'PDO e MySQL', 'Conexao, prepared statements e repositorios.', 'ativo'),
(2, 1, 'APIs REST', 'Rotas, status HTTP e respostas JSON.', 'ativo');

INSERT INTO study_logs (user_id, project_id, topic_id, title, content, duration_minutes, studied_at) VALUES
(2, 1, 1, 'Revisao de classes', 'Criei exemplos com construtores e propriedades readonly.', 50, '2026-07-06'),
(2, 1, 2, 'Prepared statements', 'Pratiquei INSERT, UPDATE e SELECT usando parametros nomeados.', 45, '2026-07-07');

INSERT INTO checkpoints (user_id, project_id, topic_id, study_log_id, mistake_id, review_schedule_id, title, description, is_completed, completed_at) VALUES
(2, 1, 1, 1, NULL, NULL, 'Explicar encapsulamento', 'Conseguir explicar public, private e readonly com exemplo.', 1, '2026-07-06 18:00:00'),
(2, 1, 2, 2, NULL, NULL, 'Criar CRUD REST', 'Implementar rotas GET, POST, PUT e DELETE com Slim.', 0, NULL);

INSERT INTO mistakes (user_id, project_id, study_log_id, checkpoint_id, title, description, correction, is_reviewed, reviewed_at) VALUES
(2, 1, 2, 2, 'Esqueci o execute', 'Preparei a query mas nao executei antes do fetch.', 'Sempre chamar execute com os parametros antes de ler o resultado.', 0, NULL);

INSERT INTO review_schedules (user_id, project_id, study_log_id, checkpoint_id, mistake_id, title, scheduled_for, status, notes) VALUES
(2, 1, 1, 1, NULL, 'Revisar encapsulamento', '2026-07-13', 'pending', 'Rever explicacao e escrever exemplo curto.'),
(2, 1, 2, 2, 1, 'Revisar prepared statements', '2026-07-14', 'pending', 'Refazer um CRUD simples usando execute.');

UPDATE checkpoints SET mistake_id = 1, review_schedule_id = 1 WHERE id = 1;
UPDATE checkpoints SET review_schedule_id = 2 WHERE id = 2;

INSERT INTO study_sessions (user_id, project_id, topic_id, study_log_id, title, timer_mode, planned_minutes, pause_minutes, actual_minutes, status, started_at, ended_at, notes) VALUES
(2, 1, 1, 1, 'Sessao Pomodoro inicial', 'pomodoro', 25, NULL, 25, 'completed', '2026-07-06 17:00:00', '2026-07-06 17:25:00', 'Sessao curta para validar o timer.');

INSERT INTO study_goals (user_id, project_id, title, description, target_minutes, target_sessions, reward_title, reward_points, status, achieved_at, notes) VALUES
(2, 1, 'Completar 300 minutos em PHP', 'Focar em POO, Slim e repositorios até completar a meta.', 300, 6, 'Pausa especial de 1 hora', 50, 'active', NULL, 'Meta pessoal de curto prazo.'),
(2, NULL, 'Ler 4 artigos de arquitetura', 'Meta sem projeto para revisar fundamentos.', 180, 4, 'Capitulo extra de leitura', 30, 'paused', NULL, 'Pode ser retomada depois.');

INSERT INTO rewards (user_id, goal_id, title, description, points, kind, status, unlocked_at, claimed_at, notes) VALUES
(2, 1, 'Bingo do PHP', 'Liberado quando bater a meta principal de PHP.', 50, 'badge', 'locked', NULL, NULL, 'Recompensa vinculada à meta principal.'),
(2, NULL, 'Fim de semana livre', 'Recompensa pessoal depois de uma semana consistente.', 20, 'bonus', 'unlocked', '2026-07-10 10:00:00', NULL, 'Pendente de resgate.');

INSERT INTO checklist_items (user_id, study_log_id, title, is_completed) VALUES
(2, 1, 'Ler resumao da aula', 1),
(2, 1, 'Refazer exemplo de classe', 0),
(2, 2, 'Escrever INSERT com bind', 0);
