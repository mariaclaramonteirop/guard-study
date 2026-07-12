CREATE TABLE IF NOT EXISTS review_schedules (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NULL,
  study_log_id INT UNSIGNED NOT NULL,
  checkpoint_id INT UNSIGNED NULL,
  mistake_id INT UNSIGNED NULL,
  title VARCHAR(160) NOT NULL,
  scheduled_for DATE NOT NULL,
  status ENUM('pending', 'done') NOT NULL DEFAULT 'pending',
  notes TEXT NULL,
  completed_at DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_review_schedules_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_review_schedules_study_log FOREIGN KEY (study_log_id) REFERENCES study_logs(id) ON DELETE CASCADE,
  CONSTRAINT fk_review_schedules_checkpoint FOREIGN KEY (checkpoint_id) REFERENCES checkpoints(id) ON DELETE SET NULL,
  CONSTRAINT fk_review_schedules_mistake FOREIGN KEY (mistake_id) REFERENCES mistakes(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
