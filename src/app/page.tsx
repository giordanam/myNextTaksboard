// erver Component

import TaskContainer from '@/components/TaskContainer';
import { FilterProvider } from '@/contexts/FilterContext';

export default function Page() {
  return (
    <FilterProvider>
      <div className="bg-gray-100 text-gray-800 p-6 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* L'interattività vera e propria è "relegata" dentro TaskContainer */}
          <TaskContainer />
        </div>
      </div>
    </FilterProvider>
  );
}
