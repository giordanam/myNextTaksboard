import { useEffect, useState } from 'react';

// Definiamo i 4 stati validi. Se scrivi qualcosa di diverso, TS ti blocca!
export type FetchStatus = 'idle' | 'loading' | 'success' | 'error';

// props
interface FetchStatusToastProps {
  fetchStatus: FetchStatus;
  onDismiss: () => void;
  errorMessage?: string;
}

export default function FetchStatusToast({
  fetchStatus,
  onDismiss,
  errorMessage,
}: FetchStatusToastProps) {
  // Stato interno per gestire l'opacità e l'animazione di uscita
  const [isClosing, setIsClosing] = useState(false);
  //timer
  useEffect(() => {
    if (fetchStatus === 'error' || fetchStatus === 'success') {
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
  }, [fetchStatus, onDismiss]);

  const handleManualClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onDismiss();
      setIsClosing(false);
    }, 500); // aspettiamo che la dissolvenza si completi prima di smontare il componente
  };

  if (fetchStatus === 'idle' || fetchStatus === 'loading') {
    return null;
  }

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
      {fetchStatus === 'error' && (
        <div className="flex items-center p-6 bg-red-100 border-l-8 border-red-600 text-red-800 min-w-[300px]">
          <span className="text-2xl mr-4">❌</span>
          <div>
            <h3 className="font-bold text-lg">Impossibile scaricare</h3>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}
      {/* STATO: SUCCESSO */}
      {fetchStatus === 'success' && (
        <div className="flex items-center p-6 bg-green-100 border-l-8 border-green-600 text-green-800 min-w-[300px]">
          <span className="text-2xl mr-4">✅</span>
          <div>
            <h3 className="font-bold text-lg">Evvai!</h3>
            <p>Le nuove task sono state importate.</p>
          </div>
        </div>
      )}
    </div>
  );
}
