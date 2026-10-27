// Server Component
import { fetchTasks } from '@/services/tasksApi';
import { Task } from '@/constants';
import { cookies } from 'next/headers';
import Dashboard from "@/components/Dashboard";

export default async function Page() {
  //lettura del cookie
  const cookieStore = await cookies();
  const hasVisited = cookieStore.get('hasVisited')?.value === 'true';
  let initialTasks: Task[] = [];

  if (!hasVisited) {
    initialTasks = await fetchTasks();
  }

  return (
    <Dashboard initialTasks={initialTasks}></Dashboard>
  );
}
