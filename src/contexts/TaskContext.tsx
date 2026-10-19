'use client';

import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { Task } from '@/constants';
import { fetchTasks } from '@/services/tasksApi';
import { FetchStatus } from '@/components/FetchStatusToast';

interface TaskContextType {
  tasks: Task[];
  isModalOpen: boolean;
  selectedTask: Task | null;
  fetchStatus: FetchStatus;
  errorMessage: string;
  setIsModalOpen: (isOpen: boolean) => void;
  setSelectedTask: (task: Task | null) => void;
  setFetchStatus: (status: FetchStatus) => void;
  handleDownloadClick: () => Promise<void>;
  deleteTask: (id: string | number) => void;
  handleSaveForm: (taskData: Task) => Promise<Task> | Task;
}

export const TaskContext = createContext<TaskContextType | null>(null);

interface TaskProviderProps {
  children: ReactNode;
  initialTasks: Task[];
}

export function TaskProvider({ children, initialTasks }: TaskProviderProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [fetchStatus, setFetchStatus] = useState<FetchStatus>('idle');
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
    setFetchStatus('loading');
    try {
      const newTasks = await fetchTasks();
      setTasks((prevTasks) => [...prevTasks, ...newTasks]);
      setErrorMessage('');
      setFetchStatus('success');
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Errore sconosciuto');
      }
      setFetchStatus('error');
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
    setSelectedTask(null);
  }

  function editTask(updatedTask: Task) {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  }

  async function handleSaveForm(taskData: Task) {
    let savedTask: Task;

    if (selectedTask) {
      savedTask = { ...taskData, id: selectedTask.id };
      editTask(savedTask);
    } else {
      savedTask = addTask(taskData);
    }

    setIsModalOpen(false);
    setSelectedTask(null);

    return savedTask;
  }

  return (
    <TaskContext.Provider
      value={{
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
