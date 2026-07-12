ALTER TABLE study_sessions
  ADD COLUMN pause_minutes INT UNSIGNED NULL AFTER planned_minutes;
