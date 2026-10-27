'use client';
import Button from '@/components/Button';
import { IconDelete } from '@/components/Icons';
import { useTasks } from '@/contexts/TaskContext';

export default function Page() {
  const { deleteAllTasks } = useTasks();
  return (
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
  );
}
