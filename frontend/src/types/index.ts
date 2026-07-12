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
  name: string;
  description: string | null;
  status: string;
};

export type StudyLog = {
  id: number;
  topic_id: number;
  title: string;
  content: string;
  duration_minutes: number;
  studied_at: string;
};

export type Checkpoint = {
  id: number;
  topic_id: number | null;
  study_log_id: number;
  title: string;
  description: string | null;
  is_completed: number;
  completed_at: string | null;
};

export type Mistake = {
  id: number;
  study_log_id: number;
  checkpoint_id: number | null;
  title: string;
  description: string;
  correction: string;
  is_reviewed: number;
  reviewed_at: string | null;
};

export type DashboardSummary = {
  topics: number;
  studyLogs: number;
  checkpointsOpen: number;
  mistakesToReview: number;
};

export type ReviewSchedule = {
  id: number;
  user_id: number | null;
  study_log_id: number;
  checkpoint_id: number | null;
  mistake_id: number | null;
  title: string;
  scheduled_for: string;
  status: 'pending' | 'done';
  notes: string | null;
  completed_at: string | null;
};
