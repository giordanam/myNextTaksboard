'use client';

import { useEffect, useState, useCallback } from 'react';
import List from './List';
import DetailModal from './DetailModal';
import Header from './Header';
import FetchStatusToast, { FetchStatus } from './FetchStatusToast';
import FilterBar from './FilterBar';
import { fetchTasks } from '@/services/tasksApi';
import { Task } from '@/constants';

interface TaskContainerProps {
  initialTasks: Task[];
}

export default function TaskContainer({ initialTasks }: TaskContainerProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [fetchStatus, setFetchStatus] = useState<FetchStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  // controllo di locastorage al mount (se c'è, sovrascrive i task del server)
  useEffect(() => {
    let parsedTasks: Task[] = [];
    try {
      const savedTasks = localStorage.getItem('tasks');
      if (savedTasks) {
        const parsed: unknown = JSON.parse(savedTasks);
        if (Array.isArray(parsed)) parsedTasks = parsed as Task[];
        else localStorage.removeItem('tasks');
      }
    } catch (e) {
      console.error('LocalStorage data corrupted.', e);
      try {
        localStorage.removeItem('tasks');
      } catch {}
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);

    if (parsedTasks.length > 0) {
      setTasks(parsedTasks);
      return;
    }
  }, []);

  //salvataggio automatico
  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (e) {
      console.error('Unable to save tasks to LocalStorage.', e);
    }
  }, [tasks, isMounted]);

  const handleDownloadClick = async () => {
    setFetchStatus('loading');
    try {
      const newTasks = await fetchTasks();

      setTasks((prevTasks) => [...prevTasks, ...newTasks]);

      setErrorMessage('');
      setFetchStatus('success'); // Togli la rotellina, mostra verde
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Errore sconosciuto');
      }
      setFetchStatus('error'); // Mostra il toast di errore
    }
  };

  function addTask(newTaskData: Task) {
    const newTask = { ...newTaskData, id: crypto.randomUUID() };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  }

  function deleteTask(id: string | number) {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    setModalOpen(false);
    setSelectedTask(null);
  }

  function editTask(updatedTask: Task) {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  }

  const handleEditTask = useCallback((taskToEdit: Task) => {
    setSelectedTask(taskToEdit);
    setModalOpen(true);
  }, []); // L'array vuoto significa: crea questa funzione una volta sola e non ricrearla mai più

  function handleSaveForm(taskData: Task) {
    if (selectedTask) {
      editTask({ ...taskData, id: selectedTask.id });
    } else {
      addTask(taskData);
    }
    setModalOpen(false);
    setSelectedTask(null);
  }

  return (
    <>
      <Header
        onNewTask={() => {
          setModalOpen(true);
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
          onClose={() => setModalOpen(false)}
          onSave={handleSaveForm}
          task={selectedTask}
          onDelete={deleteTask}
        />
      )}
    </>
  );
}
