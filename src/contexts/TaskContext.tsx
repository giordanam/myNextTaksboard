'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import {
  fetchTasks,
  saveTaskToDb,
  deleteTaskFromDb,
  updateTaskStatusInDb,
  deleteAllTasksFromDb,
} from '@/services/tasksApi';
import { Task } from '@/constants';
import { ToastStatus } from '../components/ToastStatus';

interface TaskContextType {
  tasks: Task[];
  isModalOpen: boolean;
  errorMessage: string;
  setIsModalOpen: (isOpen: boolean) => void;
  deleteTask: (id: string | number) => void;
  handleSaveForm: (taskData: Task) => Promise<Task> | Task;
  toastMessage: ToastStatus;
  setToastMessage: (status: ToastStatus) => void;
  isMounted: boolean;
  setTasks: (tasks: Task[]) => void;
  updateTaskStatus: (id: string | number, newState: string) => void;
  deleteAllTasks: () => void;
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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);

    const loadInitialTasks = async () => {
      try {
        // Chiama la Server Action che interroga Prisma (SQLite)
        const dbTasks = await fetchTasks();
        setTasks(dbTasks);
        setErrorMessage('');
      } catch (error) {
        console.error('Errore durante il caricamento dei task dal DB:', error);
        setErrorMessage('Impossibile caricare le attività dal database.');
        setToastMessage('error');
      }
    };

    loadInitialTasks();
  }, []);

  // Logica CRUD
  function deleteAllTasks() {
    setTasks([]);

    deleteAllTasksFromDb().catch((error) => {
      console.error(error);
      setErrorMessage('Impossibile eliminare tutte le attività dal database.');
      setToastMessage('error');
    });
  }

  function addTask(newTask: Task) {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  }

  function deleteTask(id: string | number) {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    setIsModalOpen(false);

    deleteTaskFromDb(id).catch((error) => {
      console.error(error);
      setErrorMessage("Impossibile eliminare l'attività dal database.");
      setToastMessage('error');
    });
  }

  function editTask(updatedTask: Task) {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  }

  //funzione per aggiornare solo lki stato di un task
  function updateTaskStatus(id: string | number, newState: string) {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === id ? { ...task, status: newState } : task))
    );

    updateTaskStatusInDb(id, newState).catch((error) => {
      console.error(error);
      setErrorMessage('Impossibile aggiornare lo stato nel database.');
      setToastMessage('error');
    });
  }

  async function handleSaveForm(taskData: Task) {
    let savedTask: Task;
    const taskID = tasks.find((task) => task.id === taskData.id);

    if (taskID) {
      savedTask = { ...taskData, id: taskID.id };
    } else {
      savedTask = { ...taskData, id: crypto.randomUUID() };
    }

    setIsModalOpen(false);

    try {
      await saveTaskToDb(savedTask);

      if (taskID) {
        editTask(savedTask);
      } else {
        addTask(savedTask);
      }
    } catch (error) {
      console.error('Errore durante il salvataggio nel database', error);
      setErrorMessage('Errore di salvataggio. Verifica la connessione.');
      setToastMessage('error');
    }

    return savedTask;
  }

  return (
    <TaskContext.Provider
      value={{
        tasks,
        isModalOpen,
        errorMessage,
        setIsModalOpen,
        deleteTask,
        handleSaveForm,
        toastMessage,
        setToastMessage,
        isMounted,
        setTasks,
        updateTaskStatus,
        deleteAllTasks,
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
