import './globals.css';
import { TaskProvider } from '@/contexts/TaskContext';
import { FilterProvider } from '@/contexts/FilterContext';

export const metadata = {
  title: 'TaskBoard',
  description: 'Gestione attività',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>
        <TaskProvider>
          <FilterProvider>{children}</FilterProvider>
        </TaskProvider>
      </body>
    </html>
  );
}
