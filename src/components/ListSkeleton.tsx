export default function ListSkeleton() {
  return (
    <div className="grid grid-cols-3 mt-5 gap-6">
      {[1, 2, 3].map((colIndex) => (
        <div key={colIndex} className="bg-gray-100 p-4 rounded-lg">
          {/* Titolo della colonna */}
          <div className="h-6 w-1/3 bg-gray-300 rounded mb-4 animate-pulse" />

          {/* Sagome semplici delle Card */}
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((cardIndex) => (
              <div
                key={cardIndex}
                className="bg-white rounded-lg border border-gray-200 shadow-sm h-32 animate-pulse"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
