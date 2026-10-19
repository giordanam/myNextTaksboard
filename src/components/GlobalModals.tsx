'use client';

import DetailModal from './DetailModal';
import FetchStatusToast from './FetchStatusToast';
import { useTasks } from '@/contexts/TaskContext';
import { useRouter } from 'next/navigation';

export default function GlobalModals() {
  const router = useRouter();
  const { isModalOpen, fetchStatus, errorMessage, setIsModalOpen, setFetchStatus, handleSaveForm } =
    useTasks();

  return (
    <>
      <FetchStatusToast
        fetchStatus={fetchStatus}
        onDismiss={() => setFetchStatus('idle')}
        errorMessage={errorMessage}
      />

      {isModalOpen && (
        <DetailModal
          task={null} // Passiamo null perché stiamo creando una task nuova
          onClose={() => setIsModalOpen(false)}
          onSave={async (taskData) => {
            const newTask = await handleSaveForm(taskData);

            // 2. Chiudiamo questo modale
            setIsModalOpen(false);

            // 3. IL REDIRECT! Andiamo alla rotta della nuova task
            if (newTask && newTask.id) {
              router.push(`/task/${newTask.id}`);
            }
          }}
          onDelete={() => {
            // Vuoto, perché non puoi eliminare una task che stai creando
          }}
        />
      )}
    </>
  );
}
