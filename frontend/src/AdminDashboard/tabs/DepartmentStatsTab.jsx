// src/AdminDashboard/tabs/DepartmentStatsTab.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  GraduationCap,
  Building2,
  Award,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  Search,
  RefreshCw,
  BarChart3,
  PieChart,
  AlertCircle,
  Download,
  Eye,
  UserPlus,
  Calendar,
  Briefcase,
  Star,
  Filter,
  X,
  FileText,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Globe,
  UserCircle,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Zap,
  Target,
  Crown,
  Trophy
} from 'lucide-react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
  RadialLinearScale
} from 'chart.js';
import { Bar, Doughnut, Line, Radar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
  RadialLinearScale
);

const DepartmentStatsTab = ({ activities, stats, isMobile }) => {
  const [departmentStats, setDepartmentStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedDepartments, setExpandedDepartments] = useState({});
  const [viewMode, setViewMode] = useState('overview');
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('placements');

  // Colors for charts
  const COLORS = [
    '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444',
    '#EC4899', '#14B8A6', '#6366F1', '#F97316', '#06B6D4'
  ];

  // Department display name mapping
  const departmentDisplayNames = {
    'Computer Science & Engineering': 'CSE',
    'Electronics & Communication Engineering': 'ECE',
    'Electrical & Electronics Engineering': 'EEE',
    'Mechanical Engineering': 'MECH',
    'Civil Engineering': 'CIVIL',
    'Metallurgical Engineering': 'METALLURGY',
    'Artificial Intelligence & Machine Learning': 'AIML',
  };



  const getDisplayName = (deptName) => {
    return departmentDisplayNames[deptName] || deptName;
  };

  const fetchDepartmentStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please login again.');
        setLoading(false);
        return;
      }

      const url = `${import.meta.env.VITE_BACKEND_URL}/admin/department/stats`;

      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        console.log('✅ Department stats fetched:', response.data);
        setDepartmentStats(response.data);

        // Auto-expand first valid department if exists
        const firstDept = response.data.departments?.find(d => d.department !== 'Not Specified');
        if (firstDept) {
          setExpandedDepartments({ [firstDept.department]: true });
        }
      } else {
        setError(response.data.message || 'Failed to fetch department stats');
      }
    } catch (error) {
      console.error('❌ Error fetching department stats:', error);
      if (error.response) {
        if (error.response.status === 401) {
          setError('Session expired. Please login again.');
        } else if (error.response.status === 403) {
          setError('You do not have permission to view this data.');
        } else {
          setError(error.response.data?.message || `Server error: ${error.response.status}`);
        }
      } else if (error.request) {
        setError('Unable to reach the server. Please check your connection.');
      } else {
        setError(error.message || 'Failed to fetch department data');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartmentStats();
  }, []);

  const toggleDepartment = (deptName) => {
    setExpandedDepartments(prev => ({
      ...prev,
      [deptName]: !prev[deptName]
    }));
  };

  const getDepartmentColor = (index) => {
    return COLORS[index % COLORS.length];
  };

  const getStatusBadge = (rate) => {
    if (rate >= 70) {
      return { color: 'bg-green-100 text-green-800', icon: <Trophy className="w-3 h-3" />, label: 'Excellent' };
    } else if (rate >= 50) {
      return { color: 'bg-blue-100 text-blue-800', icon: <Target className="w-3 h-3" />, label: 'Good' };
    } else if (rate >= 30) {
      return { color: 'bg-yellow-100 text-yellow-800', icon: <AlertTriangle className="w-3 h-3" />, label: 'Average' };
    } else if (rate > 0) {
      return { color: 'bg-red-100 text-red-800', icon: <AlertCircle className="w-3 h-3" />, label: 'Needs Improvement' };
    } else {
      return { color: 'bg-gray-100 text-gray-600', icon: <XCircle className="w-3 h-3" />, label: 'No Placements' };
    }
  };

  // Filter and sort departments
  const filteredDepartments = useMemo(() => {
    if (!departmentStats?.departments) return [];

    let filtered = [...departmentStats.departments];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(dept =>
        dept.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by placement rate
    if (filter === 'excellent') {
      filtered = filtered.filter(dept => dept.placementPercentage >= 70);
    } else if (filter === 'good') {
      filtered = filtered.filter(dept => dept.placementPercentage >= 50 && dept.placementPercentage < 70);
    } else if (filter === 'average') {
      filtered = filtered.filter(dept => dept.placementPercentage >= 30 && dept.placementPercentage < 50);
    } else if (filter === 'poor') {
      filtered = filtered.filter(dept => dept.placementPercentage < 30 && dept.placementPercentage > 0);
    } else if (filter === 'no-placement') {
      filtered = filtered.filter(dept => dept.placementPercentage === 0 && dept.totalStudents > 0);
    }

    // Sort
    switch (sortBy) {
      case 'students':
        filtered.sort((a, b) => b.totalStudents - a.totalStudents);
        break;
      case 'placements':
        filtered.sort((a, b) => b.placedStudents - a.placedStudents);
        break;
      case 'rate':
        filtered.sort((a, b) => b.placementPercentage - a.placementPercentage);
        break;
      case 'cgpa':
        filtered.sort((a, b) => b.averageCGPA - a.averageCGPA);
        break;
      default:
        break;
    }

    return filtered;
  }, [departmentStats, searchTerm, filter, sortBy]);

  // Chart data preparation
  const chartData = useMemo(() => {
    if (!departmentStats?.departments) return null;

    // Filter out "Not Specified" for charts
    const depts = departmentStats.departments.filter(d => d.department !== 'Not Specified');

    if (depts.length === 0) return null;

    const labels = depts.map(d => d.displayName || d.department);

    return {
      students: {
        labels,
        datasets: [{
          label: 'Total Students',
          data: depts.map(d => d.totalStudents),
          backgroundColor: COLORS.slice(0, depts.length).map(c => c + '80'),
          borderColor: COLORS.slice(0, depts.length),
          borderWidth: 2
        }]
      },
      placements: {
        labels,
        datasets: [{
          label: 'Placed Students',
          data: depts.map(d => d.placedStudents),
          backgroundColor: COLORS.slice(0, depts.length).map(c => c + '80'),
          borderColor: COLORS.slice(0, depts.length),
          borderWidth: 2
        }]
      },
      rates: {
        labels,
        datasets: [{
          label: 'Placement Rate (%)',
          data: depts.map(d => d.placementPercentage),
          backgroundColor: depts.map(d => {
            if (d.placementPercentage >= 70) return '#10B98180';
            if (d.placementPercentage >= 50) return '#3B82F680';
            if (d.placementPercentage >= 30) return '#F59E0B80';
            return '#EF444480';
          }),
          borderColor: depts.map(d => {
            if (d.placementPercentage >= 70) return '#10B981';
            if (d.placementPercentage >= 50) return '#3B82F6';
            if (d.placementPercentage >= 30) return '#F59E0B';
            return '#EF4444';
          }),
          borderWidth: 2
        }]
      },
      // Student Distribution Pie
      studentPie: {
        labels: depts.map(d => d.displayName || d.department),
        datasets: [{
          data: depts.map(d => d.totalStudents),
          backgroundColor: COLORS.slice(0, depts.length),
          borderColor: '#ffffff',
          borderWidth: 2
        }]
      },
      // Placement Distribution Pie
      placementPie: {
        labels: depts.map(d => d.displayName || d.department),
        datasets: [{
          data: depts.map(d => d.placedStudents),
          backgroundColor: COLORS.slice(0, depts.length),
          borderColor: '#ffffff',
          borderWidth: 2
        }]
      }
    };
  }, [departmentStats]);

  // Summary statistics
  const summary = departmentStats?.summary || {};
  const totalStats = {
    totalDepartments: departmentStats?.totalDepartments || 0,
    totalStudents: departmentStats?.totalStudents || 0,
    studentsWithValidCGPA: departmentStats?.studentsWithValidCGPA || 0,
    totalPlacements: departmentStats?.totalPlacements || 0,
    incompleteProfiles: summary.totalIncompleteProfiles || 0,
    notSpecified: summary.totalNotSpecifiedDepartment || 0
  };
  const overallPlacementRate = stats?.placementRate || 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading department statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <div className="flex flex-col items-center">
          <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Loading Data</h3>
          <p className="text-gray-500 max-w-md">{error}</p>
          <button
            onClick={fetchDepartmentStats}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!departmentStats || !departmentStats.departments || departmentStats.departments.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">No Data Available</h3>
        <p className="text-gray-500">No department data found. Add students and placements to see statistics.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Building2 className="w-7 h-7 text-blue-600" />
            Department Analytics
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Comprehensive overview of department-wise student placement statistics
          </p>
        </div>
        <button
          onClick={fetchDepartmentStats}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 text-sm"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Data
        </button>
      </div>

      {/* Stats Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase">Departments</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{totalStats.totalDepartments}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase">Total Students</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{totalStats.totalStudents}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
          </div>
          
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase">Placements</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{totalStats.totalPlacements}</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Award className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </motion.div>

        {/* Updated Avg Placement Rate Card - Using stats from useAdminData */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase">Avg Placement Rate</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {overallPlacementRate}%
              </p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {totalStats.totalStudents} total students
          </p>
        </motion.div>
      </div>

      {/* View Mode and Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setViewMode('overview')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${viewMode === 'overview'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              <BarChart3 className="w-4 h-4" />
              Overview
            </button>
            <button
              onClick={() => setViewMode('detailed')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${viewMode === 'detailed'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              <PieChart className="w-4 h-4" />
              Detailed
            </button>
            <button
              onClick={() => setViewMode('comparison')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${viewMode === 'comparison'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              <Target className="w-4 h-4" />
              Comparison
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search departments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm w-full md:w-48"
              />
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="all">All Departments</option>
              <option value="excellent">Excellent (≥70%)</option>
              <option value="good">Good (50-69%)</option>
              <option value="average">Average (30-49%)</option>
              <option value="poor">Poor (&lt;30%)</option>
              <option value="no-placement">No Placements</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="students">Sort by Students</option>
              <option value="placements">Sort by Placements</option>
              <option value="rate">Sort by Rate</option>
              <option value="cgpa">Sort by CGPA</option>
            </select>
          </div>
        </div>
      </div>

      {/* Overview View */}
      {viewMode === 'overview' && chartData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Student Distribution Bar Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Student Distribution by Department
            </h3>
            <div className="h-72">
              <Bar
                data={chartData.students}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: (context) => `Students: ${context.raw}`
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: { stepSize: 1 }
                    }
                  }
                }}
              />
            </div>
          </motion.div>

          {/* Placement Distribution Doughnut Chart - REPLACED PIE CHART */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600" />
              Placement Distribution by Department
            </h3>
            <div className="h-72 relative">
              <Doughnut
                data={chartData.placementPie}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: {
                        font: { size: 11 },
                        padding: 10
                      }
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          const label = context.label || '';
                          const value = context.raw || 0;
                          const total = context.dataset.data.reduce((a, b) => a + b, 0);
                          const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                          return `${label}: ${value} placed (${percentage}%)`;
                        }
                      }
                    }
                  }
                }}
              />
              {/* Show "No placements" message if total is 0 */}
              {chartData.placementPie.datasets[0].data.reduce((a, b) => a + b, 0) === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-white/90 px-6 py-3 rounded-lg shadow-sm border border-gray-200">
                    <p className="text-gray-500 text-sm font-medium">No placements recorded yet</p>
                  </div>
                </div>
              )}
            </div>
            {/* Small stats below the chart */}
            <div className="mt-3 flex justify-center gap-6 text-sm text-gray-600">
              <span>Total: <strong className="text-purple-600">{chartData.placementPie.datasets[0].data.reduce((a, b) => a + b, 0)}</strong></span>
              <span>Departments: <strong className="text-purple-600">{chartData.placementPie.labels.length}</strong></span>
            </div>
          </motion.div>

          {/* Placement Rate Bar Chart - Full Width */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 lg:col-span-2"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-green-600" />
              Placement Rate by Department
            </h3>
            <div className="h-72">
              <Bar
                data={chartData.rates}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: (context) => `Placement Rate: ${context.raw}%`
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                      ticks: { callback: (value) => value + '%' }
                    }
                  }
                }}
              />
            </div>
          </motion.div>
        </div>
      )}

      {/* Detailed View - Department List */}
      {(viewMode === 'detailed' || viewMode === 'comparison') && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Students
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Placed
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rate
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Avg CGPA
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDepartments.map((dept, index) => {
                  const status = getStatusBadge(dept.placementPercentage);
                  const color = getDepartmentColor(index);
                  const displayName = dept.displayName || dept.department;

                  return (
                    <React.Fragment key={dept.department}>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 sm:px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-3 h-3 rounded-full flex-shrink-0"
                              style={{ backgroundColor: color }}
                            />
                            <span className="font-medium text-gray-800">
                              {displayName}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <span className="font-semibold text-blue-600">{dept.totalStudents}</span>
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <span className="font-semibold text-green-600">{dept.placedStudents}</span>
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${Math.min(dept.placementPercentage, 100)}%`,
                                  backgroundColor: dept.placementPercentage >= 70 ? '#10B981' :
                                    dept.placementPercentage >= 50 ? '#3B82F6' :
                                      dept.placementPercentage >= 30 ? '#F59E0B' : '#EF4444'
                                }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-700 min-w-[40px]">
                              {dept.placementPercentage}%
                            </span>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 hidden md:table-cell">
                          <span className="text-gray-600">{dept.averageCGPA}</span>
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                            {status.icon}
                            {status.label}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <button
                            onClick={() => toggleDepartment(dept.department)}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                          >
                            {expandedDepartments[dept.department] ? 'Hide Placements' : 'View Placements'}
                            {expandedDepartments[dept.department] ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Row - Placements Only */}
                      <AnimatePresence>
                        {expandedDepartments[dept.department] && (
                          <tr>
                            <td colSpan="7" className="px-0">
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <div className="p-6 bg-gray-50 border-t border-gray-200">
                                  <div className="max-w-2xl mx-auto">
                                    {/* Placements List - Full Width */}
                                    <div>
                                      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                        <Award className="w-4 h-4 text-green-600" />
                                        Recent Placements
                                      </h4>
                                      {dept.placements && dept.placements.length > 0 ? (
                                        <div className="space-y-2 max-h-60 overflow-y-auto">
                                          {dept.placements.slice(0, 10).map((placement, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition border border-gray-100">
                                              <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-sm font-medium flex-shrink-0">
                                                  <Briefcase className="w-5 h-5" />
                                                </div>
                                                <div>
                                                  <p className="text-sm font-semibold text-gray-800">{placement.name || 'Unknown'}</p>
                                                  <p className="text-xs text-gray-500">{placement.company || 'N/A'}</p>
                                                </div>
                                              </div>
                                              <div className="flex items-center gap-4">
                                                <span className="text-sm font-semibold text-green-600">₹{placement.package || 'N/A'} LPA</span>
                                                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                                                  {placement.year || 'N/A'}
                                                </span>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
                                          <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                                          <p className="text-sm text-gray-500">No placements recorded for this department</p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            </td>
                          </tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredDepartments.length === 0 && (
            <div className="p-12 text-center">
              <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No departments found matching your criteria</p>
            </div>
          )}
        </motion.div>
      )}

      {/* Additional Insights */}
      {viewMode === 'comparison' && departmentStats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            Performance Insights
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
              <p className="text-sm text-blue-700 font-medium">Top Performing Department</p>
              {departmentStats.departments && departmentStats.departments.length > 0 && (
                <>
                  <p className="text-2xl font-bold text-blue-800 mt-1">
                    {departmentStats.departments
                      .filter(d => d.department !== 'Not Specified')
                      .sort((a, b) => b.placementPercentage - a.placementPercentage)[0]?.displayName || 'N/A'}
                  </p>
                  <p className="text-sm text-blue-600">
                    {departmentStats.departments
                      .filter(d => d.department !== 'Not Specified')
                      .sort((a, b) => b.placementPercentage - a.placementPercentage)[0]?.placementPercentage || 0}% Placement Rate
                  </p>
                </>
              )}
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
              <p className="text-sm text-green-700 font-medium">Most Students</p>
              {departmentStats.departments && departmentStats.departments.length > 0 && (
                <>
                  <p className="text-2xl font-bold text-green-800 mt-1">
                    {departmentStats.departments
                      .filter(d => d.department !== 'Not Specified')
                      .sort((a, b) => b.totalStudents - a.totalStudents)[0]?.displayName || 'N/A'}
                  </p>
                  <p className="text-sm text-green-600">
                    {departmentStats.departments
                      .filter(d => d.department !== 'Not Specified')
                      .sort((a, b) => b.totalStudents - a.totalStudents)[0]?.totalStudents || 0} Students
                  </p>
                </>
              )}
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
              <p className="text-sm text-purple-700 font-medium">Highest Avg CGPA</p>
              {departmentStats.departments && departmentStats.departments.length > 0 && (
                <>
                  <p className="text-2xl font-bold text-purple-800 mt-1">
                    {departmentStats.departments
                      .filter(d => d.department !== 'Not Specified' && d.averageCGPA > 0)
                      .sort((a, b) => b.averageCGPA - a.averageCGPA)[0]?.displayName || 'N/A'}
                  </p>
                  <p className="text-sm text-purple-600">
                    {departmentStats.departments
                      .filter(d => d.department !== 'Not Specified' && d.averageCGPA > 0)
                      .sort((a, b) => b.averageCGPA - a.averageCGPA)[0]?.averageCGPA || 0} CGPA
                  </p>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DepartmentStatsTab;