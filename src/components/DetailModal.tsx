import { useState } from 'react';
import Form from './Form';
import Button from './Button';
import { Task } from '@/constants';

//creiamo lo stampo per le props
interface DetailModalProps {
  onClose: () => void;
  task: Task | null;
  onSave: (tasks: Task) => void;
  onDelete: (taskId: string | number) => void;
}

export default function DetailModal({ onClose, task, onSave, onDelete }: DetailModalProps) {
  const [showWarning, setShowWarning] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4">
        <div className="relative bg-white rounded-xl w-full max-w-2xl p-0 overflow-hidden max-h-[90vh]">
          <Form
            key={task ? `${task.id}-${task.status}-${resetKey}` : `new-${resetKey}`}
            onClose={(isDirty: boolean) => (isDirty ? setShowWarning(true) : onClose())}
            task={task}
            onSave={onSave}
            onDelete={onDelete}
          />
        </div>
      </div>

      {
        /*modale warning*/
        showWarning && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-sm p-6 border-2 border-red-700">
              <div className="flex flex-col gap-3">
                <h2 className="text-lg font-bold text-gray-800">Vuoi davvero uscire?</h2>
                <p className="text-sm text-gray-500">
                  Le modifiche che hai fatto non verranno salvate
                </p>
                <div className="flex justify-center gap-3 w-full">
                  <Button variant="secondary" onClick={() => setShowWarning(false)}>
                    Annulla
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      setResetKey((prev) => prev + 1);
                      setShowWarning(false);
                      onClose();
                    }}
                  >
                    Esci
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </>
  );
}
