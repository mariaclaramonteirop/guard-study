ALTER TABLE checkpoints
  DROP FOREIGN KEY fk_checkpoints_study_log;

UPDATE checkpoints SET study_log_id = 1 WHERE study_log_id IS NULL;

ALTER TABLE checkpoints
  MODIFY topic_id INT UNSIGNED NULL,
  MODIFY study_log_id INT UNSIGNED NOT NULL,
  ADD CONSTRAINT fk_checkpoints_study_log FOREIGN KEY (study_log_id) REFERENCES study_logs(id) ON DELETE CASCADE;

ALTER TABLE mistakes
  ADD COLUMN checkpoint_id INT UNSIGNED NULL AFTER user_id;

UPDATE mistakes SET checkpoint_id = 1 WHERE checkpoint_id IS NULL;

ALTER TABLE mistakes
  MODIFY checkpoint_id INT UNSIGNED NOT NULL,
  ADD CONSTRAINT fk_mistakes_checkpoint FOREIGN KEY (checkpoint_id) REFERENCES checkpoints(id) ON DELETE CASCADE;
