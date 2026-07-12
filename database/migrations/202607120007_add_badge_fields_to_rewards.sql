ALTER TABLE rewards
  ADD COLUMN category VARCHAR(60) NOT NULL DEFAULT 'metas' AFTER kind,
  ADD COLUMN image_url VARCHAR(255) NULL AFTER category,
  ADD COLUMN badge_key VARCHAR(100) NULL AFTER image_url;
