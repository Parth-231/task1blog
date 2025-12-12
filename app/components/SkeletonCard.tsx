"use client";

interface SkeletonCardProps {
  isListView?: boolean;
}

export default function SkeletonCard({ isListView = false }: SkeletonCardProps) {
  if (isListView) {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden mb-6 animate-pulse w-full">
        <div className="flex flex-col lg:flex-row gap-6 p-6">
          {/* Image skeleton for list view */}
          <div className="lg:w-1/3">
            <div className="w-full h-48 lg:h-full bg-gray-200 rounded-lg" />
          </div>
          
          {/* Content skeleton for list view */}
          <div className="lg:w-2/3 flex flex-col">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-full mb-2" />
            <div className="h-4 bg-gray-200 rounded w-full mb-4" />
            <div className="h-10 bg-gray-300 rounded w-32 mt-auto" />
          </div>
        </div>
      </div>
    );
  }

  // Default grid view skeleton
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden mb-6 animate-pulse h-full flex flex-col">
      <div className="w-full h-48 bg-gray-200" />
      <div className="p-6 flex flex-col flex-grow">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-full mb-2" />
        <div className="h-4 bg-gray-200 rounded w-full mb-4 flex-grow" />
        <div className="h-10 bg-gray-300 rounded w-32" />
      </div>
    </div>
  );
}