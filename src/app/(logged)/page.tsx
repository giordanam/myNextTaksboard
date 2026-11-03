// Server Component
import { fetchTasks } from '@/services/tasksApi';
import { Task } from '@/constants';
import Dashboard from '@/components/Dashboard';

export default async function Page() {
  let initialTasks: Task[] = [];

  return <Dashboard initialTasks={initialTasks}></Dashboard>;
}
