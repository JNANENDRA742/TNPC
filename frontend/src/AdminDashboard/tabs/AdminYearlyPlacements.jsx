import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid, PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  Plus, Edit, Trash2, Save, X, Calendar, TrendingUp,
  Building2, Users, Award, BarChart3, PieChart as PieChartIcon,
  RefreshCw, Search, Filter
} from 'lucide-react';
import axios from 'axios';
import { useAlert } from '../../components/Alert';

const AdminYearlyPlacements = () => {
  const { showAlert, AlertComponent } = useAlert();
  const [yearlyPlacements, setYearlyPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({
    year: '',
    totalPlaced: '',
    totalCompanies: '',
    highestPackage: '',
    averagePackage: '',
    totalStudents: ''
  });

  // Modern vibrant color palette for pie chart
  const COLORS = [
    '#6366f1', // Indigo
    '#8b5cf6', // Violet
    '#a855f7', // Purple
    '#d946ef', // Fuchsia
    '#ec4899', // Pink
    '#f43f5e', // Rose
    '#ef4444', // Red
    '#f59e0b', // Amber
    '#10b981', // Emerald
    '#06b6d4', // Cyan
    '#3b82f6', // Blue
    '#8b5cf6'  // Violet
  ];

  // Get color with gradient effect based on index
  const getColor = (index) => {
    return COLORS[index % COLORS.length];
  };

  useEffect(() => {
    fetchYearlyPlacements();
  }, []);

  const fetchYearlyPlacements = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/yearly-placements`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setYearlyPlacements(res.data);
      showAlert('✅ Yearly placements loaded successfully', 'success', 3000);
    } catch (error) {
      console.error('Error fetching yearly placements:', error);
      showAlert('❌ Failed to load yearly placements', 'error', 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setIsEditing(true);
      setCurrentItem(item);
      setFormData({
        year: item.year || '',
        totalPlaced: item.totalPlaced || '',
        totalCompanies: item.totalCompanies || '',
        highestPackage: item.highestPackage || '',
        averagePackage: item.averagePackage || '',
        totalStudents: item.totalStudents || ''
      });
    } else {
      setIsEditing(false);
      setCurrentItem(null);
      setFormData({
        year: '',
        totalPlaced: '',
        totalCompanies: '',
        highestPackage: '',
        averagePackage: '',
        totalStudents: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentItem(null);
    setFormData({
      year: '',
      totalPlaced: '',
      totalCompanies: '',
      highestPackage: '',
      averagePackage: '',
      totalStudents: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.year || !formData.totalPlaced) {
      showAlert('⚠️ Year and Total Placed are required fields', 'warning', 3000);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const url = isEditing 
        ? `${import.meta.env.VITE_BACKEND_URL}/admin/yearly-placements/${currentItem._id}`
        : `${import.meta.env.VITE_BACKEND_URL}/admin/yearly-placements`;
      
      const method = isEditing ? 'put' : 'post';
      
      const response = await axios({
        method,
        url,
        data: {
          year: parseInt(formData.year),
          totalPlaced: parseInt(formData.totalPlaced),
          totalCompanies: parseInt(formData.totalCompanies) || 0,
          highestPackage: parseFloat(formData.highestPackage) || 0,
          averagePackage: parseFloat(formData.averagePackage) || 0,
          totalStudents: parseInt(formData.totalStudents) || 0
        },
        headers: { Authorization: `Bearer ${token}` }
      });

      showAlert(
        isEditing ? '✅ Yearly placement updated successfully' : '✅ Yearly placement added successfully',
        'success',
        3000
      );
      
      handleCloseModal();
      fetchYearlyPlacements();
    } catch (error) {
      console.error('Error saving yearly placement:', error);
      showAlert(`❌ Failed to ${isEditing ? 'update' : 'add'} yearly placement`, 'error', 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this yearly placement record?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/admin/yearly-placements/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      showAlert('✅ Yearly placement deleted successfully', 'success', 3000);
      fetchYearlyPlacements();
    } catch (error) {
      console.error('Error deleting yearly placement:', error);
      showAlert('❌ Failed to delete yearly placement', 'error', 3000);
    }
  };

  // Filter data based on search
  const filteredData = yearlyPlacements.filter(item => 
    item.year.toString().includes(searchTerm) ||
    item.totalPlaced.toString().includes(searchTerm)
  );

  // Calculate total statistics
  const totalPlaced = yearlyPlacements.reduce((sum, item) => sum + (item.totalPlaced || 0), 0);
  const totalCompanies = yearlyPlacements.reduce((sum, item) => sum + (item.totalCompanies || 0), 0);
  const avgHighestPackage = yearlyPlacements.length > 0 
    ? (yearlyPlacements.reduce((sum, item) => sum + (item.highestPackage || 0), 0) / yearlyPlacements.length).toFixed(1)
    : 0;

  // Pie data for placement distribution
  const pieData = yearlyPlacements.map(item => ({
    name: item.year.toString(),
    value: item.totalPlaced || 0
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <BarChart3 className="w-8 h-8 text-blue-600 animate-pulse" />
            </div>
          </div>
          <p className="mt-6 text-lg font-semibold text-gray-700">Loading Yearly Placements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-4 md:p-6">
      {AlertComponent}

      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Yearly Placements
              </h1>
              <p className="text-gray-500 mt-1">Manage yearly placement statistics with ease</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchYearlyPlacements}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
              <button
                onClick={() => handleOpenModal()}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg flex items-center gap-2 font-medium"
              >
                <Plus size={18} />
                Add New Year
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Years</p>
                <p className="text-2xl font-bold text-gray-900">{yearlyPlacements.length}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Placed</p>
                <p className="text-2xl font-bold text-gray-900">{totalPlaced}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Companies</p>
                <p className="text-2xl font-bold text-gray-900">{totalCompanies}</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg Highest Package</p>
                <p className="text-2xl font-bold text-gray-900">{avgHighestPackage} LPA</p>
              </div>
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Yearly Trend
              </h2>
              <span className="text-xs text-gray-400">Students placed per year</span>
            </div>
            {yearlyPlacements.length === 0 ? (
              <div className="flex items-center justify-center h-[280px]">
                <p className="text-gray-400 text-sm">No data available</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={yearlyPlacements}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis 
                    dataKey="year" 
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: 'none',
                      backgroundColor: '#fff',
                      padding: '10px 14px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                    formatter={(value) => [`${value} students`, 'Placed']}
                  />
                  <Bar
                    dataKey="totalPlaced"
                    fill="#1a365d"
                    radius={[4, 4, 0, 0]}
                    barSize={50}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-purple-600" />
                Distribution
              </h2>
              <span className="text-xs text-gray-400">Placement share per year</span>
            </div>
            {pieData.length === 0 ? (
              <div className="flex items-center justify-center h-[280px]">
                <p className="text-gray-400 text-sm">No data available</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={2}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={getColor(index)}
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: 'none',
                      backgroundColor: '#fff',
                      padding: '10px 14px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                    formatter={(value) => [`${value} students`, 'Placed']}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value, entry, index) => (
                      <span style={{ color: '#374151', fontSize: '12px' }}>
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Yearly Records</h2>
              <p className="text-sm text-gray-400 mt-1">Manage yearly placement data</p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by year..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-64 text-sm"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Placed</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Companies</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Highest Package</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Average Package</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-400 text-sm">
                      No yearly placement records found
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-medium text-gray-900">{item.year}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-blue-600 font-semibold">{item.totalPlaced}</span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-gray-600">{item.totalCompanies || '-'}</span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-gray-600">{item.highestPackage || '-'} LPA</span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-gray-600">{item.averagePackage || '-'} LPA</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenModal(item)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {filteredData.length > 0 && (
            <div className="mt-4 text-sm text-gray-500">
              Showing {filteredData.length} of {yearlyPlacements.length} records
            </div>
          )}
        </div>
      </div>

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {isEditing ? 'Edit Yearly Placement' : 'Add New Yearly Placement'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    placeholder="e.g., 2024"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    min="2000"
                    max="2030"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Placed <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="totalPlaced"
                    value={formData.totalPlaced}
                    onChange={handleInputChange}
                    placeholder="e.g., 150"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Companies
                  </label>
                  <input
                    type="number"
                    name="totalCompanies"
                    value={formData.totalCompanies}
                    onChange={handleInputChange}
                    placeholder="e.g., 25"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Highest Package (LPA)
                  </label>
                  <input
                    type="number"
                    name="highestPackage"
                    value={formData.highestPackage}
                    onChange={handleInputChange}
                    placeholder="e.g., 45"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    step="0.1"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Average Package (LPA)
                  </label>
                  <input
                    type="number"
                    name="averagePackage"
                    value={formData.averagePackage}
                    onChange={handleInputChange}
                    placeholder="e.g., 12.5"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    step="0.1"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Students (Eligible)
                  </label>
                  <input
                    type="number"
                    name="totalStudents"
                    value={formData.totalStudents}
                    onChange={handleInputChange}
                    placeholder="e.g., 300"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg font-medium flex items-center gap-2"
                >
                  <Save size={18} />
                  {isEditing ? 'Update Record' : 'Add Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminYearlyPlacements;