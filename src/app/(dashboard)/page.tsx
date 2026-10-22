// Server Component

import List from '@/components/List';
import { fetchTasks } from '@/services/tasksApi';

export default async function Page() {
  const serverTasks = await fetchTasks();
  return (
    <div className="bg-gray-100 text-gray-800 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <List initialTasks={serverTasks} />
      </div>
    </div>
  );
}
