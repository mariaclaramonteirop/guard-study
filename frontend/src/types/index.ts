export type ApiResponse<T> = {
  success: boolean;
  data: T;
  error?: {
    message: string;
    details?: Record<string, string>;
  };
};

export type Topic = {
  id: number;
  project_id: number | null;
  name: string;
  description: string | null;
  status: string;
};

export type StudyLog = {
  id: number;
  project_id: number | null;
  topic_id: number;
  title: string;
  content: string;
  duration_minutes: number;
  studied_at: string;
};

export type Checkpoint = {
  id: number;
  project_id: number | null;
  topic_id: number | null;
  study_log_id: number;
  mistake_id: number | null;
  review_schedule_id: number | null;
  title: string;
  description: string | null;
  is_completed: number;
  completed_at: string | null;
};

export type Mistake = {
  id: number;
  project_id: number | null;
  study_log_id: number;
  checkpoint_id: number | null;
  title: string;
  description: string;
  correction: string;
  is_reviewed: number;
  reviewed_at: string | null;
};

export type DashboardSummary = {
  projects: number;
  studySessions: number;
  studySessionMinutes: number;
  goalsActive: number;
  rewardsClaimed: number;
  rewardPoints: number;
  topics: number;
  studyLogs: number;
  checkpointsOpen: number;
  mistakesToReview: number;
};

export type ReviewSchedule = {
  id: number;
  user_id: number | null;
  project_id: number | null;
  study_log_id: number;
  checkpoint_id: number | null;
  mistake_id: number | null;
  title: string;
  scheduled_for: string;
  status: 'pending' | 'done';
  notes: string | null;
  completed_at: string | null;
};

export type ChecklistItem = {
  id: number;
  study_log_id: number;
  title: string;
  is_completed: number;
};

export type User = {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  permissions: Record<string, boolean>;
  password?: string;
};

export type Project = {
  id: number;
  user_id: number | null;
  name: string;
  description: string | null;
  repository_url: string | null;
  project_url: string | null;
  notes: string | null;
  status: string;
};

export type StudySession = {
  id: number;
  user_id: number | null;
  project_id: number | null;
  topic_id: number | null;
  study_log_id: number | null;
  title: string;
  timer_mode: 'pomodoro' | 'short_break' | 'long_break' | 'custom';
  planned_minutes: number;
  pause_minutes: number | null;
  actual_minutes: number;
  status: 'running' | 'paused' | 'completed' | 'cancelled';
  started_at: string;
  ended_at: string | null;
  notes: string | null;
};

export type StudyGoal = {
  id: number;
  user_id: number | null;
  project_id: number | null;
  title: string;
  description: string | null;
  target_minutes: number;
  target_sessions: number | null;
  reward_title: string;
  reward_points: number;
  status: 'active' | 'paused' | 'achieved';
  achieved_at: string | null;
  notes: string | null;
};

export type Reward = {
  id: number;
  user_id: number | null;
  goal_id: number | null;
  title: string;
  description: string | null;
  points: number;
  kind: 'badge' | 'bonus' | 'streak' | 'custom';
  category: string;
  image_url: string | null;
  badge_key: string | null;
  status: 'locked' | 'unlocked' | 'claimed';
  unlocked_at: string | null;
  claimed_at: string | null;
  notes: string | null;
};
