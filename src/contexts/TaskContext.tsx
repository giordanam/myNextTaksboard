'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Task } from '@/constants';
import { fetchTasks } from '@/services/tasksApi';
import { ToastStatus } from '../components/ToastStatus';

interface TaskContextType {
  tasks: Task[];
  isModalOpen: boolean;
  errorMessage: string;
  setIsModalOpen: (isOpen: boolean) => void;
  handleDownloadClick: () => Promise<void>;
  deleteTask: (id: string | number) => void;
  handleSaveForm: (taskData: Task) => Promise<Task> | Task;
  toastMessage: ToastStatus;
  setToastMessage: (status: ToastStatus) => void;
  isMounted: boolean;
  setTasks: (tasks: Task[]) => void;
  deleteAllTasks: () => void;
  updateTaskStatus: (id: string | number, newState: string) => void;
}

export const TaskContext = createContext<TaskContextType | null>(null);

interface TaskProviderProps {
  children: ReactNode;
}

export function TaskProvider({ children }: TaskProviderProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [toastMessage, setToastMessage] = useState<ToastStatus>('idle');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  // Controllo di locastorage al mount
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

    document.cookie = 'hasVisited=true; path=/; max-age=31536000';

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    if (parsedTasks.length > 0) {
      setTasks(parsedTasks);
    }
  }, []);

  // Salvataggio automatico
  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (e) {
      console.error('Unable to save tasks to LocalStorage.', e);
    }
  }, [tasks, isMounted]);

  const handleDownloadClick = async () => {
    try {
      const newTasks = await fetchTasks();
      setTasks((prevTasks) => [...prevTasks, ...newTasks]);
      setErrorMessage('');
      setToastMessage('success');
    } catch (error) {
      setToastMessage('error');
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Errore sconosciuto');
      }
    }
  };

  // Logica CRUD
  function addTask(newTaskData: Task) {
    const newTask = { ...newTaskData, id: crypto.randomUUID() };
    setTasks((prevTasks) => [...prevTasks, newTask]);
    return newTask;
  }

  function deleteTask(id: string | number) {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    setIsModalOpen(false);
  }

  function editTask(updatedTask: Task) {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  }

  function deleteAllTasks() {
    setTasks([]);
  }

  //funzione per aggiornare solo lki stato di un task
  function updateTaskStatus(id: string | number, newState: string) {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === id ? { ...task, status: newState } : task))
    );
  }

  async function handleSaveForm(taskData: Task) {
    let savedTask: Task;
    const taskID = tasks.find((task) => task.id === taskData.id);

    if (taskID) {
      savedTask = { ...taskData, id: taskID.id };
      editTask(savedTask);
    } else {
      savedTask = addTask(taskData);
    }
    setIsModalOpen(false);

    return savedTask;
  }

  return (
    <TaskContext.Provider
      value={{
        tasks,
        isModalOpen,
        errorMessage,
        setIsModalOpen,
        handleDownloadClick,
        deleteTask,
        handleSaveForm,
        toastMessage,
        setToastMessage,
        isMounted,
        setTasks,
        deleteAllTasks,
        updateTaskStatus,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === null) {
    throw new Error('useTasks must be used inside a TaskProvider');
  }
  return context;
}
