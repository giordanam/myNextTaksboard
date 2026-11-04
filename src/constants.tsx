import { ReactNode } from 'react';
import { IconClock, IconComplete, IconDescriptionAndColumn } from './components/Icons';

export interface Task {
  id: string;
  title: string;
  category: string;
  userId: string;
  expire: Date;
  status: string;
  description?: string | null;
  checklist?: { id: string; text: string; done: boolean }[];
}
// Le "forme" dei dati di configurazione
export interface User {
  id: string;
  name: string;
}

export interface Category {
  value: string;
  label: string;
}

export interface Status {
  value: string;
  label: string;
  icon: ReactNode;
}

export interface Expire {
  value: string;
  label: string;
}

// I dati reali
export const CATEGORIES: Category[] = [
  { value: 'design', label: 'Design' },
  { value: 'dev', label: 'Sviluppo' },
  { value: 'release', label: 'Release' },
  { value: 'bug', label: 'Bug' },
];

export const STATUS: Status[] = [
  {
    value: 'to-do',
    label: 'Da fare',
    icon: <IconDescriptionAndColumn className="size-4" />,
  },
  {
    value: 'in-progress',
    label: 'In corso',
    icon: <IconClock className="size-6" />,
  },
  {
    value: 'done',
    label: 'Completato',
    icon: <IconComplete className="size-6" />,
  },
];

export const EXPIRES: Expire[] = [
  { value: 'expired', label: 'Scaduto' },
  { value: 'not-expired', label: 'Non scaduto' },
];
