'use client';

import { useTasks } from '@/contexts/TaskContext';
import { useRouter } from 'next/navigation';
import DetailModal from '@/components/DetailModal';
import { use, useEffect, useState } from 'react';

export default function PaginaVeraTask({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { tasks, handleSaveForm, deleteTask } = useTasks();

  // aggiunto per il problema che all'inizio le tasks non erano ancora pronte
  //e si rompeva il routing
  const [isReady, setIsReady] = useState(false);
  const unwrappedParams = use(params);
  const taskId = unwrappedParams.id;
  const task = tasks.find((t) => t.id === taskId);
  const goHome = () => router.push('/');

  useEffect(() => {
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
          <button onClick={goHome} className="bg-sky-500 text-white px-4 py-2 rounded">
            Torna alla Bacheca
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <DetailModal
        task={task}
        onClose={goHome}
        onSave={async (taskData) => {
          await handleSaveForm(taskData);
          goHome();
        }}
        onDelete={async (id) => {
          await deleteTask(id);
          goHome();
        }}
      />
    </div>
  );
}
