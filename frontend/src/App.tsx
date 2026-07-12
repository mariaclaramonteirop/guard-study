import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './components/Layout';
import { RequireAuth } from './components/RequireAuth';
import { CheckpointForm } from './pages/CheckpointForm';
import { Checkpoints } from './pages/Checkpoints';
import { Dashboard } from './pages/Dashboard';
import { MistakeDetail } from './pages/MistakeDetail';
import { MistakeForm } from './pages/MistakeForm';
import { Mistakes } from './pages/Mistakes';
import { ReviewScheduleForm } from './pages/ReviewScheduleForm';
import { ReviewSchedules } from './pages/ReviewSchedules';
import { ProjectDetail } from './pages/ProjectDetail';
import { ProjectForm } from './pages/ProjectForm';
import { Projects } from './pages/Projects';
import { StudySessionForm } from './pages/StudySessionForm';
import { StudySessions } from './pages/StudySessions';
import { StudyLogDetail } from './pages/StudyLogDetail';
import { StudyLogForm } from './pages/StudyLogForm';
import { StudyLogs } from './pages/StudyLogs';
import { Login } from './pages/Login';
import { UserForm } from './pages/UserForm';
import { Users } from './pages/Users';
import { TopicForm } from './pages/TopicForm';
import { Topics } from './pages/Topics';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RequireAuth />,
    children: [
      {
        element: <Layout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: 'projects', element: <Projects /> },
          { path: 'projects/new', element: <ProjectForm /> },
          { path: 'projects/:id', element: <ProjectDetail /> },
          { path: 'projects/:id/edit', element: <ProjectForm /> },
          { path: 'study-sessions', element: <StudySessions /> },
          { path: 'study-sessions/new', element: <StudySessions /> },
          { path: 'study-sessions/:id/edit', element: <StudySessionForm /> },
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
          { path: 'users', element: <Users /> },
          { path: 'users/new', element: <UserForm /> },
          { path: 'users/:id/edit', element: <UserForm /> },
        ],
      },
    ],
  },
  { path: '/login', element: <Login /> },
]);

export function App() {
  return <RouterProvider router={router} />;
}
