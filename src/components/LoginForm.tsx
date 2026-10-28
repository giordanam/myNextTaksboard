'use client';

import { useActionState } from 'react';
import Button from '@/components/Button';
import { loginAction } from '@/actions/action';

// Stato di partenza prima che l'utente provi a fare login
const initialState = {
  error: '',
};

export default function LoginForm() {
  // state: il risultato dell'azione (l'errore che ci manda il server)
  // formAction: il "motore" da attaccare al form
  // isPending: un booleano (true/false) che sa da solo se il server sta elaborando
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">TaskBoard</h1>
          <p className="text-gray-500 mt-2">Accedi per gestire le tue attività</p>
        </div>

        <form action={formAction} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Indirizzo Email
            </label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all bg-gray-50 focus:bg-white"
              placeholder="nome@esempio.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all bg-gray-50 focus:bg-white"
              placeholder="••••••••"
              required
            />
          </div>

          {state.error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
              {state.error}
            </div>
          )}

          <Button type="submit" disabled={isPending} className="w-full gap-3">
            {isPending ? 'Accesso in corso...' : 'Accedi'}
          </Button>
        </form>
      </div>
    </div>
  );
}
