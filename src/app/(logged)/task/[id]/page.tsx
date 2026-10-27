'use client';

import { Suspense, useEffect, useState } from 'react';
import { useTasks } from '@/contexts/TaskContext';
import { useRouter, useParams } from 'next/navigation';
import DetailModal from '@/components/DetailModal';

function TaskContent() {
  const router = useRouter();
  const params = useParams();
  const { tasks, handleSaveForm, deleteTask } = useTasks();

  // aggiunto per il problema che all'inizio le tasks non erano ancora pronte
  //e si rompeva il routing
  const [isReady, setIsReady] = useState(false);
  const taskId = params?.id as string;
  const task = tasks.find((t) => t.id === taskId);
  const goHome = () => router.push('/');

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

export default function RealTaskPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      {/* suspense che permette a Next.js di non bloccarsi sul prerendering */}
      <Suspense fallback={<div className="animate-pulse"></div>}>
        <TaskContent />
      </Suspense>
    </div>
  );
}
