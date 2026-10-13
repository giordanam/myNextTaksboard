import { SubmitEvent, useEffect, useState } from 'react';
import { USERS, CATEGORIES, STATUS, Task } from '@/constants';
import FormSelect from './FormSelect';
import Checklist, { ChecklistItemType } from './Checklist';
import { IconCloseForm, IconDelete, IconDescriptionAndColumn, IconManage, IconTime } from './Icons';
import Button from './Button';

interface FormProps {
  onClose: (isDirty: boolean) => void;
  task: Task | null;
  onSave: (task: Task) => void;
  onDelete: (taskId: string | number) => void;
}

export default function Form({ onClose, task, onSave, onDelete }: FormProps) {
  const isNewTask = task === null;
  const [checklist, setChecklist] = useState<ChecklistItemType[]>(task?.checklist || []);
  const [isDirty, setIsDirty] = useState(false);

  //ascolto tasto esc con useEffect
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        // Passiamo isDirty al DetailModal
        onClose(isDirty);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDirty, onClose]);

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const rawData = Object.fromEntries(formData.entries());
    const taskData = {
      ...rawData,
      id: task?.id, // Manteniamo l'id originale se esiste
      checklist: isNewTask ? [] : checklist,
    } as unknown as Task; // Questo trick serve perché da un FormData escono solo stringhe
    onSave(taskData);
  }

  return (
    <form onSubmit={handleSubmit} onChange={() => setIsDirty(true)}>
      <div className="flex flex-col max-h-[90vh]">
        <Button
          variant="danger"
          onClick={() => onClose(isDirty)}
          className="absolute top-6 right-6 z-10 gap-1"
        >
          <IconCloseForm className="size-6" />
        </Button>
        <div className="p-8 flex-1 overflow-y-auto">
          <div className="mb-8 pr-24">
            <input
              type="text"
              name="title"
              placeholder="Titolo"
              defaultValue={task ? task.title : ''}
              className="w-full text-3xl font-bold rounded-xl focus-visible:outline-none focus-visible:border-sky-600 focus:ring-1 focus-visible:ring-sky-600"
              required
            />
          </div>
          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2 flex flex-col">
              <div>
                <h3 className="mb-2 text-sm font-bold text-gray-700 flex items-center gap-2">
                  <IconDescriptionAndColumn className="size-4" />
                  Descrizione
                </h3>
                <textarea
                  name="description"
                  defaultValue={task ? task.description : ''}
                  className="w-full p-3 h-32 bg-gray-50 resize-none border rounded-lg focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600"
                  placeholder="Aggiungi una descrizione..."
                ></textarea>
              </div>
              {!isNewTask && <Checklist checklist={checklist} setChecklist={setChecklist} />}
            </div>
            <div className="col col-span-1 flex flex-col">
              <div>
                <h3 className="mb-2 text-sm font-bold text-gray-700 flex items-center gap-2">
                  <IconManage className="size-5" />
                  Gestione
                </h3>
                <FormSelect
                  label="Categoria"
                  name="category"
                  defaultValue={task ? task.category : 'design'}
                  options={CATEGORIES}
                  disabled={!isNewTask}
                />

                <FormSelect
                  label="Stato"
                  name="status"
                  defaultValue={task ? task.status : 'to-do'}
                  options={STATUS}
                />

                <FormSelect
                  label="Assegnato a"
                  name="user"
                  defaultValue={task ? task.user : 'giordana'}
                  options={USERS}
                />
              </div>
              <div>
                <h3 className="mb-2 mt-4 text-sm font-bold text-gray-700 flex items-center gap-2">
                  <IconTime className="size-5" />
                  Timeline
                </h3>
                <div>
                  <label
                    htmlFor="task-expire"
                    className="mt-3 block text-xs font-bold text-gray-500"
                  >
                    Scadenza
                  </label>
                  <input
                    type="date"
                    id="task-expire"
                    name="expire"
                    defaultValue={task ? task.expire : ''}
                    className="w-full bg-white border border-gray-200 text-sm rounded-md px-3 py-2 text-gray-700 focus:ring-2 focus:ring-sky-500 outline-none"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-8 py-5 border-t w-full border-gray-100 flex justify-between items-center bg-gray-50">
          {!isNewTask && (
            <div className="flex flex-col items-start gap-1">
              <Button variant="ghost" onClick={() => onDelete(task.id!)} className="mt-2 gap-1.5">
                <IconDelete className="size-4" />
                Elimina Attività
              </Button>
            </div>
          )}
          <div className="flex gap-2">
            <Button type="submit">Salva</Button>
          </div>
        </div>
      </div>
    </form>
  );
}
