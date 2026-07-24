// src/AdminDashboard/tabs/PlacementsTab.jsx

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, Search, Filter, Upload, Download,
  FileSpreadsheet, FileText, X, CheckCircle, AlertCircle,
  ChevronDown, ChevronRight, Eye, Info, TrendingUp, TrendingDown,
  Clock
} from 'lucide-react';
import axios from 'axios';
import { useAlert } from '../../components/Alert';

const PlacementsTab = ({ placements, onAddPlacement, onDeletePlacement, onRefresh }) => {
  const { showAlert, AlertComponent } = useAlert();
  const [searchValue, setSearchValue] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");

  // Get unique departments for filter
  const departments = ["CSE" , "ECE" , "EEE" , "CIVIL" , "MECH" , "AI/ML"]

  // Filter students based on search and department
  const filteredStudents = useMemo(() => {
    return placements
      .filter((student) => {
        const search = searchValue.toLowerCase();
        const matchedDepartment = selectedDepartment === "All" || 
          (student.department || '').toLowerCase() === selectedDepartment.toLowerCase();
        const matchedSearch =
          student.name?.toLowerCase().includes(search) ||
          student.company?.toLowerCase().includes(search) ||
          student.department?.toLowerCase().includes(search) ||
          student.year?.toString().includes(search);
        return matchedDepartment && matchedSearch;
      })
      .sort((a, b) => (b.package || 0) - (a.package || 0));
  }, [placements, searchValue, selectedDepartment]);

  // Upload states
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const fileInputRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  const refreshTimeoutRef = useRef(null);

  // Animation variants for rows
  const rowVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: { delay: index * 0.03, duration: 0.2, ease: "easeOut" }
    }),
    exit: { opacity: 0, x: -20, transition: { duration: 0.15 } }
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);

  // File upload handlers
  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  };

  const validateAndSetFile = (file) => {
    const validTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (!validTypes.includes(file.type)) {
      showAlert('Please upload a CSV or Excel file (.csv, .xls, .xlsx)', 'error', 4000);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showAlert('File size must be less than 10MB', 'error', 4000);
      return;
    }

    setFile(file);
    setUploadResult(null);
    setCountdown(0);
  };

  const startCountdown = (duration) => {
    setCountdown(duration);
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current);
          countdownIntervalRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const performRefresh = () => {
    // Clear all timeouts and intervals
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = null;
    }
    setCountdown(0);

    // Perform refresh
    if (onRefresh) {
      onRefresh();
    }

    // Clear file and result
    clearFile();
    setShowUploadModal(false);
  };

  const handleUpload = async () => {
    if (!file) {
      showAlert('Please select a file first', 'error', 4000);
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/admin/upload-placements`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        setUploadResult(response.data);

        // Show success alert with details
        const successMsg = `✅ ${response.data.message}`;
        showAlert(successMsg, response.data.summary?.failed === 0 ? 'success' : 'warning', 5000);

        if (response.data.errors && response.data.errors.length > 0) {
          setShowErrors(true);
        }

        // Start 30-second countdown before auto-refresh
        startCountdown(30);

        // Auto-refresh after 30 seconds
        if (refreshTimeoutRef.current) {
          clearTimeout(refreshTimeoutRef.current);
        }
        refreshTimeoutRef.current = setTimeout(() => {
          performRefresh();
        }, 30000);
      }
    } catch (error) {
      console.error('Upload error:', error);
      showAlert(
        error.response?.data?.message || 'Failed to upload file. Please try again.',
        'error',
        5000
      );
      setUploadResult(error.response?.data || null);
    } finally {
      setUploading(false);
    }
  };

  const handleManualClose = () => {
    // Clear all timeouts and intervals
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = null;
    }
    setCountdown(0);
    setShowUploadModal(false);
    clearFile();

    // Refresh when manually closing
    if (uploadResult && onRefresh) {
      onRefresh();
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/admin/download-placement`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          responseType: 'blob'
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `placement_template_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

      showAlert('✅ Template downloaded successfully!', 'success', 3000);
    } catch (error) {
      console.error('Download error:', error);
      showAlert('Failed to download template', 'error', 4000);
    }
  };

  const clearFile = () => {
    setFile(null);
    setUploadResult(null);
    setShowErrors(false);
    setCountdown(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = null;
    }
  };

  const openUploadModal = () => {
    setShowUploadModal(true);
    setFile(null);
    setUploadResult(null);
    setShowErrors(false);
    setCountdown(0);
  };

  const closeUploadModal = () => {
    if (!uploading) {
      handleManualClose();
    }
  };

  return (
    <div>
      {AlertComponent}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
        <motion.h2
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-xl sm:text-2xl font-bold text-gray-800"
        >
          Placement Records
          <span className="text-sm font-normal text-gray-500 ml-2">
            ({filteredStudents.length} records)
          </span>
        </motion.h2>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            onClick={openUploadModal}
            className="flex-1 sm:flex-none bg-green-600 text-white px-4 py-2.5 sm:py-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <Upload className="w-4 h-4" />
            Bulk Upload
          </button>
          <button
            onClick={onAddPlacement}
            className="flex-1 sm:flex-none bg-blue-600 text-white px-4 py-2.5 sm:py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <Plus className="w-4 h-4" />
            Add Placement
          </button>
          <button
            onClick={handleDownloadTemplate}
            className="flex-1 sm:flex-none border border-blue-500 hover:bg-blue-600 px-4 py-2.5 sm:py-2 rounded-lg text-white bg-blue-500 text-sm flex items-center gap-1 md:text-lg cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Download Template
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <motion.div
          className="relative flex-1 items-center"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <motion.input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search by name, company, department or year..."
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            whileFocus={{
              scale: 1.01,
              boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)"
            }}
            transition={{ duration: 0.2 }}
          />
          {searchValue && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <motion.span
                className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {filteredStudents.length} results
              </motion.span>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 min-w-[150px]"
          >
            <option value="All">All Departments</option>
            {departments.filter(d => d !== 'All').map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </motion.div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-20">
        <div className="min-w-full overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-white uppercase">Student Name</th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-white uppercase">Company</th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-white uppercase hidden md:table-cell">Department</th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-white uppercase hidden sm:table-cell">Year</th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-white uppercase">Package</th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-white uppercase">Actions</th>
              </tr>
            </thead>
            <AnimatePresence mode="wait">
              <motion.tbody
                key={searchValue + selectedDepartment}
                className="divide-y divide-gray-200"
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((placement, index) => (
                    <motion.tr
                      key={placement._id}
                      custom={index}
                      variants={rowVariants}
                      layout
                      className="hover:bg-gray-50"
                    >
                      <td className="px-3 sm:px-6 py-2 sm:py-4 font-medium text-xs sm:text-sm truncate max-w-[80px] sm:max-w-none">{placement.name}</td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm truncate max-w-[80px] sm:max-w-none">{placement.company}</td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm hidden md:table-cell">{placement.department || 'N/A'}</td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm hidden sm:table-cell">{placement.year || 'N/A'}</td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4 font-semibold text-green-600 text-xs sm:text-sm"> {placement.package} LPA</td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4">
                        <button
                          onClick={() => onDeletePlacement(placement._id)}
                          className="p-1.5 sm:p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan="6" className="px-3 sm:px-6 py-8 text-center">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-500 text-sm"
                      >
                        {searchValue ? (
                          <span>
                            No results found for "<strong>{searchValue}</strong>"
                          </span>
                        ) : selectedDepartment !== "All" ? (
                          <span>
                            No placement records found for department "<strong>{selectedDepartment}</strong>"
                          </span>
                        ) : (
                          <span>No placement records found. Click "Add Placement" to add new records.</span>
                        )}
                      </motion.div>
                    </td>
                  </motion.tr>
                )}
              </motion.tbody>
            </AnimatePresence>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeUploadModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="w-6 h-6" />
                    <div>
                      <h2 className="text-xl font-bold">Bulk Upload Placements</h2>
                      <p className="text-green-100 text-sm">
                        Upload CSV or Excel file with placement records
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={closeUploadModal}
                    disabled={uploading}
                    className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg disabled:opacity-50"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Template Download */}
                <div className="flex justify-end mb-4">
                  <button
                    onClick={handleDownloadTemplate}
                    className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1 md:text-lg cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    Download Template
                  </button>
                </div>

                {/* Upload Area */}
                <div
                  className={`border-2 border-dashed rounded-lg p-8 transition-all duration-300 text-center
                    ${dragOver ? 'border-green-500 bg-green-50' : 'border-gray-300'}
                    ${file ? 'border-green-500 bg-green-50' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {!file ? (
                    <div className="py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Upload className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">
                        Drop your file here or click to browse
                      </h3>
                      <p className="text-gray-500 text-sm mb-4">
                        Supports CSV, XLS, XLSX (Max 10MB)
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileSelect}
                        accept=".csv,.xls,.xlsx"
                        className="hidden"
                        id="upload-file-input"
                      />
                      <label
                        htmlFor="upload-file-input"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
                      >
                        <Upload className="w-4 h-4" />
                        Choose File
                      </label>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-4 w-full">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          {file.type === 'text/csv' ? (
                            <FileText className="w-6 h-6 text-green-600" />
                          ) : (
                            <FileSpreadsheet className="w-6 h-6 text-green-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <p className="font-medium text-gray-800 truncate">{file.name}</p>
                          <p className="text-sm text-gray-500">
                            {(file.size / 1024).toFixed(1)} KB • {file.type.split('/')[1].toUpperCase()}
                          </p>
                        </div>
                        <button
                          onClick={clearFile}
                          disabled={uploading}
                          className="text-gray-400 hover:text-red-500 transition p-1 disabled:opacity-50"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Upload Result - Enhanced with Countdown */}
                <AnimatePresence>
                  {uploadResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-4 p-4 rounded-lg border"
                    >
                      {/* Status Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center
                          ${uploadResult.success && uploadResult.summary?.failed === 0 ? 'bg-green-100' : 'bg-yellow-100'}`}>
                          {uploadResult.success && uploadResult.summary?.failed === 0 ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : uploadResult.success ? (
                            <AlertCircle className="w-5 h-5 text-yellow-600" />
                          ) : (
                            <X className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">
                            {uploadResult.success && uploadResult.summary?.failed === 0
                              ? '✅ Upload Successful!'
                              : uploadResult.success
                                ? '⚠️ Upload Completed with Warnings'
                                : '❌ Upload Failed'}
                          </p>
                          <p className="text-sm text-gray-500">{uploadResult.message}</p>
                        </div>
                        {/* Countdown Timer */}
                        {countdown > 0 && (
                          <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                            <Clock className="w-4 h-4 text-blue-600 animate-pulse" />
                            <span className="text-sm font-bold text-blue-600">{countdown}s</span>
                          </div>
                        )}
                      </div>

                      {/* Summary Cards */}
                      {uploadResult.summary && (
                        <div className="grid grid-cols-4 gap-3 mb-4">
                          <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-100">
                            <p className="text-2xl font-bold text-blue-600">{uploadResult.summary.total}</p>
                            <p className="text-xs text-gray-500 font-medium">Total Records</p>
                          </div>
                          <div className="bg-green-50 rounded-lg p-3 text-center border border-green-100">
                            <p className="text-2xl font-bold text-green-600">{uploadResult.summary.success}</p>
                            <p className="text-xs text-gray-500 font-medium flex items-center justify-center gap-1">
                              <TrendingUp className="w-3 h-3 text-green-500" />
                              Successfully Added
                            </p>
                          </div>
                          <div className={`rounded-lg p-3 text-center border ${uploadResult.summary.failed > 0 ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-100'}`}>
                            <p className={`text-2xl font-bold ${uploadResult.summary.failed > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                              {uploadResult.summary.failed}
                            </p>
                            <p className={`text-xs font-medium flex items-center justify-center gap-1 ${uploadResult.summary.failed > 0 ? 'text-red-500' : 'text-gray-400'}`}>
                              <TrendingDown className="w-3 h-3" />
                              Failed
                            </p>
                          </div>
                          <div className="bg-purple-50 rounded-lg p-3 text-center border border-purple-100">
                            <p className="text-2xl font-bold text-purple-600">
                              {uploadResult.summary.total > 0
                                ? Math.round((uploadResult.summary.success / uploadResult.summary.total) * 100)
                                : 0}%
                            </p>
                            <p className="text-xs text-gray-500 font-medium">Success Rate</p>
                          </div>
                        </div>
                      )}

                      {/* Progress Bar */}
                      {uploadResult.summary && uploadResult.summary.total > 0 && (
                        <div className="mb-4">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Progress</span>
                            <span>{Math.round((uploadResult.summary.success / uploadResult.summary.total) * 100)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className={`h-2.5 rounded-full transition-all duration-500 ${uploadResult.summary.failed === 0 ? 'bg-green-500' :
                                  uploadResult.summary.success > uploadResult.summary.failed ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                              style={{ width: `${Math.round((uploadResult.summary.success / uploadResult.summary.total) * 100)}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Auto-refresh info */}
                      {countdown > 0 && (
                        <div className="mb-3 p-2 bg-blue-50 rounded-lg border border-blue-200 text-center">
                          <p className="text-xs text-blue-600">
                            <Clock className="w-3 h-3 inline mr-1" />
                            Auto-refreshing in {countdown} seconds to show updated records...
                          </p>
                        </div>
                      )}

                      {/* Error List */}
                      {uploadResult.errors && uploadResult.errors.length > 0 && (
                        <div className="mt-3">
                          <button
                            onClick={() => setShowErrors(!showErrors)}
                            className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 transition font-medium"
                          >
                            {showErrors ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            {showErrors ? 'Hide' : 'View'} Errors ({uploadResult.errors.length})
                          </button>
                          <AnimatePresence>
                            {showErrors && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="mt-2 bg-red-50 rounded-lg p-3 max-h-48 overflow-y-auto border border-red-200">
                                  {uploadResult.errors.slice(0, 10).map((error, index) => (
                                    <div key={index} className="mb-2 p-2 bg-white rounded border border-red-200">
                                      <p className="text-sm text-red-600 font-medium">
                                        Row {error.row}: {error.error}
                                      </p>
                                      {error.data && (
                                        <pre className="text-xs text-gray-600 mt-1 overflow-x-auto bg-gray-50 p-2 rounded">
                                          {JSON.stringify(error.data, null, 2)}
                                        </pre>
                                      )}
                                    </div>
                                  ))}
                                  {uploadResult.errors.length > 10 && (
                                    <p className="text-xs text-gray-500 mt-2 text-center">
                                      ... and {uploadResult.errors.length - 10} more errors
                                    </p>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Modal Footer */}
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  {file && !uploadResult && (
                    <button
                      onClick={handleUpload}
                      disabled={uploading}
                      className="flex-1 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {uploading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          Upload File
                        </>
                      )}
                    </button>
                  )}
                  <button
                    onClick={closeUploadModal}
                    disabled={uploading}
                    className={`flex-1 py-2.5 border-2 border-gray-200 text-gray-600 rounded-lg transition
                      ${!uploading ? 'hover:bg-gray-50 hover:border-gray-300' : 'opacity-50 cursor-not-allowed'}`}
                  >
                    {uploadResult ? 'Close & Refresh' : 'Cancel'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlacementsTab;