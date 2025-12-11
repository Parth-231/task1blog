export default function SkeletonCard() {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden mb-6 animate-pulse">
      <div className="w-full h-48 bg-gray-200" />
      <div className="p-6">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-full mb-2" />
      </div>
    </div>
  );
}
