ALTER TABLE mistakes
  ADD COLUMN study_log_id INT UNSIGNED NULL AFTER user_id;

UPDATE mistakes SET study_log_id = 1 WHERE study_log_id IS NULL;

ALTER TABLE mistakes
  MODIFY study_log_id INT UNSIGNED NOT NULL,
  MODIFY checkpoint_id INT UNSIGNED NULL,
  ADD CONSTRAINT fk_mistakes_study_log FOREIGN KEY (study_log_id) REFERENCES study_logs(id) ON DELETE CASCADE;
