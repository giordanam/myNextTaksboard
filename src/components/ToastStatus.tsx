import { useEffect, useState } from 'react';

export type ToastStatus = 'idle' | 'success_del' | 'success_edit' | 'success_add' | 'error';

// props
interface ToastStatusProps {
  toastStatus: ToastStatus;
  onDismiss: () => void;
  errorMessage?: string;
}

export default function ToastStatus({ toastStatus, onDismiss, errorMessage }: ToastStatusProps) {
  // Stato interno per gestire l'opacità e l'animazione di uscita
  const [isClosing, setIsClosing] = useState(false);
  //timer
  useEffect(() => {
    if (
      toastStatus === 'error' ||
      toastStatus === 'success_del' ||
      toastStatus === 'success_edit' ||
      toastStatus === 'success_add'
    ) {
      const fadeTimer = setTimeout(() => {
        setIsClosing(true);
      }, 3500);

      const destroyTimer = setTimeout(() => {
        onDismiss();
        setIsClosing(false);
      }, 4000);

      // Pulizia dei timer
      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(destroyTimer);
      };
    }
  }, [toastStatus, onDismiss]);

  const handleManualClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onDismiss();
      setIsClosing(false);
    }, 500); // aspettiamo che la dissolvenza si completi prima di smontare il componente
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 shadow-2xl rounded-lg overflow-hidden transition-all duration-500 ease-in-out starting:opacity-0 starting:translate-y-4 starting:scale-95 ${
        isClosing
          ? 'opacity-0 translate-y-4 scale-95 pointer-events-none'
          : 'opacity-100 translate-y-0 scale-100'
      }`}
    >
      {/* BOTTONE DI CHIUSURA*/}
      <button
        onClick={handleManualClose}
        className="absolute top-2 right-3 text-gray-500 hover:text-gray-900 text-xl font-bold transition-colors"
        aria-label="Chiudi"
      >
        ✕
      </button>
      {/* STATO: ERRORE */}
      {toastStatus === 'error' && (
        <div className="flex items-center p-6 bg-red-100 border-l-8 border-red-600 text-red-800 min-w-[300px]">
          <span className="text-2xl mr-4">❌</span>
          <div>
            <h3 className="font-bold text-lg">Impossibile scaricare</h3>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}
      {/* STATO: SUCCESSO */}
      {toastStatus === 'success_del' && (
        <div className="flex items-center p-6 bg-green-100 border-l-8 border-green-600 text-green-800 min-w-[300px]">
          <div>
            <h3 className="font-bold text-lg">Task eliminata!</h3>
            <p>La task è stata eliminata con successo.</p>
          </div>
        </div>
      )}
      {toastStatus === 'success_edit' && (
        <div className="flex items-center p-6 bg-green-100 border-l-8 border-green-600 text-green-800 min-w-[300px]">
          <div>
            <h3 className="font-bold text-lg">Task modificata!</h3>
            <p>Le modifiche alla task sono state salvate con successo.</p>
          </div>
        </div>
      )}
      {toastStatus === 'success_add' && (
        <div className="flex items-center p-6 bg-green-100 border-l-8 border-green-600 text-green-800 min-w-[300px]">
          <div>
            <h3 className="font-bold text-lg">Task aggiunta!</h3>
            <p>La nuova task è stata aggiunta con successo.</p>
          </div>
        </div>
      )}
    </div>
  );
}
