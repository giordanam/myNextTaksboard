'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation'; // <-- L'hook per capire dove siamo!
import { useTasks } from '@/contexts/TaskContext';
import Button from './Button';
import { IconPlus } from './Icons';

export default function Header() {
  const { setIsModalOpen } = useTasks();
  const pathname = usePathname();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
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
        <Button
          onClick={() => {
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-sm"
        >
          <IconPlus className="size-5" />
          Nuova attività
        </Button>
      </div>
    </header>
  );
}
