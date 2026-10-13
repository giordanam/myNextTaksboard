'use client';

import { useEffect, useState } from 'react';
import List from '../components/List';
import DetailModal from '../components/DetailModal';
import Header from '../components/Header';
import FetchStatusToast, { FetchStatus } from '../components/FetchStatusToast';
import FilterBar from '../components/FilterBar';
import { formatFetchedTasks } from '@/utils/apiUtils';
import { Task } from '@/constants';
import { FilterProvider } from '@/contexts/FilterContext';

export default function Page() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    // Partiamo da 'idle' (HTML identico tra Server e Client)
    const [fetchStatus, setFetchStatus] = useState<FetchStatus>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    // Ci serve per sapere se abbiamo già finito il primo render
    const [isMounted, setIsMounted] = useState(false);

    const fetchTasksData = async (signal?: AbortSignal) => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=4', { signal });
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

    // 2. Al primo render completato, leggiamo il localStorage IN MODO SICURO
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
        } catch {
          // storage non disponibile
        }
      }

      // Hydration-safe: localStorage è leggibile solo dopo il mount
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsMounted(true);

      if (parsedTasks.length > 0) {
        // Avevamo già dati salvati, li carichiamo nello stato
        setTasks(parsedTasks);
        return;
      }

      // Non c'è nulla di salvato, facciamo partire la fetch!
      setFetchStatus('loading');
      const controller = new AbortController();
      fetchTasksData(controller.signal);
      return () => controller.abort();
    }, []);

    // 3. Salviamo nel localStorage ad ogni modifica, ma SOLO dopo il mount iniziale
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
    const newTask = {
      ...newTaskData,
      id: crypto.randomUUID(),
    };

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
      const updatedTask = { ...taskData, id: selectedTask.id };

      editTask(updatedTask);
    } else {
      addTask(taskData);
    }

    setModalOpen(false);
    setSelectedTask(null);
  }

  return (
    <FilterProvider>
      <div className="bg-gray-100 text-gray-800 p-6 min-h-screen">
        <div className="max-w-7xl mx-auto">
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
        </div>
        {isModalOpen && (
          <DetailModal
            onClose={() => setModalOpen(false)}
            onSave={handleSaveForm}
            task={selectedTask}
            onDelete={deleteTask}
          />
        )}
      </div>
    </FilterProvider>
  );
}
