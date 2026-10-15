export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600 font-medium">Recupero dati dal server...</p>
      </div>
    </div>
  );
}
