// src/AdminDashboard/tabs/StudentsTab.jsx

import React, { useState, useMemo } from 'react';
import { UserPlus, Edit, Trash2, Search, X, Filter, Wifi, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StudentsTab = ({ students, onlineUsers, onAddStudent, onEditStudent, onDeleteStudent }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDepartment, setFilterDepartment] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'online', 'offline'

    // Get unique departments for filter
    // const departments = useMemo(() => {
    //     const depts = new Set(students.map(s => s.profile?.department).filter(Boolean));
    //     return ['all', ...Array.from(depts)];
    // }, [students]);
    const departments = ["CSE" , "ECE" , "EEE" , "CIVIL" , "MECH" , "AI/ML"];

    // Check if a student is online
    const isStudentOnline = (student) => {
        const studentId = student.student?._id || student._id;
        return onlineUsers?.includes(studentId) || false;
    };

    // Filter students based on search, department, and status
    const filteredStudents = useMemo(() => {
        return students.filter(student => {
            const search = searchTerm.toLowerCase();
            const name = (student.student?.name || student.name || '').toLowerCase();
            const email = (student.student?.email || student.email || '').toLowerCase();
            const studentId = (student.studentId || '').toLowerCase();
            const department = (student.profile?.department || '').toLowerCase();
            const online = isStudentOnline(student);

            const matchesSearch =
                name.includes(search) ||
                email.includes(search) ||
                studentId.includes(search) ||
                department.includes(search);

            const matchesDepartment = filterDepartment === 'all' ||
                (student.profile?.department || '') === filterDepartment;

            const matchesStatus = filterStatus === 'all' ||
                (filterStatus === 'online' && online) ||
                (filterStatus === 'offline' && !online);

            return matchesSearch && matchesDepartment && matchesStatus;
        });
    }, [students, searchTerm, filterDepartment, filterStatus, onlineUsers]);

    // Count online students in filtered list
    const onlineCount = useMemo(() => {
        return filteredStudents.filter(student => isStudentOnline(student)).length;
    }, [filteredStudents, onlineUsers]);

    // Row animation variants
    const rowVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: (index) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: index * 0.03,
                duration: 0.2,
                ease: "easeOut"
            }
        }),
        exit: {
            opacity: 0,
            x: -20,
            transition: { duration: 0.15 }
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.3 }
        }
    };

    const clearSearch = () => {
        setSearchTerm('');
    };

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-3 flex-wrap"
                >
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                        Student Management
                    </h2>
                    <span className="text-sm font-normal text-gray-500">
                        ({filteredStudents.length} students)
                    </span>
                    
                    {/* Online Status Badge */}
                    {onlineUsers && onlineUsers.length > 0 && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            {onlineCount} online
                        </div>
                    )}
                </motion.div>
                <motion.button
                    onClick={onAddStudent}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2.5 sm:py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                    <UserPlus className="w-4 h-4" />
                    Add Student
                </motion.button>
            </div>

            {/* Search and Filter Bar */}
            <motion.div
                className="bg-white rounded-xl shadow-sm p-3 sm:p-4 mb-4 sm:mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
            >
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-wrap">
                    {/* Search Input */}
                    <div className="flex-1 min-w-[200px] relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by name, email, student ID, or department..."
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
                        <Wifi className="w-4 h-4 text-gray-400" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm bg-white min-w-[120px]"
                        >
                            <option value="all">All Status</option>
                            <option value="online">🟢 Online</option>
                            <option value="offline">⚪ Offline</option>
                        </select>
                    </div>

                    {/* Department Filter */}
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <select
                            value={filterDepartment}
                            onChange={(e) => setFilterDepartment(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm bg-white min-w-[140px]"
                        >
                            <option value="all">All Departments</option>
                            {departments.filter(d => d !== 'all').map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>

                    {/* Results Count */}
                    {/* {searchTerm && (
                        <motion.div
                            className="flex items-center text-sm text-gray-500 whitespace-nowrap"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            Found {filteredStudents.length} result{filteredStudents.length !== 1 ? 's' : ''}
                        </motion.div>
                    )} */}
                </div>
            </motion.div>

            {/* Table */}
            <motion.div
                className="bg-white rounded-xl shadow-sm"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="min-w-full rounded-lg overflow-x-auto">
                    <table className="w-full min-w-[500px]">
                        <thead className="bg-black">
                            <tr>
                                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-white uppercase">Name</th>
                                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-white uppercase hidden sm:table-cell">Student ID</th>
                                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-white uppercase hidden md:table-cell">Email</th>
                                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-white uppercase hidden lg:table-cell">Department</th>
                                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-white uppercase hidden xl:table-cell">CGPA</th>
                                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-white uppercase">Status</th>
                                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-white uppercase">Actions</th>
                            </tr>
                        </thead>
                        <AnimatePresence mode="wait">
                            <motion.tbody
                                key={filteredStudents.length}
                                // className="divide-y divide-gray-200"
                            >
                                {filteredStudents.length === 0 ? (
                                    <motion.tr
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <td colSpan={7} className="text-center py-8">
                                            <motion.div
                                                className="flex flex-col items-center justify-center text-gray-500"
                                                initial={{ scale: 0.8 }}
                                                animate={{ scale: 1 }}
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 400,
                                                    damping: 10
                                                }}
                                            >
                                                <Search className="w-12 h-12 text-gray-300 mb-3" />
                                                <p className="font-medium">
                                                    {searchTerm ? 'No students match your search' : 'No students found'}
                                                </p>
                                                {searchTerm ? (
                                                    <p className="text-sm mt-1">Try adjusting your search terms</p>
                                                ) : (
                                                    <p className="text-sm mt-1">Click "Add Student" to add new students</p>
                                                )}
                                            </motion.div>
                                        </td>
                                    </motion.tr>
                                ) : (
                                    filteredStudents.map((student, index) => {
                                        const studentId = student.student?._id || student._id;
                                        const isOnline = onlineUsers?.includes(studentId) || false;
                                        
                                        return (
                                            <motion.tr
                                                key={student._id}
                                                className={`hover:bg-gray-50 transition-colors ${
                                                    isOnline ? 'bg-green-50/30' : ''
                                                }`}
                                                variants={rowVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                custom={index}
                                                whileHover={{
                                                    scale: 1.01,
                                                    backgroundColor: isOnline ? "rgba(240, 253, 244, 0.8)" : "rgba(243, 244, 246, 0.8)",
                                                    transition: { duration: 0.15 }
                                                }}
                                            >
                                                <td className="px-3 sm:px-6 py-2 sm:py-4">
                                                    <motion.div
                                                        className="flex items-center gap-2 sm:gap-3"
                                                        whileHover={{ scale: 1.02 }}
                                                    >
                                                        <motion.div
                                                            className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white text-xs sm:text-sm relative ${
                                                                isOnline 
                                                                    ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                                                                    : 'bg-gradient-to-r from-blue-500 to-purple-500'
                                                            }`}
                                                            whileHover={{
                                                                scale: 1.2,
                                                                rotate: 10,
                                                                transition: { type: "spring", stiffness: 400 }
                                                            }}
                                                        >
                                                            {student.student?.name?.charAt(0) || student.name?.charAt(0) || 'S'}
                                                            {/* Online indicator dot */}
                                                            {isOnline && (
                                                                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white animate-pulse" />
                                                            )}
                                                        </motion.div>
                                                        <span className="font-medium text-xs sm:text-sm truncate max-w-[80px] sm:max-w-none">
                                                            {student.student?.name || student.name}
                                                        </span>
                                                    </motion.div>
                                                </td>
                                                <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm hidden sm:table-cell">{student.studentId}</td>
                                                <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm hidden md:table-cell truncate max-w-[120px]">{student.student?.email || student.email || 'N/A'}</td>
                                                <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm hidden lg:table-cell">{student.profile?.department || 'N/A'}</td>
                                                <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm font-semibold hidden xl:table-cell">{student.profile?.cgpa || 'N/A'}</td>
                                                
                                                {/* Status Column */}
                                                <td className="px-3 sm:px-6 py-2 sm:py-4">
                                                    {isOnline ? (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                                                            <span className="w-2 h-2 rounded-full bg-green-500 animate-bounce" />
                                                            Online
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                                                            Offline
                                                        </span>
                                                    )}
                                                </td>
                                                
                                                <td className="px-3 sm:px-6 py-2 sm:py-4">
                                                    <div className="flex gap-1 sm:gap-2">
                                                        <motion.button
                                                            className="p-1.5 sm:p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                                                            onClick={() => onEditStudent(student)}
                                                            title="Edit Student"
                                                            whileHover={{ scale: 1.2, rotate: -5 }}
                                                            whileTap={{ scale: 0.8 }}
                                                        >
                                                            <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                        </motion.button>
                                                        <motion.button
                                                            className="p-1.5 sm:p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                            onClick={() => onDeleteStudent(student.student?._id || student._id)}
                                                            title="Delete Student"
                                                            whileHover={{ scale: 1.2, rotate: 5 }}
                                                            whileTap={{ scale: 0.8 }}
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                        </motion.button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        );
                                    })
                                )}
                            </motion.tbody>
                        </AnimatePresence>
                    </table>
                </div>
                
                {/* Footer with online status summary */}
                {onlineUsers && onlineUsers.length > 0 && filteredStudents.length > 0 && (
                    <div className="px-3 sm:px-6 py-3 border-t border-gray-100 bg-gray-50 rounded-b-xl">
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span>{onlineCount} online</span>
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-gray-300" />
                                <span>{filteredStudents.length - onlineCount} offline</span>
                            </span>
                            {filterStatus !== 'all' && (
                                <span className="text-blue-600">
                                    Filtered by: {filterStatus}
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default StudentsTab;