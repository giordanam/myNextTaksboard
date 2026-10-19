import './globals.css';
import { fetchTasks } from '@/services/tasksApi';
import { TaskProvider } from '@/contexts/TaskContext';
import { FilterProvider } from '@/contexts/FilterContext';
import Header from '@/components/Header';

export const metadata = {
  title: 'TaskBoard',
  description: 'Gestione attività',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const initialTasks = await fetchTasks();

  return (
    <html lang="it">
      <body>
        <TaskProvider initialTasks={initialTasks}>
          <FilterProvider>
            <Header />
            <main className="bg-gray-100 text-gray-800 min-h-screen">
              <div className="max-w-7xl mx-auto p-6">{children}</div>
            </main>
          </FilterProvider>
        </TaskProvider>
      </body>
    </html>
  );
}
