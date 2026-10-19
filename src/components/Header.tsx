'use client';
import { IconPlus } from './Icons';
import Button from './Button';
import { useTasks } from '@/contexts/TaskContext';

export default function Header() {
  const { setIsModalOpen, setSelectedTask } = useTasks();
  return (
    <header className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">Le mie attività</h1>
      <Button
        className="gap-2"
        onClick={() => {
          setIsModalOpen(true);
          setSelectedTask(null);
        }}
      >
        <IconPlus className="size-5" />
        Nuova attività
      </Button>
    </header>
  );
}
