// components/StudentDashboardSkeleton.jsx
import React from 'react';
import { motion } from 'framer-motion';

const SkeletonCard = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl shadow-lg p-6 animate-pulse ${className}`}>
    {children}
  </div>
);

const SkeletonLine = ({ width = 'w-full', height = 'h-4', className = '' }) => (
  <div className={`bg-gray-200 rounded ${width} ${height} ${className}`}></div>
);

const SkeletonCircle = ({ size = 'w-12 h-12' }) => (
  <div className={`bg-gray-200 rounded-full ${size}`}></div>
);

const StudentDashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4 sm:p-6">
      {/* Header Section */}
      <div className="mb-8 animate-pulse">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-96"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded-lg w-32"></div>
        </div>
      </div>

      {/* Profile Overview Cards - Grid 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Personal Info Card */}
        <SkeletonCard>
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 bg-gray-200 rounded w-32"></div>
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          </div>
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-gray-300"></div>
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center">
                <div className="w-4 h-4 bg-gray-200 rounded mr-3"></div>
                <SkeletonLine width="w-16" height="h-3" />
                <SkeletonLine width="w-32" height="h-3" className="ml-2" />
              </div>
            ))}
          </div>
        </SkeletonCard>

        {/* Academic Info Card */}
        <SkeletonCard>
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 bg-gray-200 rounded w-32"></div>
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          </div>
          <div className="text-center mb-4">
            <div className="h-16 bg-gray-200 rounded w-24 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-20 mx-auto mt-2"></div>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <SkeletonLine width="w-24" height="h-3" />
                <SkeletonLine width="w-12" height="h-3" />
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full"></div>
            </div>
            <div className="flex justify-between items-center pt-2">
              <SkeletonLine width="w-40" height="h-3" />
              <SkeletonLine width="w-12" height="h-4" />
            </div>
          </div>
        </SkeletonCard>

        {/* Skills Card */}
        <SkeletonCard>
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 bg-gray-200 rounded w-32"></div>
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          </div>
          <div className="mb-4">
            <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-8 bg-gray-200 rounded-full w-16"></div>
              ))}
            </div>
          </div>
          <div>
            <div className="h-5 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-4 h-4 bg-gray-200 rounded mt-0.5"></div>
                  <div className="h-4 bg-gray-200 rounded w-40"></div>
                </div>
              ))}
            </div>
          </div>
        </SkeletonCard>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-200 rounded-2xl shadow-lg p-6 animate-pulse h-32"></div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <SkeletonCard className="h-80">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 bg-gray-200 rounded w-32"></div>
            <div className="w-5 h-5 bg-gray-200 rounded"></div>
          </div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </SkeletonCard>

        <SkeletonCard className="h-80">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 bg-gray-200 rounded w-32"></div>
            <div className="w-5 h-5 bg-gray-200 rounded"></div>
          </div>
          <div className="flex justify-center">
            <div className="w-48 h-48 bg-gray-200 rounded-full"></div>
          </div>
          <div className="text-center mt-4">
            <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
            <div className="h-8 bg-gray-200 rounded w-20 mx-auto mt-1"></div>
          </div>
        </SkeletonCard>
      </div>

      {/* Placement Trends & Skill Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <SkeletonCard className="h-80">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 bg-gray-200 rounded w-32"></div>
            <div className="w-5 h-5 bg-gray-200 rounded"></div>
          </div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </SkeletonCard>

        <SkeletonCard className="h-80">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 bg-gray-200 rounded w-32"></div>
            <div className="w-5 h-5 bg-gray-200 rounded"></div>
          </div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </SkeletonCard>
      </div>

      {/* Upcoming Drives & Resume Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkeletonCard className="h-80">
          <div className="h-12 bg-gray-200 rounded-t-2xl -m-6 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-3 bg-gray-200 rounded w-24 mt-1"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        </SkeletonCard>

        <SkeletonCard className="h-80">
          <div className="h-12 bg-gray-200 rounded-t-2xl -m-6 mb-4"></div>
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-3"></div>
            <div className="h-5 bg-gray-200 rounded w-32 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-48 mx-auto"></div>
            <div className="mt-4">
              <div className="h-10 bg-gray-200 rounded-lg w-40 mx-auto"></div>
            </div>
          </div>
        </SkeletonCard>
      </div>
    </div>
  );
};

export default StudentDashboardSkeleton;