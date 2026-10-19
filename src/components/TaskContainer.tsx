'use client';

import List from './List';
import DetailModal from './DetailModal';
import Header from './Header';
import FetchStatusToast from './FetchStatusToast';
import FilterBar from './FilterBar';
import { useTasks } from '@/contexts/TaskContext';

export default function TaskContainer() {
  const {
    tasks,
    isModalOpen,
    selectedTask,
    fetchStatus,
    errorMessage,
    setIsModalOpen,
    setSelectedTask,
    setFetchStatus,
    handleDownloadClick,
    deleteTask,
    handleSaveForm,
    handleEditTask,
  } = useTasks();

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
