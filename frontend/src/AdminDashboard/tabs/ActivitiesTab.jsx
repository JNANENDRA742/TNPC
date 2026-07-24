// src/AdminDashboard/tabs/ActivitiesTab.jsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Activity,
    UserPlus,
    Award,
    Briefcase,
    CheckCircle,
    Filter,
    Search,
    Calendar,
    RefreshCw,
    Loader2
} from 'lucide-react';
import axios from 'axios';

const ActivitiesTab = ({ activities, onRefresh, isMobile }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [dateRange, setDateRange] = useState('all');
    const [departmentStats, setDepartmentStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [departmentStudents, setDepartmentStudents] = useState([]);
    const [showDepartmentDetails, setShowDepartmentDetails] = useState(false);
    const [expandedDepartments, setExpandedDepartments] = useState({});

    // Fetch department statistics
    const fetchDepartmentStats = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/students/department-stats`);
            if (response.data.success) {
                setDepartmentStats(response.data);
                // Auto-expand first department
                const firstDept = response.data.departmentNames[0];
                if (firstDept) {
                    setExpandedDepartments({ [firstDept]: true });
                }
            }
        } catch (error) {
            console.error('Error fetching department stats:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartmentStats();
    }, []);

    // Handle refresh with loading state
    const handleRefresh = async () => {
        if (refreshing) return; // Prevent multiple refreshes
        
        setRefreshing(true);
        try {
            await onRefresh();
        } catch (error) {
            console.error('Refresh error:', error);
        } finally {
            setRefreshing(false);
        }
    };

    // Fetch students for a specific department
    const fetchDepartmentStudents = async (department) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/students/department/${encodeURIComponent(department)}`);
            if (response.data.success) {
                setDepartmentStudents(response.data.students);
                setSelectedDepartment(department);
                setShowDepartmentDetails(true);
            }
        } catch (error) {
            console.error('Error fetching department students:', error);
        }
    };

    const getTimeAgo = (date) => {
        if (!date) return 'Recently';

        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) return 'Recently';

        const seconds = Math.floor((new Date() - dateObj) / 1000);
        if (seconds < 20) return 'Just now';

        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60
        };

        for (const [unit, secondsInUnit] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / secondsInUnit);
            if (interval >= 1) {
                return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
            }
        }
        return 'Just now';
    };

    const getActivityIcon = (type) => {
        switch (type) {
            case 'student_registered':
                return <UserPlus className="text-blue-600 w-4 h-4 sm:w-5 sm:h-5" />;
            case 'placement_added':
                return <Award className="text-green-600 w-4 h-4 sm:w-5 sm:h-5" />;
            case 'drive_added':
                return <Briefcase className="text-purple-600 w-4 h-4 sm:w-5 sm:h-5" />;
            default:
                return <CheckCircle className="text-gray-600 w-4 h-4 sm:w-5 sm:h-5" />;
        }
    };

    const getActivityBgColor = (type) => {
        switch (type) {
            case 'student_registered':
                return 'bg-blue-100';
            case 'placement_added':
                return 'bg-green-100';
            case 'drive_added':
                return 'bg-purple-100';
            default:
                return 'bg-gray-100';
        }
    };

    const getActivityTypeLabel = (type) => {
        switch (type) {
            case 'student_registered':
                return 'Student Registration';
            case 'placement_added':
                return 'Placement Added';
            case 'drive_added':
                return 'Drive Added';
            default:
                return 'Activity';
        }
    };

    // Filter activities
    const filteredActivities = activities.filter(activity => {
        const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            activity.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || activity.type === filterType;

        let matchesDate = true;
        if (dateRange !== 'all') {
            const now = new Date();
            const activityDate = new Date(activity.timestamp);
            const daysDiff = Math.floor((now - activityDate) / (1000 * 60 * 60 * 24));

            if (dateRange === 'today') {
                matchesDate = daysDiff === 0;
            } else if (dateRange === 'week') {
                matchesDate = daysDiff <= 7;
            } else if (dateRange === 'month') {
                matchesDate = daysDiff <= 30;
            }
        }

        return matchesSearch && matchesType && matchesDate;
    });

    const sortedActivities = [...filteredActivities].sort((a, b) =>
        new Date(b.timestamp) - new Date(a.timestamp)
    );

    // Get stats
    const totalActivities = activities.length;
    const studentRegistrations = activities.filter(a => a.type === 'student_registered').length;
    const placementAdditions = activities.filter(a => a.type === 'placement_added').length;
    const driveAdditions = activities.filter(a => a.type === 'drive_added').length;

    // Toggle department expansion
    const toggleDepartment = (deptName) => {
        setExpandedDepartments(prev => ({
            ...prev,
            [deptName]: !prev[deptName]
        }));
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Recent Activities</h2>
                    <p className="text-sm text-gray-500 mt-1">Track all activities across the platform</p>
                </div>
                <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {refreshing ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Refreshing...
                        </>
                    ) : (
                        <>
                            <RefreshCw className="w-4 h-4" />
                            Refresh
                        </>
                    )}
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4">
                    <p className="text-gray-500 text-xs">Total No.of Activities</p>
                    <p className="text-lg sm:text-xl font-bold text-gray-800">{totalActivities}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4">
                    <p className="text-gray-500 text-xs">No.of Students Registred</p>
                    <p className="text-lg sm:text-xl font-bold text-blue-600">{studentRegistrations}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4">
                    <p className="text-gray-500 text-xs">Placements Records Added</p>
                    <p className="text-lg sm:text-xl font-bold text-green-600">{placementAdditions}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4">
                    <p className="text-gray-500 text-xs">No.of Drives Added</p>
                    <p className="text-lg sm:text-xl font-bold text-purple-600">{driveAdditions}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search activities..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                        >
                            <option value="all">All Types</option>
                            <option value="student_registered">Student Registrations</option>
                            <option value="placement_added">Placement Additions</option>
                            <option value="drive_added">Drive Additions</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                        >
                            <option value="all">All Time</option>
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Activities List */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {refreshing ? (
                    <div className="text-center py-12 sm:py-16">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                        <p className="text-gray-500">Refreshing activities...</p>
                    </div>
                ) : sortedActivities.length === 0 ? (
                    <div className="text-center py-12 sm:py-16 text-gray-500">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <Activity className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                        </div>
                        <p className="text-base sm:text-lg font-medium">No activities found</p>
                        <p className="text-sm mt-1">Try adjusting your filters or refresh the page</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {sortedActivities.map((activity, index) => (
                            <motion.div
                                key={activity.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="p-4 sm:p-6 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-start gap-3 sm:gap-4">
                                    <div className={`w-10 h-10 sm:w-12 sm:h-12 ${getActivityBgColor(activity.type)} rounded-full flex items-center justify-center flex-shrink-0`}>
                                        {getActivityIcon(activity.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
                                            <div>
                                                <p className="text-sm sm:text-base font-semibold text-gray-900">
                                                    {activity.title}
                                                </p>
                                                <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">
                                                    {getActivityTypeLabel(activity.type)}
                                                </span>
                                                {activity.department && (
                                                    <span className="inline-block ml-2 px-2 py-0.5 bg-blue-100 rounded-full text-xs text-blue-600">
                                                        {activity.department}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-xs text-gray-400 whitespace-nowrap">
                                                {getTimeAgo(activity.timestamp)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {activity.description}
                                        </p>
                                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                                            <span>
                                                {new Date(activity.timestamp).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                            <span>•</span>
                                            <span>
                                                {new Date(activity.timestamp).toLocaleTimeString('en-US', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActivitiesTab;