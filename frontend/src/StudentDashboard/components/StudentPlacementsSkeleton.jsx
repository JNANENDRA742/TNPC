// components/StudentPlacementsSkeleton.jsx
import React from 'react';

const StudentPlacementsSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 animate-pulse">
      {/* Hero Section */}
      <div className="relative bg-gray-300 rounded-2xl mx-4 sm:mx-0 h-48">
        <div className="absolute inset-0 bg-gray-400 opacity-20 rounded-2xl"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="text-center">
            <div className="w-20 h-20 bg-gray-400 rounded-full mx-auto mb-6"></div>
            <div className="h-10 bg-gray-400 rounded w-64 mx-auto mb-4"></div>
            <div className="h-6 bg-gray-400 rounded w-96 mx-auto"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg p-6 h-32">
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-12"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-5 bg-gray-200 rounded"></div>
            <div className="h-6 bg-gray-200 rounded w-40"></div>
          </div>
          <div className="w-64 h-64 bg-gray-200 rounded-full mx-auto"></div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
            </div>
            <div className="h-12 bg-gray-200 rounded-lg w-32"></div>
          </div>
        </div>

        {/* Drive Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Header */}
              <div className="bg-gray-300 p-6 h-24">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-400 rounded-xl"></div>
                  <div>
                    <div className="h-6 bg-gray-400 rounded w-32 mb-2"></div>
                    <div className="h-4 bg-gray-400 rounded w-24"></div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="space-y-3 mb-6">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </div>
                  ))}
                </div>

                <div className="mb-4">
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3].map((k) => (
                      <div key={k} className="h-6 bg-gray-200 rounded-full w-20"></div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-1 h-12 bg-gray-200 rounded-lg"></div>
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentPlacementsSkeleton;