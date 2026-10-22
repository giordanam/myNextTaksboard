import { useState, useTransition } from 'react';
import { usePathname } from 'next/navigation';
import { useFilters } from '@/contexts/FilterContext';
import { CATEGORIES, USERS, EXPIRES } from '@/constants';
import { IconCategory, IconFilters, IconLoading, IconSearch, IconTime, IconUser } from './Icons';
import Button from './Button';

interface FilterBarProps {
  onClick: () => void;
}

export default function FilterBar({ onClick }: FilterBarProps) {
  const [isFiltersOpen, setFiltersOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const path = usePathname();
  const isUserPage = path === '/user';
  const {
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    expireFilter,
    setExpireFilter,
    userFilter,
    setUserFilter,
    handleClearFilters,
  } = useFilters();

  const handleDownloadClick = () => {
    startTransition(async () => {
      await onClick();
    });
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center gap-4">
        <div className="relative w-full md:w-60">
          <IconSearch className={'size-5 absolute text-gray-400 left-3 top-1/2 -translate-y-1/2'} />
          <input
            type="text"
            placeholder="Cerca attività..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white pr-4 py-2 pl-10 focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600 rounded-2xl"
          />
        </div>
        <div className="flex flex-wrap w-full md:w-auto items-center">
          <Button className="gap-2" onClick={() => setFiltersOpen(!isFiltersOpen)}>
            <IconFilters className={'size-5'} />
            Filtri
          </Button>
          <Button className="justify-self-end ml-2" onClick={handleClearFilters}>
            Pulisci filtri
          </Button>
          {!isUserPage && (
            <Button
              variant="danger"
              onClick={handleDownloadClick}
              disabled={isPending}
              className="ml-2"
            >
              Scarica tasks
            </Button>
          )}
          {isPending && (
            <div className="flex items-center ml-4 text-sky-600 mx-auto md:mx-0">
              <IconLoading className={'animate-spin h-6 w-6 mr-2'} />
            </div>
          )}
        </div>
      </div>

      {isFiltersOpen && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-4">
          <div className="border-t border-b border-sky-400 py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <span className="flex items-center gap-2 font-bold text-gray-700">
                <IconCategory className={'size-5'} />
                Categoria
              </span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="py-2 px-3 w-full bg-white text-gray-900 focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600 rounded-xl"
              >
                <option value="">Tutte le categorie...</option>
                {CATEGORIES.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <span className="flex items-center gap-2 font-bold text-gray-700">
                <IconTime className={'size-6'} />
                Scadenza
              </span>
              <select
                value={expireFilter}
                onChange={(e) => setExpireFilter(e.target.value)}
                className="py-2 px-3 w-full bg-white text-gray-900 focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600 rounded-xl"
              >
                <option value="">Qualsiasi scadenza...</option>
                {EXPIRES.map((expire) => (
                  <option key={expire.value} value={expire.value}>
                    {expire.label}
                  </option>
                ))}
              </select>
            </div>

            {!isUserPage && (
              <div className="flex flex-col gap-2">
                <span className="flex items-center gap-2 font-bold text-gray-700">
                  <IconUser className={'size-6'} />
                  Utente assegnato
                </span>
                <select
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                  className="py-2 px-3 w-full bg-white text-gray-900 focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600 rounded-xl"
                >
                  <option value="">Tutti gli utenti...</option>
                  {USERS.map((user) => (
                    <option key={user.value} value={user.value}>
                      {user.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
