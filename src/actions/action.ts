'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export type LoginState = {
  error: string;
};

//server action
export async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = formData.get('email')?.toString() || '';
  const password = formData.get('password')?.toString() || '';

  if (!email || !password) {
    return { error: 'Email e password sono obbligatorie.' };
  }

  if (password.length < 6) {
    return { error: 'La password deve contenere almeno 6 caratteri.' };
  }

  if (email === 'admin@test.com' && password === 'password123') {
    const cookieStore = await cookies();
    cookieStore.set('userName', 'giordana', { path: '/', maxAge: 86400 });
    cookieStore.set('isAuthenticated', 'true', { path: '/', maxAge: 86400 });
  } else {
    // errore: credenziali sbagliate
    return { error: 'Email o password non valide. Prova admin@test.com / password123' };
  }
  redirect('/');
}
