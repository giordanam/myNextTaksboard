'use client';

import { createContext, useContext, Suspense, ReactNode } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

// Definiamo la "forma" di tutto ciò che questo contesto metterà a disposizione
interface FilterContextType {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  expireFilter: string;
  setExpireFilter: (value: string) => void;
  userFilter: string;
  setUserFilter: (value: string) => void;
  handleClearFilters: () => void;
}

// Creiamo il contesto indicando che può essere o FilterContextType o null
export const FilterContext = createContext<FilterContextType | null>(null);

interface FilterProviderProps {
  children: ReactNode;
}

//creato per wrappare il provider in una suspense (la dinamicità degli url porta errore in caso di pagine statiche => suspense)
function FilterProviderInner({ children }: FilterProviderProps) {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const searchQuery = searchParams.get('q') || '';
  const categoryFilter = searchParams.get('categoryFilter') || '';
  const expireFilter = searchParams.get('expireFilter') || '';
  const userFilter = searchParams.get('userFilter') || '';

  const updateUrlParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathName}?${params.toString()}`);
  };

  const setSearchQuery = (value: string) => updateUrlParams('q', value);
  const setCategoryFilter = (value: string) => updateUrlParams('categoryFilter', value);
  const setExpireFilter = (value: string) => updateUrlParams('expireFilter', value);
  const setUserFilter = (value: string) => updateUrlParams('userFilter', value);

  function handleClearFilters() {
    router.replace(pathName);
  }

  return (
    <FilterContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        categoryFilter,
        setCategoryFilter,
        expireFilter,
        setExpireFilter,
        userFilter,
        setUserFilter,
        handleClearFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}
// Il Provider wrappato in una Suspense per url dinamici => risolve problemi di rendering statico con url dinamici
export function FilterProvider({ children }: FilterProviderProps) {
  return (
    <Suspense fallback={null}>
      <FilterProviderInner>{children}</FilterProviderInner>
    </Suspense>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);

  if (context === null) {
    throw new Error('useFilters must be used inside a FilterProvider');
  }

  return context;
}
