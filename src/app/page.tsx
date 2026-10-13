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
  const [tasks, setTasks] = useState<Task[]>(() => {
    // Aggiungiamo questa riga per proteggere il server di Next.js!
    if (typeof window === 'undefined') return [];

    try {
      const savedTasks = localStorage.getItem('tasks');
      return savedTasks ? JSON.parse(savedTasks) : [];
    } catch (error) {
      console.error('LocalStorage data corrupted.', error);
      return [];
    }
  });
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  // Se non ci sono task salvate, al primo render partiamo gia` in stato
  // "loading": evita di dover impostare lo stato in modo sincrono dentro
  // l'effect (che React considera un anti-pattern: causa un render extra).
  const [fetchStatus, setFetchStatus] = useState<FetchStatus>(() =>
    tasks.length === 0 ? 'loading' : 'idle'
  );
  const [errorMessage, setErrorMessage] = useState('');
  const fetchTasksData = async (signal?: AbortSignal) => {
    try {
      //await new Promise((resolve) => setTimeout(resolve, 3000));
      const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=4', {
        //aggancio del segnale alla fetch
        signal,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      const newTasks = formatFetchedTasks(data);
      setTasks((prevTasks) => [...prevTasks, ...newTasks]);
      setErrorMessage('');
      setFetchStatus('success');
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.log('Fetch annullata da React strict mode');
          return;
        }
        setErrorMessage(error.message);
      } else {
        // Se per qualche strano motivo l'errore non fosse un oggetto Error standard
        setErrorMessage('Si è verificato un errore sconosciuto');
      }
      setFetchStatus('error');
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    if (tasks.length === 0) {
      // fetchTasksData aggiorna lo stato solo dopo un `await` (quindi in modo
      // asincrono): react-hooks/set-state-in-effect segnala comunque un falso
      // positivo perché non riesce a tracciare il confine asincrono quando la
      // funzione è definita fuori dall'effect (bug noto del plugin).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchTasksData(controller.signal);
    }

    return () => {
      // Se React (a causa dello StrictMode) decide di distruggere e ricreare
      // il componente in un millisecondo, tiriamo il freno a mano della vecchia fetch
      controller.abort();
    };
    // Effetto da eseguire solo al mount: vogliamo controllare lo stato
    // iniziale di `tasks`, non rieseguire il fetch ogni volta che cambia.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDownloadClick = async () => {
    setFetchStatus('loading');
    await fetchTasksData();
  };

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

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
