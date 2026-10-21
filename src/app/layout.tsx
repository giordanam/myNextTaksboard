import './globals.css';
import { TaskProvider } from '@/contexts/TaskContext';
import { FilterProvider } from '@/contexts/FilterContext';
import { Suspense } from 'react';
import Header from '@/components/Header';
import GlobalModals from '@/components/GlobalModals';

export const metadata = {
  title: 'TaskBoard',
  description: 'Gestione attività',
};

export default async function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body>
        <TaskProvider>
          <FilterProvider>
            <Suspense fallback={<header className="h-16 bg-white shadow-sm sticky top-0 z-10" />}>
              <Header />
            </Suspense>
            <GlobalModals />
            <main className="bg-gray-100 text-gray-800 min-h-screen">
              <div className="max-w-7xl mx-auto p-6">{children}</div>
              <Suspense fallback={null}>{modal}</Suspense>
            </main>
          </FilterProvider>
        </TaskProvider>
      </body>
    </html>
  );
}
