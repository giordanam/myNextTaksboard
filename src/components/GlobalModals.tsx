'use client';

import DetailModal from './DetailModal';
import ToastStatus from './ToastStatus';
import { useTasks } from '@/contexts/TaskContext';
import { useRouter } from 'next/navigation';

export default function GlobalModals() {
  const router = useRouter();
  const {
    isModalOpen,
    toastMessage,
    errorMessage,
    setIsModalOpen,
    setToastMessage,
    handleSaveForm,
  } = useTasks();

  return (
    <>
      <ToastStatus
        toastStatus={toastMessage}
        onDismiss={() => setToastMessage('idle')}
        errorMessage={errorMessage}
      />

      {isModalOpen && (
        <DetailModal
          task={null} // Passiamo null perché stiamo creando una task nuova
          onClose={() => setIsModalOpen(false)}
          onSave={async (taskData) => {
            const newTask = await handleSaveForm(taskData);

            setIsModalOpen(false);

            if (newTask && newTask.id) {
              router.push(`/task/${newTask.id}`);
            }
          }}
          onDelete={() => {}}
        />
      )}
    </>
  );
}
