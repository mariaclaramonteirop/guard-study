CREATE TABLE IF NOT EXISTS study_goals (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NULL,
  project_id INT UNSIGNED NULL,
  title VARCHAR(160) NOT NULL,
  description TEXT NULL,
  target_minutes INT UNSIGNED NOT NULL,
  target_sessions INT UNSIGNED NULL,
  reward_title VARCHAR(160) NOT NULL,
  reward_points INT UNSIGNED NOT NULL DEFAULT 0,
  status ENUM('active', 'paused', 'achieved') NOT NULL DEFAULT 'active',
  achieved_at DATETIME NULL,
  notes TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_study_goals_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_study_goals_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS rewards (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NULL,
  goal_id INT UNSIGNED NULL,
  title VARCHAR(160) NOT NULL,
  description TEXT NULL,
  points INT UNSIGNED NOT NULL DEFAULT 0,
  kind ENUM('badge', 'bonus', 'streak', 'custom') NOT NULL DEFAULT 'custom',
  status ENUM('locked', 'unlocked', 'claimed') NOT NULL DEFAULT 'locked',
  unlocked_at DATETIME NULL,
  claimed_at DATETIME NULL,
  notes TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_rewards_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_rewards_goal FOREIGN KEY (goal_id) REFERENCES study_goals(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
