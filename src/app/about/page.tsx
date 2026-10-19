import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="bg-gray-100 text-gray-800 p-6 min-h-screen flex flex-col items-center justify-center">
      <div className="max-w-2xl bg-white p-8 rounded-xl shadow-sm text-center">
        <h1 className="text-3xl font-bold mb-4 text-sky-600">Info sul Progetto</h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Questa è una Taskboard moderna costruita con React 19, TypeScript, Tailwind CSS e il
          potentissimo App Router di Next.js. Ogni cartella è una rotta, e il codice è completamente
          tipizzato!
        </p>
      </div>
    </div>
  );
}
