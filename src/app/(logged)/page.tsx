// Server Component
import { fetchTasks } from '@/services/tasksApi';
import { Task } from '@/constants';
import Dashboard from '@/components/Dashboard';

export default async function Page() {
  let initialTasks: Task[] = [];

  initialTasks = await fetchTasks();

  return <Dashboard initialTasks={initialTasks}></Dashboard>;
}
