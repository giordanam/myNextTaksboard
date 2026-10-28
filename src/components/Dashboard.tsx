import FilterBar from '@/components/FilterBar';
import List from '@/components/List';
import { Task } from '@/constants';

interface DashboardProps {
  isUserPage?: boolean;
  initialTasks?: Task[];
  userName?: string;
}
export default function Dashboard({
  isUserPage = false,
  initialTasks = [],
  userName,
}: DashboardProps) {
  return (
    <>
      <FilterBar isUserPage={isUserPage} />
      <div className="bg-gray-100 text-gray-800 p-6 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <List isUserPage={isUserPage} initialTasks={initialTasks} userName={userName} />
        </div>
      </div>
    </>
  );
}
