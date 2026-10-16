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
      <Header
        onNewTask={() => {
          setIsModalOpen(true);
          setSelectedTask(null);
        }}
      />
      <FilterBar onClick={handleDownloadClick} fetchStatus={fetchStatus} />
      <FetchStatusToast
        fetchStatus={fetchStatus}
        onDismiss={() => setFetchStatus('idle')}
        errorMessage={errorMessage}
      />
      <List tasks={tasks} hasTasks={tasks.length > 0} onEditTask={handleEditTask} />

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
