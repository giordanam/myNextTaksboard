'use client';

import { useEffect, useState, useRef } from 'react';
import List from './List';
import DetailModal from './DetailModal';
import Header from './Header';
import FetchStatusToast, { FetchStatus } from './FetchStatusToast';
import FilterBar from './FilterBar';
import { formatFetchedTasks } from '@/utils/apiUtils';
import { Task } from '@/constants';

// Questo è il nuovo "gestore" della logica, rigorosamente Client-side
export default function TaskContainer() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [fetchStatus, setFetchStatus] = useState<FetchStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const [isMounted, setIsMounted] = useState(false);

  const fetchTasksData = async (signal?: AbortSignal) => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=4', {
        signal,
      });
      if (!response.ok) throw new Error('Failed to fetch data');

      const data = await response.json();
      const newTasks = formatFetchedTasks(data);
      setTasks((prevTasks) => [...prevTasks, ...newTasks]);
      setErrorMessage('');
      setFetchStatus('success');
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') return;
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Si è verificato un errore sconosciuto');
      }
      setFetchStatus('error');
    }
  };

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

    setFetchStatus('loading');
    const controller = new AbortController();
    fetchTasksData(controller.signal);
    return () => controller.abort();
  }, []);

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
    await fetchTasksData();
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

  function handleEditTask(taskToEdit: Task) {
    setSelectedTask(taskToEdit);
    setModalOpen(true);
  }

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
