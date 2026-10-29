'use client';

import Card from './Card';
import { STATUS } from '@/constants';
import { useFilters } from '@/contexts/FilterContext';
import { useTasks } from '@/contexts/TaskContext';
import { getFilteredTasks } from '@/utils/filterUtils';
import { IconPlus, IconSearch } from './Icons';
import { useState } from 'react';
import { Task } from '@/constants';

interface ListProps {
  isUserPage?: boolean;
  initialTasks?: Task[];
  userName?: string;
}

function List({ isUserPage, initialTasks = [], userName }: ListProps) {
  const filters = useFilters();
  const { tasks, updateTaskStatus } = useTasks();
  const [draggedFromStatus, setDraggedFromStatus] = useState<string | null>(null);

  const currentTasks = tasks.length > 0 ? tasks : initialTasks;

  const filteredTasks = getFilteredTasks(currentTasks, filters);

  const displayedTasks = isUserPage
    ? filteredTasks.filter((task) => task.userId === userName)
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
            ? `Ottimo lavoro ${userName}! Non hai nessuna attività in sospeso.`
            : hasTotalTasks
              ? 'Nessun risultato trovato per questi filtri, mi spiace!'
              : 'Non ci sono ancora attività. Creane una con il pulsante "Nuova attività".'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 mt-6 gap-6">
      {STATUS.map((state) => {
        //calcoliamo se questa colonna deve essere evidenziata come target del drag
        const isHighlightTarget = draggedFromStatus !== null && draggedFromStatus !== state.value;

        return (
          <div
            key={state.value}
            className={`p-4 rounded-lg transition-all border-2 ${
              isHighlightTarget
                ? 'bg-sky-50 border-dashed border-sky-400'
                : 'bg-gray-100 border-transparent'
            }`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              setDraggedFromStatus(null);
              const draggedTaskId = e.dataTransfer.getData('taskId');
              if (draggedTaskId) {
                updateTaskStatus(draggedTaskId, state.value);
              }
            }}
          >
            <h2 className="font-bold mb-4 flex items-center gap-2">
              {state.icon}
              {state.label}
            </h2>
            <div className="flex flex-col gap-4">
              {displayedTasks
                .filter((task) => task.status === state.value)
                .map((task) => (
                  <Card
                    key={task.id}
                    task={task}
                    onDragStartAction={() => setDraggedFromStatus(task.status)}
                    onDragEndAction={() => setDraggedFromStatus(null)}
                  />
                ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default List;
