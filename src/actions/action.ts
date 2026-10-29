'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export type LoginState = {
  error: string;
};

//server action
export async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const username = formData.get('username')?.toString() || '';
  const password = formData.get('password')?.toString() || '';

  if (!username || !password) {
    return { error: 'Nome utente e password sono obbligatorie.' };
  }

  if (password.length < 6) {
    return { error: 'La password deve contenere almeno 6 caratteri.' };
  }

  const user = await prisma.user.findUnique({
    where: {
      username: username.toLowerCase(),
    },
  });

  if (user && password === user.password) {
    const cookieStore = await cookies();

    cookieStore.set('userName', user.username, {
      path: '/',
      maxAge: 86400,
      httpOnly: true, // cookie non leggibile via js
      secure: process.env.NODE_ENV === 'production', // in locale su http è false, online con https è true
    });

    cookieStore.set('isAuthenticated', 'true', {
      path: '/',
      maxAge: 86400,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
  } else {
    // errore: credenziali sbagliate
    return { error: 'Nome utente o password non validi.' };
  }
  redirect('/');
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('isAuthenticated');
  cookieStore.delete('userName');
  redirect('/login');
}
