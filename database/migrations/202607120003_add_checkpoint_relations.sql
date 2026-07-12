ALTER TABLE checkpoints
  ADD COLUMN mistake_id INT UNSIGNED NULL AFTER study_log_id,
  ADD COLUMN review_schedule_id INT UNSIGNED NULL AFTER mistake_id,
  ADD CONSTRAINT fk_checkpoints_mistake FOREIGN KEY (mistake_id) REFERENCES mistakes(id) ON DELETE SET NULL,
  ADD CONSTRAINT fk_checkpoints_review_schedule FOREIGN KEY (review_schedule_id) REFERENCES review_schedules(id) ON DELETE SET NULL;
