// src/AdminDashboard/tabs/DrivesTab.jsx

import React, { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, DollarSign, MapPin, Calendar, FileText, Loader2, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DrivesTab = ({ drives, onAddDrive, onEditDrive, onDeleteDrive, loading }) => {
    const [editingId, setEditingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Filter drives based on search term and status filter
    const filteredDrives = useMemo(() => {
        if (!drives) return [];

        return drives.filter(drive => {
            const matchesSearch = drive.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                drive.roles?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                drive.location?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === 'all' || drive.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [drives, searchTerm, statusFilter]);

    // Get unique statuses for filter dropdown
    const statuses = useMemo(() => {
        if (!drives) return ['all'];
        const uniqueStatuses = [...new Set(drives.map(d => d.status))];
        return ['all', ...uniqueStatuses];
    }, [drives]);

    const handleEdit = (drive) => {
        onEditDrive(drive);
    };

    const handleDelete = async (driveId) => {
        if (!window.confirm('Are you sure you want to delete this drive? This action cannot be undone.')) {
            return;
        }

        setDeletingId(driveId);
        try {
            await onDeleteDrive(driveId);
        } finally {
            setDeletingId(null);
        }
    };

    const clearSearch = () => {
        setSearchTerm('');
    };

    // Count drives by status
    const driveCounts = useMemo(() => {
        if (!drives) return { total: 0, upcoming: 0, ongoing: 0, completed: 0 };
        return {
            total: drives.length,
            upcoming: drives.filter(d => d.status === 'upcoming').length,
            ongoing: drives.filter(d => d.status === 'ongoing').length,
            completed: drives.filter(d => d.status === 'completed').length,
        };
    }, [drives]);

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Company Drives</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {driveCounts.total} drives • {driveCounts.upcoming} upcoming • {driveCounts.ongoing} ongoing • {driveCounts.completed} completed
                    </p>
                </div>
                <button
                    onClick={onAddDrive}
                    disabled={loading}
                    className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2.5 sm:py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Loading...
                        </>
                    ) : (
                        <>
                            <Plus className="w-4 h-4" />
                            Add Drive
                        </>
                    )}
                </button>
                {/* <AnimatePresence>
                    {loading && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-center"
                        >
                            <p className="text-sm text-green-700">
                                ✅ Loading drives...
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence> */}
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    {/* Search Input */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by company name, role, or location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                        />
                        {searchTerm && (
                            <button
                                onClick={clearSearch}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Status Filter */}
                    <div className="flex items-center gap-2">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm bg-white min-w-[140px]"
                        >
                            <option value="all">All Status</option>
                            <option value="upcoming">🟢 Upcoming</option>
                            <option value="ongoing">🟡 Ongoing</option>
                            <option value="completed">⚪ Completed</option>
                        </select>
                    </div>

                    {/* Results Count */}
                    {searchTerm && (
                        <div className="flex items-center text-sm text-gray-500 whitespace-nowrap">
                            Found {filteredDrives.length} result{filteredDrives.length !== 1 ? 's' : ''}
                        </div>
                    )}
                </div>
            </div>

            {/* Loading State */}
            {loading && drives.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-500">Loading company drives...</p>
                </div>
            ) : filteredDrives.length === 0 ? (
                <motion.div
                    className="bg-white rounded-xl shadow-sm p-8 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="flex flex-col items-center justify-center">
                        <Search className="w-12 h-12 text-gray-300 mb-3" />
                        <p className="text-gray-500 font-medium">
                            {searchTerm ? 'No drives match your search' : 'No company drives found'}
                        </p>
                        {searchTerm && (
                            <p className="text-sm text-gray-400 mt-1">
                                Try adjusting your search terms or clear the search
                            </p>
                        )}
                        {!searchTerm && (
                            <p className="text-sm text-gray-400 mt-1">
                                Click "Add Drive" to create new drives
                            </p>
                        )}
                    </div>
                </motion.div>
            ) : (
                <AnimatePresence>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        {filteredDrives.map((drive, index) => (
                            <motion.div
                                key={drive._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{
                                    duration: 0.3,
                                    delay: index * 0.05
                                }}
                                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-300"
                            >
                                {/* Card Header */}
                                <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 sm:p-6 text-white">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                        <div className="w-full sm:w-auto">
                                            <h3 className="text-base sm:text-lg lg:text-xl font-bold truncate">
                                                {drive.companyName || 'Unknown Company'}
                                            </h3>
                                            <p className="text-gray-300 text-xs sm:text-sm truncate">
                                                {drive.roles || 'No role specified'}
                                            </p>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${drive.status === 'upcoming' ? 'bg-green-500' :
                                                drive.status === 'ongoing' ? 'bg-yellow-500' : 'bg-gray-500'
                                            }`}>
                                            {drive.status || 'upcoming'}
                                        </span>
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-4 sm:p-6">
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                                            <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
                                            <span className="font-medium">Package:</span>
                                            <span className="truncate">{drive.package || 'Not Disclosed'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                                            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600 flex-shrink-0" />
                                            <span className="font-medium">Location:</span>
                                            <span className="truncate">{drive.location || 'Multiple Locations'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                                            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0" />
                                            <span className="font-medium">Date:</span>
                                            <span>{drive.date ? new Date(drive.date).toLocaleDateString() : 'TBA'}</span>
                                        </div>
                                        {drive.eligibility && (
                                            <div className="flex items-start gap-2 text-xs sm:text-sm">
                                                <span className="font-medium">Eligibility:</span>
                                                <span className="text-gray-600">{drive.eligibility}</span>
                                            </div>
                                        )}
                                        {drive.description && (
                                            <div className="flex items-start gap-2 text-xs sm:text-sm">
                                                <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                                                <span className="text-gray-600 line-clamp-2">{drive.description}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <button
                                            onClick={() => handleEdit(drive)}
                                            disabled={editingId === drive._id || deletingId === drive._id}
                                            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {editingId === drive._id ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Updating...
                                                </>
                                            ) : (
                                                <>
                                                    <Edit className="w-4 h-4" />
                                                    Edit
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(drive._id)}
                                            disabled={editingId === drive._id || deletingId === drive._id}
                                            className="flex-1 border border-red-500 text-red-500 py-2 rounded-lg hover:bg-red-50 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {deletingId === drive._id ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Deleting...
                                                </>
                                            ) : (
                                                <>
                                                    <Trash2 className="w-4 h-4" />
                                                    Delete
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </AnimatePresence>
            )}
        </div>
    );
};

export default DrivesTab;