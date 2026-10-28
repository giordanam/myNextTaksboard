'use client';
import TaskDetail from '@/components/TaskDetail';
import { useRouter } from 'next/navigation';

export default function ModalClient({ id }: { id: string }) {
  const router = useRouter();
  return <TaskDetail id={id} onClose={() => router.back()} />;
}
