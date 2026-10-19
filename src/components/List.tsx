'use client';

import Card from './Card';
import { STATUS } from '@/constants';
import { useFilters } from '@/contexts/FilterContext';
import { useTasks } from '@/contexts/TaskContext';
import { getFilteredTasks } from '@/utils/filterUtils';
import { IconPlus, IconSearch } from './Icons';
import { memo } from 'react';
import { usePathname } from 'next/navigation';

function List() {
  const filters = useFilters();
  const { tasks, handleEditTask } = useTasks();
  const filteredTasks = getFilteredTasks(tasks, filters);
  const pathname = usePathname();
  const isUserPage = pathname === '/user';

  const displayedTasks = isUserPage
    ? filteredTasks.filter((task) => task.user === 'giordana')
    : filteredTasks;

  const hasDisplayedTasks = displayedTasks.length > 0;
  const hasTotalTasks = tasks.length > 0;

  if (!hasDisplayedTasks) {
    return (
      <div className="mt-5 flex flex-col items-center justify-center gap-3 text-center bg-white border border-dashed border-gray-300 rounded-lg py-16 px-6">
        {hasTotalTasks ? (
          <IconSearch className={'size-10 text-sky-500'} />
        ) : (
          <IconPlus className={'size-10 text-sky-500'} />
        )}
        <p className="font-bold text-gray-700">
          {isUserPage
            ? 'Ottimo lavoro Giordana! Non hai nessuna attività in sospeso.'
            : hasTotalTasks
              ? 'Nessun risultato trovato per questi filtri, mi spiace!'
              : 'Non ci sono ancora attività. Creane una con il pulsante "Nuova attività".'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 mt-5 gap-6">
      {STATUS.map((state) => (
        <div key={state.value} className="bg-gray-100 p-4 rounded-lg">
          <h2 className="font-bold mb-4 flex items-center gap-2">
            {state.icon}
            {state.label}
          </h2>
          <div className="flex flex-col gap-4">
            {displayedTasks
              .filter((task) => task.status === state.value)
              .map((task) => (
                <Card key={task.id} task={task} onEditTask={() => handleEditTask(task)} />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default memo(List);
