import FilterBar from '@/components/FilterBar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FilterBar />
      <div>{children}</div>
    </>
  );
}
