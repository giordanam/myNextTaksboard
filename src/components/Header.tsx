'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; // <-- L'hook per capire dove siamo!
import { useTasks } from '@/contexts/TaskContext';
import Button from './Button';
import { IconPlus, IconDelete, IconLogout } from './Icons';

export default function Header() {
  const { setIsModalOpen, deleteAllTasks } = useTasks();
  const pathname = usePathname();
  const isUserPage = pathname === '/user';
  const router = useRouter();

  if (pathname === '/login') {
    return null;
  }

  const handleLogout = () => {
    document.cookie = 'isAuthenticated=false; path=/; max-age=0';
    document.cookie = 'userName=; path=/; max-age=0';
    router.push('/login');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
        <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 w-full md:w-auto">
          <h1 className="text-2xl font-bold text-gray-800">TaskBoard</h1>
          <nav className="flex flex-wrap justify-center gap-4">
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
        <div className="flex flex-col sm:flex-row w-full md:w-auto">
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
          <Button variant="ghost" onClick={handleLogout} className="ml-3 gap-3">
            <IconLogout className="size-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
