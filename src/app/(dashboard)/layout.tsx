'use client';

import FilterBar from '@/components/FilterBar';
import { useTasks } from '@/contexts/TaskContext';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { handleDownloadClick, fetchStatus } = useTasks();
  return (
    <>
      <FilterBar onClick={handleDownloadClick} fetchStatus={fetchStatus} />
      <div className="mt-6">{children}</div>
    </>
  );
}
