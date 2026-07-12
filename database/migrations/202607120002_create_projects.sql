CREATE TABLE IF NOT EXISTS projects (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NULL,
  name VARCHAR(160) NOT NULL,
  description TEXT NULL,
  repository_url VARCHAR(255) NULL,
  project_url VARCHAR(255) NULL,
  notes TEXT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'ativo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_projects_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE topics
  ADD COLUMN project_id INT UNSIGNED NULL AFTER user_id,
  ADD CONSTRAINT fk_topics_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL;

ALTER TABLE study_logs
  ADD COLUMN project_id INT UNSIGNED NULL AFTER user_id,
  ADD CONSTRAINT fk_study_logs_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL;

ALTER TABLE checkpoints
  ADD COLUMN project_id INT UNSIGNED NULL AFTER user_id,
  ADD CONSTRAINT fk_checkpoints_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL;

ALTER TABLE mistakes
  ADD COLUMN project_id INT UNSIGNED NULL AFTER user_id,
  ADD CONSTRAINT fk_mistakes_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL;

ALTER TABLE review_schedules
  ADD COLUMN project_id INT UNSIGNED NULL AFTER user_id,
  ADD CONSTRAINT fk_review_schedules_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL;
