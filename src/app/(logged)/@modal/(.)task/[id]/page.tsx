import { Suspense } from 'react';
import ModalClient from '@/app/(logged)/@modal/ModalClient';

async function ModalDataLoader({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <ModalClient id={resolvedParams.id} />;
}

export default function InterceptedTaskModal({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={null}>
      <ModalDataLoader params={params} />
    </Suspense>
  );
}
