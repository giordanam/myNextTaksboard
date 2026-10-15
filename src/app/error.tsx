'use client';

import Button from '@/components/Button';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-sm text-center max-w-md">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Qualcosa è andato storto!</h2>
        <p className="text-gray-600 mb-6">{error.message}</p>
        <Button className="px-6 py-2" onClick={reset}>
          Riprova
        </Button>
      </div>
    </div>
  );
}
