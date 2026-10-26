'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    //fake validazione campi
    if (!email || !password) {
      setError('Email e password sono obbligatorie.');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('La password deve contenere almeno 6 caratteri.');
      setIsLoading(false);
      return;
    }

    //simulazione chiamata API
    setTimeout(() => {
      // usiamo credenziali di prova per simulare un errore
      if (email === 'admin@test.com' && password === 'password123') {
        document.cookie = 'userName=Admin; path=/; max-age=86400'; // da capire se lasciare per gestione task personali
        document.cookie = 'isAuthenticated=true; path=/; max-age=86400';
        setIsLoading(false);
        setError('');
        setEmail('');
        setPassword('');
        // riportiamo l'utente alla bacheca
        router.push('/');
      } else {
        // errore: credenziali sbagliate
        setError('Email o password non valide. Prova admin@test.com / password123');
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">TaskBoard</h1>
          <p className="text-gray-500 mt-2">Accedi per gestire le tue attività</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Indirizzo Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all bg-gray-50 focus:bg-white"
              placeholder="nome@esempio.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all bg-gray-50 focus:bg-white"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <Button type="submit" disabled={isLoading} className="w-full gap-3">
            {isLoading ? 'Accesso in corso...' : 'Accedi'}
          </Button>
        </form>
      </div>
    </div>
  );
}
