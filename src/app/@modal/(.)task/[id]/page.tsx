'use client';

import { useTasks } from '@/contexts/TaskContext';
import { useRouter, useParams } from 'next/navigation';
import DetailModal from '@/components/DetailModal';
import { use, useEffect, useState } from 'react';

export default function InterceptedTaskModal() {
  const router = useRouter();
  const params = useParams();
  const { tasks, handleSaveForm, deleteTask } = useTasks();

  // aggiunto per il problema che all'inizio le tasks non erano ancora pronte
  //e si rompeva il routing nella pagina reale
  const [isReady, setIsReady] = useState(false);
  const taskId = params?.id as string;
  const task = tasks.find((t) => t.id === taskId);
  const closeModal = () => {
    router.back();
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsReady(true);
  }, []);

  if (!isReady) {
    return null;
  }

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-xl font-bold mb-2">Task non trovata</h2>
          <p className="mb-4">Potrebbe essere stata eliminata o non esiste.</p>
        </div>
      </div>
    );
  }

  return (
    <DetailModal
      task={task}
      onClose={closeModal}
      onSave={async (taskData) => {
        await handleSaveForm(taskData);
        closeModal();
      }}
      onDelete={async (id) => {
        await deleteTask(id);
        closeModal();
      }}
    />
  );
}
