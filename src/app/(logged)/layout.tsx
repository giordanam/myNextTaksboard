import Header from '@/components/Header';
import GlobalModals from '@/components/GlobalModals';

export default function Layout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="bg-gray-100 text-gray-800 min-h-screen">
        <div className="max-w-7xl mx-auto p-6 border border-red-500">{children}</div>
        {modal}
      </main>
      <GlobalModals />
    </>
  );
}
