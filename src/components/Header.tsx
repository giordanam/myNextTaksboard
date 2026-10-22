'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation'; // <-- L'hook per capire dove siamo!
import { useTasks } from '@/contexts/TaskContext';
import Button from './Button';
import { IconPlus, IconDelete } from './Icons';

export default function Header() {
  const { setIsModalOpen, deleteAllTasks } = useTasks();
  const pathname = usePathname();
  const isUserPage = pathname === '/user';

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-bold text-gray-800">TaskBoard</h1>
          <nav className="flex gap-4">
            <Link
              href="/"
              className={`font-medium transition-colors pb-1 ${
                pathname === '/'
                  ? 'text-sky-600 border-b-2 border-sky-600' // Stile pagina ATTIVA
                  : 'text-gray-500 hover:text-gray-900' // Stile pagina INATTIVA
              }`}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`font-medium transition-colors pb-1 ${
                pathname === '/about'
                  ? 'text-sky-600 border-b-2 border-sky-600'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              About
            </Link>
            <Link
              href="/user"
              className={`font-medium transition-colors pb-1 ${
                pathname === '/user'
                  ? 'text-sky-600 border-b-2 border-sky-600'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Task personali
            </Link>
          </nav>
        </div>
        <div>
          {!isUserPage && (
            <Button
              variant="danger"
              onClick={() => {
                deleteAllTasks();
              }}
              className="mr-3 gap-3"
            >
              <IconDelete className="size-4" />
              Elimina tutte le attività
            </Button>
          )}
          <Button
            onClick={() => {
              setIsModalOpen(true);
            }}
            className="gap-3"
          >
            <IconPlus className="size-4" />
            Nuova attività
          </Button>
        </div>
      </div>
    </header>
  );
}
