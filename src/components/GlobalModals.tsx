'use client';

import DetailModal from './DetailModal';
import FetchStatusToast from './FetchStatusToast';
import { useTasks } from '@/contexts/TaskContext';

export default function GlobalModals() {
  const {
    isModalOpen,
    selectedTask,
    fetchStatus,
    errorMessage,
    setIsModalOpen,
    setFetchStatus,
    handleSaveForm,
    deleteTask,
  } = useTasks();

  console.log(isModalOpen);

  return (
    <>
      <FetchStatusToast
        fetchStatus={fetchStatus}
        onDismiss={() => setFetchStatus('idle')}
        errorMessage={errorMessage}
      />

      {isModalOpen && (
        <DetailModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveForm}
          task={selectedTask}
          onDelete={deleteTask}
        />
      )}
    </>
  );
}
