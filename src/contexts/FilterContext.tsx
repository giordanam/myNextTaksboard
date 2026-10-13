'use client'; //si mette nel caso in cui si stanno modificando gli stati (useState)

import { createContext, useContext, useState, ReactNode } from 'react';

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

// Tipizziamo i figli del Provider (ReactNode significa "qualsiasi cosa che React può renderizzare")
interface FilterProviderProps {
  children: ReactNode;
}

// Il Provider
export function FilterProvider({ children }: FilterProviderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [expireFilter, setExpireFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');

  function handleClearFilters() {
    setSearchQuery('');
    setCategoryFilter('');
    setExpireFilter('');
    setUserFilter('');
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

export function useFilters() {
  const context = useContext(FilterContext);

  if (context === null) {
    throw new Error('useFilters must be used inside a FilterProvider');
  }

  return context;
}
