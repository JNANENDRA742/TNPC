import { Calendar, Check, CheckCircle, Clock, MapPin, Users, Briefcase, Building, DollarSign, Award, Star, TrendingUp, Sparkles, Rocket, Filter, Search, ChevronDown, ExternalLink, CalendarDays, UserCheck, Zap, Brain, Target, Globe } from 'lucide-react'
import React, { useState, useEffect, useMemo } from 'react'
import axios from 'axios';
import { useAlert } from '../components/Alert';
import { LuRocket } from 'react-icons/lu';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Drives = () => {
    const navigate = useNavigate();
    const { showAlert, AlertComponent } = useAlert();
    const [companyDrives, setCompanyDrives] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [selectedDrive, setSelectedDrive] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/companydrives`);
                // Calculate status based on date
                const drivesWithStatus = res.data.map(drive => {
                    const now = new Date();
                    const driveDate = new Date(drive.date);
                    const diffInDays = (driveDate - now) / (1000 * 60 * 60 * 24);

                    let status = drive.status;
                    if (diffInDays < 0) status = 'completed';
                    else if (diffInDays <= 2) status = 'ongoing';
                    else status = 'upcoming';

                    return { ...drive, status };
                });
                setCompanyDrives(drivesWithStatus);
                setLoading(false);
                showAlert(
                    <div className='flex items-center gap-2'>
                        🚀 Welcome to Placement Drives! Explore opportunities
                    </div>,
                    "success",
                    4000
                );
            } catch (err) {
                console.log(err);
                setLoading(false);
                showAlert('Failed to load company drives', 'error', 4000);
            }
        }
        fetchData();
    }, []);

    // Filter drives based on search and type
    const filteredDrives = useMemo(() => {
        let filtered = companyDrives;

        if (searchTerm) {
            filtered = filtered.filter(d =>
                d.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                d.roles.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterType !== 'all') {
            filtered = filtered.filter(d => d.status === filterType);
        }

        return filtered;
    }, [companyDrives, searchTerm, filterType]);

    // Get filtered drives by status
    const upcomingDrives = useMemo(() => {
        let filtered = companyDrives;
        if (searchTerm) {
            filtered = filtered.filter(d =>
                d.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                d.roles.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        return filtered.filter(d => d.status === 'upcoming');
    }, [companyDrives, searchTerm]);

    const ongoingDrives = useMemo(() => {
        let filtered = companyDrives;
        if (searchTerm) {
            filtered = filtered.filter(d =>
                d.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                d.roles.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        return filtered.filter(d => d.status === 'ongoing');
    }, [companyDrives, searchTerm]);

    const completedDrives = useMemo(() => {
        let filtered = companyDrives;
        if (searchTerm) {
            filtered = filtered.filter(d =>
                d.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                d.roles.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        return filtered.filter(d => d.status === 'completed');
    }, [companyDrives, searchTerm]);

    const stats = {
        total: companyDrives.length,
        upcoming: companyDrives.filter(d => d.status === 'upcoming').length,
        ongoing: companyDrives.filter(d => d.status === 'ongoing').length,
        completed: companyDrives.filter(d => d.status === 'completed').length
    };

    // Check if student is logged in
    const isStudentLoggedIn = () => {
        const user = localStorage.getItem('user');
        const isLogin = localStorage.getItem('isLogin');
        return user && isLogin === 'true';
    };

    // Get student login details
    const getStudentDetails = () => {
        try {
            const user = localStorage.getItem('user');
            if (user) {
                return JSON.parse(user);
            }
            return null;
        } catch (error) {
            console.error('Error parsing user data:', error);
            return null;
        }
    };

    // Handle apply button click
    const handleApply = (drive) => {
        // Check if student is logged in
        if (!isStudentLoggedIn()) {
            showAlert(
                <div className='flex items-center gap-2'>
                    ⚠️ Please login as a student to apply for drives
                </div>,
                'warning',
                4000
            );
            // Redirect to login page after 1.5 seconds
            setTimeout(() => {
                navigate('/login');
            }, 1500);
            return;
        }

        // Check if student details exist
        const student = getStudentDetails();
        if (!student) {
            showAlert('❌ Student details not found. Please login again.', 'error', 3000);
            setTimeout(() => navigate('/login'), 1500);
            return;
        }

        // Check if drive is eligible for application
        if (drive.status === 'completed') {
            showAlert('❌ This drive has been completed. You cannot apply.', 'error', 3000);
            return;
        }

        if (drive.status === 'ongoing') {
            showAlert('⏳ This drive is currently ongoing. Applications are closed.', 'warning', 3000);
            return;
        }

        // If all checks pass, show success message
        showAlert(
            <div className='flex items-center gap-2'>
                ✅ Successfully applied to {drive.companyName}!
            </div>,
            'success',
            3000
        );
        
        // Close the modal
        setShowDetails(false);
        setSelectedDrive(null);
    };

    // Loading State
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Briefcase className="w-8 h-8 text-blue-600 animate-pulse" />
                        </div>
                    </div>
                    <p className="mt-6 text-lg font-semibold text-gray-700">Loading Placement Drives...</p>
                    <p className="text-sm text-gray-400 mt-1">Fetching the best opportunities for you</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
            {AlertComponent}

            {/* Hero Section - Updated with white-related colors */}
            <motion.section
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative bg-gradient-to-r from-blue-50 via-white to-indigo-50 text-gray-800 rounded-2xl p-8 md:p-12 mb-8 overflow-hidden shadow-xl border border-blue-100"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-white/50 to-indigo-100/30"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200/20 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-200/20 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-100/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl shadow-lg">
                            <Rocket className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Placement Drives
                            </h1>
                            <p className="text-gray-600 mt-1">Discover your dream career opportunities</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm border border-blue-100">
                            <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                            <p className="text-sm text-gray-600">Total Drives</p>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm border border-yellow-100">
                            <p className="text-2xl font-bold text-yellow-600">{stats.upcoming}</p>
                            <p className="text-sm text-gray-600">Upcoming</p>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm border border-green-100">
                            <p className="text-2xl font-bold text-green-600">{stats.ongoing}</p>
                            <p className="text-sm text-gray-600">Ongoing</p>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm border border-gray-100">
                            <p className="text-2xl font-bold text-gray-600">{stats.completed}</p>
                            <p className="text-sm text-gray-600">Completed</p>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* Search and Filter Bar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-8"
            >
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by company or role..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                        <button
                            onClick={() => setFilterType('all')}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition whitespace-nowrap ${filterType === 'all'
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilterType('upcoming')}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition whitespace-nowrap ${filterType === 'upcoming'
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                Upcoming
                            </span>
                        </button>
                        <button
                            onClick={() => setFilterType('ongoing')}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition whitespace-nowrap ${filterType === 'ongoing'
                                    ? 'bg-green-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            <span className="flex items-center gap-1">
                                <Zap className="w-4 h-4" />
                                Ongoing
                            </span>
                        </button>
                        <button
                            onClick={() => setFilterType('completed')}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition whitespace-nowrap ${filterType === 'completed'
                                    ? 'bg-gray-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            <span className="flex items-center gap-1">
                                <CheckCircle className="w-4 h-4" />
                                Completed
                            </span>
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Drives Grid */}
            <div className="space-y-8">
                {/* Upcoming Drives Section - Display first when viewing all */}
                {filterType === 'all' && upcomingDrives.length > 0 && (
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Clock className="w-6 h-6 text-blue-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">Upcoming Drives</h2>
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                                {upcomingDrives.length}
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {upcomingDrives.map((drive, index) => (
                                <DriveCard
                                    key={index}
                                    drive={drive}
                                    index={index}
                                    onViewDetails={() => {
                                        setSelectedDrive(drive);
                                        setShowDetails(true);
                                    }}
                                />
                            ))}
                        </div>
                    </motion.section>
                )}

                {/* Ongoing Drives Section */}
                {filterType === 'all' && ongoingDrives.length > 0 && (
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Zap className="w-6 h-6 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">Ongoing Drives</h2>
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                                {ongoingDrives.length}
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {ongoingDrives.map((drive, index) => (
                                <DriveCard
                                    key={index}
                                    drive={drive}
                                    index={index}
                                    onViewDetails={() => {
                                        setSelectedDrive(drive);
                                        setShowDetails(true);
                                    }}
                                />
                            ))}
                        </div>
                    </motion.section>
                )}

                {/* Filtered Drives Section - Shows when a specific filter is selected */}
                {filterType !== 'all' && (
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`p-2 rounded-lg ${
                                filterType === 'upcoming' ? 'bg-blue-100' :
                                filterType === 'ongoing' ? 'bg-green-100' :
                                'bg-gray-100'
                            }`}>
                                {filterType === 'upcoming' && <Clock className="w-6 h-6 text-blue-600" />}
                                {filterType === 'ongoing' && <Zap className="w-6 h-6 text-green-600" />}
                                {filterType === 'completed' && <CheckCircle className="w-6 h-6 text-gray-600" />}
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                {filterType === 'upcoming' ? 'Upcoming Drives' :
                                 filterType === 'ongoing' ? 'Ongoing Drives' :
                                 'Completed Drives'}
                            </h2>
                            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                                filterType === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                                filterType === 'ongoing' ? 'bg-green-100 text-green-700' :
                                'bg-gray-100 text-gray-700'
                            }`}>
                                {filteredDrives.length}
                            </span>
                        </div>
                        
                        {filteredDrives.length === 0 ? (
                            <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
                                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-xl font-medium text-gray-600">
                                    No {filterType} drives found
                                </p>
                                <p className="text-gray-400 mt-1">Try adjusting your search or filters</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredDrives.map((drive, index) => (
                                    <DriveCard
                                        key={index}
                                        drive={drive}
                                        index={index}
                                        onViewDetails={() => {
                                            setSelectedDrive(drive);
                                            setShowDetails(true);
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </motion.section>
                )}

                {/* Completed Drives Section - Only show when viewing all */}
                {filterType === 'all' && completedDrives.length > 0 && (
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-gray-100 rounded-lg">
                                <CheckCircle className="w-6 h-6 text-gray-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">Completed Drives</h2>
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-semibold rounded-full">
                                {completedDrives.length}
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {completedDrives.map((drive, index) => (
                                <DriveCard
                                    key={index}
                                    drive={drive}
                                    index={index}
                                    onViewDetails={() => {
                                        setSelectedDrive(drive);
                                        setShowDetails(true);
                                    }}
                                />
                            ))}
                        </div>
                    </motion.section>
                )}

                {/* No Results - When no drives match the current filter */}
                {filteredDrives.length === 0 && filterType !== 'all' && (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
                        <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-xl font-medium text-gray-600">No drives found</p>
                        <p className="text-gray-400 mt-1">Try adjusting your search or filters</p>
                    </div>
                )}
            </div>

            {/* Drive Details Modal */}
            <AnimatePresence>
                {showDetails && selectedDrive && (
                    <DriveDetailsModal
                        drive={selectedDrive}
                        onClose={() => {
                            setShowDetails(false);
                            setSelectedDrive(null);
                        }}
                        onApply={handleApply}
                        isLoggedIn={isStudentLoggedIn()}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

// Drive Card Component
const DriveCard = ({ drive, index, onViewDetails }) => {
    const statusColors = {
        upcoming: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600', icon: Clock },
        ongoing: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600', icon: Zap },
        completed: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-600', icon: CheckCircle }
    };

    const status = statusColors[drive.status] || statusColors.upcoming;
    const StatusIcon = status.icon;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-l-4 ${status.border} overflow-hidden`}
        >
            <div className="p-6">
                {/* Status Badge */}
                <div className="flex items-center justify-between mb-3">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${status.bg} ${status.text} text-xs font-semibold`}>
                        <StatusIcon className="w-3 h-3" />
                        {drive.status.charAt(0).toUpperCase() + drive.status.slice(1)}
                    </div>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg">
                        {drive.type || 'On-Campus'}
                    </span>
                </div>

                {/* Company Info */}
                <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {drive.companyName?.charAt(0) || 'C'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-800 text-lg truncate">{drive.companyName}</h3>
                        <p className="text-sm text-gray-500 truncate">{drive.roles}</p>
                    </div>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{new Date(drive.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign className="w-4 h-4 text-green-500" />
                        <span className="font-medium text-green-600">{drive.package || 'Not Disclosed'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span>{drive.eligibility || 'All Branches'}</span>
                    </div>
                </div>

                {/* Actions */}
                <button
                    onClick={onViewDetails}
                    className="w-full mt-4 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-sm font-medium transition flex items-center justify-center gap-2"
                >
                    View Details
                    <ExternalLink className="w-4 h-4" />
                </button>
            </div>
        </motion.div>
    );
};

// Drive Details Modal Component
const DriveDetailsModal = ({ drive, onClose, onApply, isLoggedIn }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white sticky top-0">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                                {drive.companyName?.charAt(0) || 'C'}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">{drive.companyName}</h2>
                                <p className="text-blue-100">{drive.roles}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-lg transition"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Status Badge */}
                    <div className="flex items-center gap-4 flex-wrap">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            drive.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                            drive.status === 'ongoing' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-700'
                        }`}>
                            {drive.status.charAt(0).toUpperCase() + drive.status.slice(1)}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
                            {drive.type || 'On-Campus'}
                        </span>
                        {drive.status === 'upcoming' && (
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                                ✅ Applications Open
                            </span>
                        )}
                        {drive.status === 'ongoing' && (
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-full">
                                ⏳ Ongoing - Applications Closed
                            </span>
                        )}
                        {drive.status === 'completed' && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                                ❌ Completed
                            </span>
                        )}
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-xl p-4">
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Package</p>
                            <p className="text-lg font-bold text-green-600">{drive.package || 'Not Disclosed'}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4">
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Date</p>
                            <p className="text-lg font-semibold text-gray-800">{new Date(drive.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4">
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Location</p>
                            <p className="text-lg font-semibold text-gray-800">{drive.location || 'Multiple Locations'}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4">
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Eligibility</p>
                            <p className="text-lg font-semibold text-gray-800">{drive.eligibility || 'All Branches'}</p>
                        </div>
                    </div>

                    {/* Description */}
                    {drive.description && (
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-2">About this Drive</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">{drive.description}</p>
                        </div>
                    )}

                    {/* Requirements */}
                    {drive.requirements && drive.requirements.length > 0 && (
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-2">Key Requirements</h3>
                            <div className="flex flex-wrap gap-2">
                                {drive.requirements.map((req, index) => (
                                    <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                                        {req}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Eligibility Status */}
                    <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <UserCheck className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-800">Your Eligibility</p>
                                <p className="text-sm text-gray-600">
                                    {isLoggedIn ? (
                                        drive.status === 'upcoming' ? (
                                            <span className="text-green-600">✅ You are eligible to apply</span>
                                        ) : drive.status === 'ongoing' ? (
                                            <span className="text-yellow-600">⏳ Applications are closed for ongoing drives</span>
                                        ) : (
                                            <span className="text-gray-600">❌ This drive has been completed</span>
                                        )
                                    ) : (
                                        <span className="text-blue-600">🔒 Please login to check your eligibility</span>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t">
                        <button
                            onClick={() => onApply(drive)}
                            disabled={drive.status !== 'upcoming' || !isLoggedIn}
                            className={`flex-1 py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 ${
                                drive.status === 'upcoming' && isLoggedIn
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            <ExternalLink className="w-5 h-5" />
                            {!isLoggedIn ? 'Login to Apply' :
                             drive.status === 'upcoming' ? 'Apply Now' :
                             drive.status === 'ongoing' ? 'Applications Closed' :
                             'Completed'}
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 border border-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
                        >
                            Close
                        </button>
                    </div>
                    
                    {!isLoggedIn && drive.status === 'upcoming' && (
                        <p className="text-xs text-gray-400 text-center">
                            🔒 Please login as a student to apply for this drive
                        </p>
                    )}
                    
                    {isLoggedIn && drive.status === 'upcoming' && (
                        <p className="text-xs text-green-600 text-center">
                            ✅ You are logged in. Click "Apply Now" to submit your application
                        </p>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Drives;