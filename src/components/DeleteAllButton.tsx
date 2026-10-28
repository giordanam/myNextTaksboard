'use client';
import { useState } from 'react';
import Button from './Button';
import { useTasks } from '@/contexts/TaskContext';
import { IconDelete } from './Icons';

export default function DeleteAllButton() {
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const { setTasks } = useTasks();

  return (
    <>
      <Button variant="danger" onClick={() => setShowDeleteWarning(true)} className="mr-3 gap-3">
        <IconDelete className="size-4" />
        Elimina tutte le attività
      </Button>

      {showDeleteWarning && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-sm p-6 border-2 border-red-700">
            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-bold text-gray-800 text-center">Sei sicuro?</h2>
              <p className="text-sm text-gray-500 text-center">
                Stai per eliminare <strong>tutte</strong> le tue attività. Questa azione è
                irreversibile.
              </p>
              <div className="flex justify-center gap-3 w-full mt-2">
                <Button variant="secondary" onClick={() => setShowDeleteWarning(false)}>
                  Annulla
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    setShowDeleteWarning(false);
                    setTasks([]);
                  }}
                >
                  Sì, elimina tutto
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
