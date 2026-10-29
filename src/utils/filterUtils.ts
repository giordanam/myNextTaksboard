import { getLocalDateString } from './dateUtils'; // Via il .js!
import { Task } from '@/constants'; // Importiamo la nostra fonte di verità

// Definiamo la forma esatta dell'oggetto filters
export interface FilterOptions {
  searchQuery: string;
  categoryFilter: string;
  expireFilter: string;
  userFilter: string;
}

// Diciamo che la funzione accetta un array di Task, un oggetto FilterOptions, e restituisce un array di Task
export function getFilteredTasks(tasks: Task[], filters: FilterOptions): Task[] {
  const { searchQuery, categoryFilter, expireFilter, userFilter } = filters;

  return tasks.filter((task) => {
    const matchTitle = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = categoryFilter === '' || task.category === categoryFilter;
    const matchUser = userFilter === '' || task.userId === userFilter;
    const today = getLocalDateString();

    const matchExpire =
      expireFilter === '' ||
      (expireFilter === 'expired' && task.expire < today) ||
      (expireFilter === 'not-expired' && task.expire >= today);

    return matchTitle && matchUser && matchExpire && matchCategory;
  });
}
