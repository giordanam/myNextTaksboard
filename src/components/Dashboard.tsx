import FilterBar from '@/components/FilterBar';
import List from '@/components/List';

interface DashboardProps {
  isUserPage?: boolean;
  userId?: string;
  userName?: string;
}
export default function Dashboard({ isUserPage = false, userId, userName }: DashboardProps) {
  return (
    <>
      <FilterBar isUserPage={isUserPage} />
      <div className="bg-gray-100 text-gray-800 p-6 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <List isUserPage={isUserPage} userId={userId} userName={userName} />
        </div>
      </div>
    </>
  );
}
