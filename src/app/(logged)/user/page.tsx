import Dashboard from '@/components/Dashboard';
import { cookies } from 'next/headers';

export default async function UserPage() {
  const cookieStore = await cookies();
  const userName = cookieStore.get('userName')?.value;

  return <Dashboard isUserPage={true} userName={userName}></Dashboard>;
}
