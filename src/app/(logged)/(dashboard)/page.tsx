// Server Component

import List from '@/components/List';
import { fetchTasks } from '@/services/tasksApi';
import { Task } from '@/constants';
import { cookies } from 'next/headers';

export default async function Page() {
  //lettura del cookie
  const cookieStore = await cookies();
  const hasVisited = cookieStore.get('hasVisited')?.value === 'true';
  let initialTasks: Task[] = [];

  if (!hasVisited) {
    initialTasks = await fetchTasks();
  }

  return (
    <div className="bg-gray-100 text-gray-800 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <List initialTasks={initialTasks} />
      </div>
    </div>
  );
}
