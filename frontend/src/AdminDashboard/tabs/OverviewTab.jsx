// src/AdminDashboard/tabs/OverviewTab.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { PieChart } from 'lucide-react';
import StatsCards from '../components/StatsCards';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const OverviewTab = ({ stats, isMobile }) => {
    
  // Placement Distribution Data
  const placementData = {
    labels: ['Placed', 'Not Placed'],
    datasets: [{
      data: [
        stats.totalPlacements || 0,
        Math.max(0, (stats.totalStudents || 0) - (stats.totalPlacements || 0))
      ],
      backgroundColor: ['#10B981', '#E5E7EB'],
      borderColor: ['#059669', '#D1D5DB'],
      borderWidth: 2
    }]
  };

  return (
    <div>
      <StatsCards stats={stats} />

      {/* Placement Distribution Section */}
      <div className="mt-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-800">Placement Distribution</h3>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="w-full sm:w-1/2 max-w-[200px] mx-auto">
              <Doughnut
                data={placementData}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: { 
                    legend: { 
                      position: 'bottom',
                      labels: {
                        font: { size: 11 },
                        padding: 10
                      }
                    }
                  },
                  cutout: '65%'
                }}
              />
            </div>
            <div className="w-full sm:w-1/2 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-600">Placed</span>
                </div>
                <span className="font-semibold">{stats.totalPlacements || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                  <span className="text-sm text-gray-600">Not Placed</span>
                </div>
                <span className="font-semibold">
                  {Math.max(0, (stats.totalStudents || 0) - (stats.totalPlacements || 0))}
                </span>
              </div>
              <div className="pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Students</span>
                  <span className="font-bold">{stats.totalStudents || 0}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-gray-600">Placement Rate</span>
                  <span className="font-bold text-green-600">{stats.placementRate || 0}%</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OverviewTab;