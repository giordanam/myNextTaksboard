// Server Component

import TaskContainer from '@/components/TaskContainer';
import { FilterProvider } from '@/contexts/FilterContext';
import { fetchTasks } from '@/services/tasksApi';

export default async function Page() {
  const initialTasks = await fetchTasks();

  return (
    <FilterProvider>
      <div className="bg-gray-100 text-gray-800 p-6 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <TaskContainer initialTasks={initialTasks} />
        </div>
      </div>
    </FilterProvider>
  );
}
