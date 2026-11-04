import Dashboard from '@/components/Dashboard';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function UserPage() {
  const cookieStore = await cookies();
  const userName = cookieStore.get('userName')?.value;

  const user = userName
    ? await prisma.user.findUnique({
        where: { username: userName },
        select: { id: true, username: true },
      })
    : null;

  if (!user) {
    redirect('/login');
  }

  return <Dashboard isUserPage={true} userId={user.id} userName={user.username}></Dashboard>;
}
