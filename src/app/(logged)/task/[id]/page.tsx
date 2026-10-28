import { Suspense } from 'react';
import PageClient from '@/app/(logged)/task/[id]/PageClient';

async function PageDataLoader({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <PageClient id={resolvedParams.id} />;
}

export default function TaskPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={null}>
      <PageDataLoader params={params} />
    </Suspense>
  );
}
