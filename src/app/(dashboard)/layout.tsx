'use client';

import FilterBar from '@/components/FilterBar';
import { useTasks } from '@/contexts/TaskContext';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { handleDownloadClick } = useTasks();
  return (
    <>
      <FilterBar onClick={handleDownloadClick} />
      <div className="mt-6">{children}</div>
    </>
  );
}
