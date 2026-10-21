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
      <div className="max-w-7xl mx-auto flex items-center">
        <div className="relative mr-2">
          <IconSearch className={'size-5 absolute text-gray-400 left-3 top-1/2 -translate-y-1/2'} />
          <input
            type="text"
            placeholder="Cerca attività..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white pr-4 py-2 pl-10 focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600 rounded-2xl"
          />
        </div>
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
            className="ml-5"
          >
            Scarica tasks
          </Button>
        )}
        {isPending && (
          <div className="flex items-center ml-4 text-indigo-600">
            <IconLoading className={'animate-spin h-6 w-6 mr-2'} />
          </div>
        )}
      </div>

      {isFiltersOpen && (
        <div className="max-w-7xl mx-auto mt-5 items-center grid grid-cols-4 gap-4">
          <span className="mt-5 flex items-center gap-2 font-bold">
            <IconCategory className={'size-5'} />
            Categoria
          </span>
          <span className="mt-5 flex items-center gap-2 font-bold">
            <IconTime className={'size-6'} />
            Scadenza
          </span>
          {!isUserPage && (
            <span className="mt-5 flex items-center gap-2 font-bold">
              <IconUser className={'size-6'} />
              Utente assegnato
            </span>
          )}
          <div className="col-span-4 border-y border-sky-600 py-4 grid grid-cols-4 gap-4">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="py-2 bg-white text-gray-900 focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600 rounded-xl"
            >
              <option value="">Seleziona etichetta...</option>
              {CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            <select
              value={expireFilter}
              onChange={(e) => setExpireFilter(e.target.value)}
              className="py-2 bg-white text-gray-900 focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600 rounded-xl"
            >
              <option value="">Seleziona Scadenza...</option>
              {EXPIRES.map((expire) => (
                <option key={expire.value} value={expire.value}>
                  {expire.label}
                </option>
              ))}
            </select>
            {!isUserPage && (
              <select
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
                className="py-2 bg-white text-gray-900 focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600 rounded-xl"
              >
                <option value="">Seleziona utente...</option>
                {USERS.map((user) => (
                  <option key={user.value} value={user.value}>
                    {user.label}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      )}
    </>
  );
}
