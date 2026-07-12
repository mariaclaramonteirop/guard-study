import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './components/Layout';
import { CheckpointForm } from './pages/CheckpointForm';
import { Checkpoints } from './pages/Checkpoints';
import { Dashboard } from './pages/Dashboard';
import { MistakeDetail } from './pages/MistakeDetail';
import { MistakeForm } from './pages/MistakeForm';
import { Mistakes } from './pages/Mistakes';
import { ReviewScheduleForm } from './pages/ReviewScheduleForm';
import { ReviewSchedules } from './pages/ReviewSchedules';
import { StudyLogDetail } from './pages/StudyLogDetail';
import { StudyLogForm } from './pages/StudyLogForm';
import { StudyLogs } from './pages/StudyLogs';
import { TopicForm } from './pages/TopicForm';
import { Topics } from './pages/Topics';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'topics', element: <Topics /> },
      { path: 'topics/new', element: <TopicForm /> },
      { path: 'topics/:id/edit', element: <TopicForm /> },
      { path: 'study-logs', element: <StudyLogs /> },
      { path: 'study-logs/new', element: <StudyLogForm /> },
      { path: 'study-logs/:id', element: <StudyLogDetail /> },
      { path: 'study-logs/:id/edit', element: <StudyLogForm /> },
      { path: 'checkpoints', element: <Checkpoints /> },
      { path: 'checkpoints/new', element: <CheckpointForm /> },
      { path: 'checkpoints/:id/edit', element: <CheckpointForm /> },
      { path: 'mistakes', element: <Mistakes /> },
      { path: 'mistakes/new', element: <MistakeForm /> },
      { path: 'mistakes/:id', element: <MistakeDetail /> },
      { path: 'mistakes/:id/edit', element: <MistakeForm /> },
      { path: 'review-schedules', element: <ReviewSchedules /> },
      { path: 'review-schedules/new', element: <ReviewScheduleForm /> },
      { path: 'review-schedules/:id/edit', element: <ReviewScheduleForm /> },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
