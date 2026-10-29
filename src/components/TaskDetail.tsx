'use client';

import { useTasks } from '@/contexts/TaskContext';
import DetailModal from './DetailModal';
import Button from './Button';

interface TaskDetailProps {
  id: string;
  onClose: () => void;
}

export default function TaskDetail({ id, onClose }: TaskDetailProps) {
  const { tasks, handleSaveForm, deleteTask, isMounted } = useTasks();

  if (!isMounted) return null;

  const task = tasks.find((t) => t.id === id) || null;

  if (!task) {
    return (
      <div className="min-h-screen flex items-center -mt-25 justify-center bg-gray-100">
        <div className="bg-white p-10 w-full max-w-lg rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-3 text-gray-800">Task non trovata</h2>
          <p className="text-lg text-gray-600 mb-8">
            Potrebbe essere stata eliminata o non esiste.
          </p>
          <Button onClick={onClose}>Torna indietro</Button>
        </div>
      </div>
    );
  }

  return (
    <DetailModal
      task={task}
      onClose={onClose}
      onSave={async (taskData) => {
        await handleSaveForm(taskData);
        onClose();
      }}
      onDelete={async (id) => {
        await deleteTask(id);
        onClose();
      }}
    />
  );
}
