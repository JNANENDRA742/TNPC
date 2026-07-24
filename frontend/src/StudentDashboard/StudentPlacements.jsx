import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Briefcase, Calendar, MapPin, DollarSign, Clock, CheckCircle,
  XCircle, AlertCircle, Users, TrendingUp, Award, FileText,
  Mail, Phone, Link as LinkIcon, Building, Search, Filter,
  ChevronRight, ChevronDown, Star, Bookmark, Share2, Download,
  PieChart, BarChart3, Activity, Zap, Target, Shield, Sparkles,
  ExternalLink, Eye, ThumbsUp, MessageCircle, Bell, Gift, Crown,
  Rocket
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { useAlert } from '../components/Alert';
import StudentPlacementsSkeleton from './components/StudentPlacementsSkeleton';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const StudentPlacements = () => {
  const { id } = useParams();
  const { showAlert, AlertComponent } = useAlert();

  // State declarations
  const [loading, setLoading] = useState(true);
  const [drives, setDrives] = useState([]);
  const [filteredDrives, setFilteredDrives] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedPackage, setSelectedPackage] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [year, setYear] = useState('');
  const [stats, setStats] = useState({
    eligible: 0,
    applied: 0,
    shortlisted: 0,
    upcoming: 0,
    ongoing: 0,
    completed: 0
  });
  const [alertShown, setAlertShown] = useState(false);

  // ==================== HELPER FUNCTIONS ====================

  /**
   * Calculate the status of a drive based on its date
   * @param {string} driveDate - ISO date string of the drive
   * @param {string} currentStatus - Current status from database
   * @returns {string} - 'upcoming', 'ongoing', or 'completed'
   */
  const calculateDriveStatus = (driveDate, currentStatus) => {
    if (!driveDate) return currentStatus || 'upcoming';

    const now = new Date();
    const driveDateTime = new Date(driveDate);

    // Set the drive date to end of day for accurate comparison
    const driveDateEnd = new Date(driveDateTime);
    driveDateEnd.setHours(23, 59, 59, 999);

    // Calculate difference in days
    const diffInMs = driveDateEnd.getTime() - now.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    // Determine status based on date
    if (diffInDays < 0) {
      // Drive date has passed
      return 'completed';
    } else if (diffInDays <= 1) {
      // Drive is today or tomorrow - consider as ongoing
      return 'ongoing';
    } else {
      // Drive is more than 1 day away
      return 'upcoming';
    }
  };

  // Check if student is in eligible year (3rd or 4th)
  const isEligibleYear = () => {
    if (!year) return false;
    const yearStr = year.toString().trim().toLowerCase();
    const yearNum = parseInt(yearStr);

    return [3, 4].includes(yearNum) ||
      ["3rd", "4th", "third", "fourth", "3rd year", "4th year"].includes(yearStr);
  };

  // Check if student is eligible for a specific drive
  const isStudentEligible = (student, drive) => {
    if (!student || !drive) return false;

    // Check if student is in 3rd or 4th year
    if (!isEligibleYear()) return false;

    // Students are NOT eligible for ongoing or completed drives
    if (drive.status === 'ongoing' || drive.status === 'completed') {
      return false;
    }

    // Check if drive is upcoming (eligible for all upcoming drives)
    if (drive.status === 'upcoming') {
      return true;
    }

    return true;
  };

  // Get eligible drives list
  const getEligibleDrivesList = () => {
    if (!drives.length || !studentData) return [];
    return drives.filter(drive => isStudentEligible(studentData, drive));
  };

  // Format package for display
  const formatPackage = (packageData) => {
    if (!packageData) return 'Not Disclosed';

    if (typeof packageData === 'string') {
      return packageData;
    }

    if (typeof packageData === 'object') {
      if (packageData.min && packageData.max) {
        return `₹${packageData.min} - ${packageData.max} ${packageData.currency || 'LPA'}`;
      }
      if (packageData.amount) {
        return `₹${packageData.amount} ${packageData.currency || 'LPA'}`;
      }
    }

    return 'Not Disclosed';
  };

  // Get numeric package value for filtering
  const getPackageValue = (packageData) => {
    if (!packageData) return 0;

    if (typeof packageData === 'string') {
      const match = packageData.match(/(\d+(?:\.\d+)?)/);
      return match ? parseFloat(match[0]) : 0;
    }

    if (typeof packageData === 'object') {
      if (packageData.min) return packageData.min;
      if (packageData.amount) return packageData.amount;
    }

    return 0;
  };

  // Get ordinal suffix for year display
  const getOrdinalSuffix = (n) => {
    if (n === 1) return 'st';
    if (n === 2) return 'nd';
    if (n === 3) return 'rd';
    return 'th';
  };

  // Get status color for badges
  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-500';
      case 'ongoing': return 'bg-yellow-500';
      case 'completed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  // Get status text for badges
  const getStatusText = (status) => {
    switch (status) {
      case 'upcoming': return 'Upcoming';
      case 'ongoing': return 'Ongoing';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  // Get eligibility status text
  const getEligibilityStatus = (drive) => {
    if (!isEligibleYear()) {
      return { text: 'Not Eligible (Year)', color: 'text-red-600', bg: 'bg-red-100' };
    }
    if (drive.status === 'ongoing') {
      return { text: 'Ongoing - Not Accepting', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    }
    if (drive.status === 'completed') {
      return { text: 'Completed', color: 'text-gray-600', bg: 'bg-gray-100' };
    }
    if (drive.status === 'upcoming') {
      return { text: 'Eligible ✅', color: 'text-green-600', bg: 'bg-green-100' };
    }
    return { text: 'Eligible ✅', color: 'text-green-600', bg: 'bg-green-100' };
  };

  // ==================== DATA FETCHING FUNCTIONS ====================

  const fetchDrives = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/companydrives`);
      const allDrives = response.data;

      const formattedDrives = allDrives.map(drive => {
        // Calculate the actual status based on date
        const calculatedStatus = calculateDriveStatus(drive.date, drive.status);

        return {
          id: drive._id,
          companyName: drive.companyName,
          companyLogo: drive.companyLogo || null,
          roles: drive.roles || 'Software Engineer',
          description: drive.description || "No description provided.",
          eligibility: drive.eligibility || {
            minCGPA: 0,
            branches: [],
          },
          package: drive.package || 'Not Disclosed',
          location: drive.location || 'Multiple Locations',
          mode: drive.mode || 'Hybrid',
          date: drive.date || new Date().toISOString(),
          applicationDeadline: drive.applicationDeadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: calculatedStatus, // Use the calculated status
          googleFormLink: drive.googleFormLink || null,
          requirements: drive.requirements || [
            'Good communication skills',
            'Problem solving ability',
            'Team player'
          ],
          interviewRounds: drive.interviewRounds || [
            'Online Assessment',
            'Technical Interview',
            'HR Interview'
          ],
        };
      });

      setDrives(formattedDrives);
      setFilteredDrives(formattedDrives);
    } catch (error) {
      console.error('Error fetching drives:', error);
      showAlert('Failed to load placement drives. Please refresh the page.', 'error');
    }
  };

  const fetchStudentData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/studentprofile/${id}`);
      const data = response.data;

      if (!data.applied_drives) data.applied_drives = [];
      if (!data.shortlisted_drives) data.shortlisted_drives = [];

      setStudentData(data);
    } catch (error) {
      console.error('Error fetching student data:', error);
      showAlert('Failed to load student data. Please refresh the page.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchYear = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/studentyear/${id}`);
      setYear(res.data.year || '');
    } catch (error) {
      console.error('Error fetching student year:', error);
    }
  };

  // ==================== STATS CALCULATION ====================

  const calculateStats = () => {
    if (!drives.length || !studentData) return;

    // Calculate eligible drives (upcoming only)
    const eligibleDrives = drives.filter(drive =>
      isStudentEligible(studentData, drive) && drive.status === 'upcoming'
    );
    const eligible = eligibleDrives.length;

    // Calculate upcoming drives (within next 30 days)
    const now = new Date();
    const upcoming = drives.filter(drive => {
      const driveDate = new Date(drive.date);
      return drive.status === 'upcoming' && driveDate > now &&
        (driveDate - now) / (1000 * 60 * 60 * 24) <= 30;
    }).length;

    // Calculate ongoing drives
    const ongoing = drives.filter(drive => drive.status === 'ongoing').length;

    // Calculate completed drives
    const completed = drives.filter(drive => drive.status === 'completed').length;

    setStats({
      eligible,
      applied: 0,
      shortlisted: 0,
      upcoming,
      ongoing,
      completed
    });
  };

  // ==================== HANDLER FUNCTIONS ====================

  const handleSearch = () => {
    let filtered = drives;

    if (searchTerm) {
      filtered = filtered.filter(drive =>
        drive.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        drive.roles.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCompany !== 'all') {
      filtered = filtered.filter(drive => drive.companyName === selectedCompany);
    }

    if (selectedRole !== 'all') {
      filtered = filtered.filter(drive => drive.roles === selectedRole);
    }

    if (selectedPackage !== 'all') {
      filtered = filtered.filter(drive => {
        const packageValue = getPackageValue(drive.package);

        if (selectedPackage === '20+') {
          return packageValue >= 20;
        } else {
          const [min, max] = selectedPackage.split('-').map(Number);
          return packageValue >= min && packageValue <= max;
        }
      });
    }

    setFilteredDrives(filtered);
  };

  // Handle apply to drive (redirect to Google Form)
  const handleApply = async () => {
    if (!selectedDrive) return;

    try {
      const isEligible = await checkingYear();

      if (!isEligible) {
        showAlert('❌ Only 3rd and 4th year students are allowed to apply for drives.', 'error', 4000);
        return;
      }

      // Check if drive is upcoming
      if (selectedDrive.status !== 'upcoming') {
        showAlert('⚠️ This drive is not accepting applications at the moment.', 'warning', 4000);
        return;
      }

      // Check if Google Form link exists
      if (!selectedDrive.googleFormLink) {
        showAlert('⚠️ No application form link available for this drive.', 'warning', 4000);
        return;
      }

      // Redirect to Google Form
      window.open(selectedDrive.googleFormLink, '_blank');

      showAlert(`🔗 Redirecting to ${selectedDrive.companyName} application form...`, 'success', 3000);

      // Close the modal after redirection
      setShowApplyModal(false);
      setSelectedDrive(null);

    } catch (error) {
      console.error("Error in application process:", error);
      showAlert('❌ Something went wrong. Please try again.', 'error', 4000);
    }
  };

  const checkingYear = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/studentyear/${id}`
      );

      const studentYear = res.data.year;
      setYear(studentYear);

      if (!studentYear) {
        console.warn("Student year not found");
        return false;
      }

      const yearStr = studentYear.toString().trim().toLowerCase();
      const yearNum = parseInt(yearStr);

      const isEligible =
        [3, 4].includes(yearNum) ||
        ["3rd", "4th", "third", "fourth", "3rd Year", "4th Year"].includes(yearStr);

      return isEligible;
    } catch (error) {
      console.error("Error checking student year:", error);
      showAlert('Failed to verify your eligibility. Please try again.', 'error');
      return false;
    }
  };

  // Refresh all data
  const refreshData = async () => {
    setLoading(true);
    await Promise.all([fetchStudentData(), fetchDrives(), fetchYear()]);
    setLoading(false);
  };

  // ==================== EFFECT HOOKS ====================

  // Auto-update drive statuses every minute
  useEffect(() => {
    const interval = setInterval(() => {
      // Recalculate statuses for all drives
      const updatedDrives = drives.map(drive => {
        const newStatus = calculateDriveStatus(drive.date, drive.status);
        return {
          ...drive,
          status: newStatus
        };
      });

      // Check if any status changed
      const hasChanges = updatedDrives.some((drive, index) =>
        drive.status !== drives[index].status
      );

      if (hasChanges) {
        setDrives(updatedDrives);
        setFilteredDrives(prevFiltered => {
          return prevFiltered.map(drive => {
            const updated = updatedDrives.find(d => d.id === drive.id);
            return updated || drive;
          });
        });
        // Recalculate stats
        setTimeout(() => calculateStats(), 100);
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [drives]);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      await Promise.all([fetchStudentData(), fetchDrives(), fetchYear()]);
      setLoading(false);
    };
    fetchAllData();
  }, [id]);

  useEffect(() => {
    if (year && !alertShown) {
      const eligible = isEligibleYear();

      if (eligible) {
        showAlert(
          '🎉 You are eligible for placement drives! You can apply to all upcoming drives.',
          'success',
          5000
        );
      } else {
        showAlert(
          '⚠️ Only 3rd and 4th year students are eligible for placement drives. You will be able to apply once you reach 3rd year.',
          'warning',
          6000
        );
      }

      setAlertShown(true);
    }
  }, [year]);

  useEffect(() => {
    if (drives.length > 0 && studentData) {
      calculateStats();
    }
  }, [drives, studentData]);

  useEffect(() => {
    handleSearch();
  }, [searchTerm, selectedCompany, selectedRole, selectedPackage]);

  // ==================== LOADING STATE ====================

  if (loading) {
    return <StudentPlacementsSkeleton />;
  }

  // ==================== UNIQUE VALUES FOR FILTERS ====================

  const uniqueCompanies = [...new Set(drives.map(d => d.companyName))];
  const uniqueRoles = [...new Set(drives.map(d => d.roles))];

  // ==================== RENDER ====================

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {AlertComponent}

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-50 via-white to-indigo-50 text-black rounded-2xl mx-4 sm:mx-0  shadow-black shadow-lg">
        {/* <div className="absolute inset-0 bg-black opacity-20 rounded-2xl"></div> */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-cyan-400 rounded-full backdrop-blur-sm mb-6"
            >
              <Briefcase className="w-10 h-10" />
            </motion.div>
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              Placement Opportunities
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-xl text-gray-600"
            >
              Find your dream job from top companies
            </motion.p>
            {!isEligibleYear() && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 bg-yellow-500/30 backdrop-blur-sm rounded-lg p-3 inline-block"
              >
                <p className="text-yellow-100 font-medium">
                  ⚠️ Only 3rd and 4th year students are eligible for placement drives
                </p>
              </motion.div>
            )}
            {isEligibleYear() && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 bg-green-400 backdrop-blur-sm rounded-lg p-3 inline-block"
              >
                <p className="text-white font-medium">
                  ✅ You are eligible! Apply to all upcoming drives.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards - Updated with Ongoing and Completed */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Eligible Drives Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 10,
              delay: 0.1,
            }}
            whileHover={{
              y: -10,
              scale: 1.03,
              rotateX: 3,
              rotateY: 3,
              transition: {
                type: "spring",
                stiffness: 500,
                damping: 18,
              },
            }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-900 text-sm">Eligible (Upcoming)</p>
                <p className="text-3xl font-bold text-blue-600">{stats.eligible}</p>
                {!isEligibleYear() && (
                  <p className="text-xs text-orange-500 mt-1">Not eligible yet</p>
                )}
                {isEligibleYear() && stats.eligible === 0 && (
                  <p className="text-xs text-gray-400 mt-1">No upcoming drives</p>
                )}
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          {/* Upcoming Drives Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 10,
              delay: 0.1,
            }}
            whileHover={{
              y: -10,
              scale: 1.03,
              rotateX: 3,
              rotateY: 3,
              transition: {
                type: "spring",
                stiffness: 500,
                damping: 18,
              },
            }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-900 text-sm">Upcoming Drives</p>
                <p className="text-3xl font-bold text-blue-600">{stats.upcoming}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            {stats.upcoming === 0 && (
              <div className="mt-2">
                <p className="text-xs text-gray-400">No upcoming drives</p>
              </div>
            )}
          </motion.div>

          {/* Ongoing Drives Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 10,
              delay: 0.1,
            }}
            whileHover={{
              y: -10,
              scale: 1.03,
              rotateX: 3,
              rotateY: 3,
              transition: {
                type: "spring",
                stiffness: 500,
                damping: 18,
              },
            }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-900 text-sm">Ongoing Drives</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.ongoing}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            {stats.ongoing === 0 && (
              <div className="mt-2">
                <p className="text-xs text-gray-700">No ongoing drives</p>
              </div>
            )}
          </motion.div>

          {/* Completed Drives Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 10,
              delay: 0.1,
            }}
            whileHover={{
              y: -10,
              scale: 1.03,
              rotateX: 3,
              rotateY: 3,
              transition: {
                type: "spring",
                stiffness: 500,
                damping: 18,
              },
            }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-900 text-sm">Completed Drives</p>
                <p className="text-3xl font-bold text-gray-600">{stats.completed}</p>
              </div>
              <div className="bg-green-400 p-3 rounded-full">
                <CheckCircle className="w-6 h-6 text-gray-900" />
              </div>
            </div>
            {stats.completed === 0 && (
              <div className="mt-2">
                <p className="text-xs text-gray-400">No completed drives</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by company or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
            >
              <Filter className="w-5 h-5" />
              Filters
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                  <select
                    value={selectedCompany}
                    onChange={(e) => setSelectedCompany(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="all">All Companies</option>
                    {uniqueCompanies.map(company => (
                      <option key={company} value={company}>{company}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="all">All Roles</option>
                    {uniqueRoles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Package (LPA)</label>
                  <select
                    value={selectedPackage}
                    onChange={(e) => setSelectedPackage(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="all">All Packages</option>
                    <option value="0-5">0-5 LPA</option>
                    <option value="5-10">5-10 LPA</option>
                    <option value="10-15">10-15 LPA</option>
                    <option value="15-20">15-20 LPA</option>
                    <option value="20+">20+ LPA</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Status Filter Quick Links */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => {
              setSearchTerm('');
              setFilteredDrives(drives);
            }}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition"
          >
            All ({drives.length})
          </button>
          <button
            onClick={() => {
              setSearchTerm('');
              const upcomingDrives = drives.filter(d => d.status === 'upcoming');
              setFilteredDrives(upcomingDrives);
            }}
            className="px-4 py-2 bg-cyan-500 text-white rounded-full text-sm font-medium hover:bg-blue-600 transition"
          >
            Upcoming ({drives.filter(d => d.status === 'upcoming').length})
          </button>
          <button
            onClick={() => {
              setSearchTerm('');
              const ongoingDrives = drives.filter(d => d.status === 'ongoing');
              setFilteredDrives(ongoingDrives);
            }}
            className="px-4 py-2 bg-yellow-500 text-white rounded-full text-sm font-medium hover:bg-yellow-600 transition"
          >
            Ongoing ({drives.filter(d => d.status === 'ongoing').length})
          </button>
          <button
            onClick={() => {
              setSearchTerm('');
              const completedDrives = drives.filter(d => d.status === 'completed');
              setFilteredDrives(completedDrives);
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded-full text-sm font-medium hover:bg-gray-600 transition"
          >
            Completed ({drives.filter(d => d.status === 'completed').length})
          </button>
        </div>

        {/* Drive Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnimatePresence>
            {filteredDrives.map((drive, index) => {
              const eligibilityStatus = getEligibilityStatus(drive);
              const isEligible = isStudentEligible(studentData, drive);
              const canApply = drive.status === 'upcoming' && isEligibleYear() && drive.googleFormLink;

              return (
                <motion.div
                  key={drive.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  {/* Header */}
                  <div className={`relative bg-gradient-to-r p-6 text-white ${drive.status === 'upcoming' ? 'bg-green-400' :
                    drive.status === 'ongoing' ? 'from-yellow-500 to-orange-600' :
                      'from-gray-600 to-gray-800'
                    }`}>
                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(drive.status)}`}>
                      {getStatusText(drive.status)}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        {drive.companyLogo ? (
                          <img src={drive.companyLogo} alt={drive.companyName} className="w-12 h-12 object-contain" />
                        ) : (
                          <Building className="w-8 h-8" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{drive.companyName}</h3>
                        <p className="text-gray-600">{drive.roles}</p>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="text-gray-600 mb-4 line-clamp-2">{drive.description}</p>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="font-medium">Package:</span>
                        <span className="font-semibold text-green-700">{formatPackage(drive.package)}</span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4 text-red-600" />
                        <span className="font-medium">Location:</span>
                        <span>{drive.location}</span>
                        <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">{drive.mode}</span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">Drive Date:</span>
                        <span>{new Date(drive.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4 text-orange-600" />
                        <span className="font-medium">Apply by:</span>
                        <span>{new Date(drive.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>

                      {/* Eligibility Status */}
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-purple-600" />
                        <span className="font-medium text-gray-600">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${eligibilityStatus.bg} ${eligibilityStatus.color}`}>
                          {eligibilityStatus.text}
                        </span>
                      </div>

                      {/* Google Form Link */}
                      <div className='flex items-center gap-2 text-gray-900'>
                        <Bookmark className='w-5 h-5 text-blue-700 flex-shrink-0' />
                        <span className="font-semibold text-blue-700">Application Link:</span>
                        {drive.googleFormLink ? (
                          <a
                            href={drive.googleFormLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline font-medium truncate flex items-center gap-1 max-w-[200px]"
                          >
                            Apply via Google Form
                            <ExternalLink className="w-3 h-3 flex-shrink-0" />
                          </a>
                        ) : (
                          <span className="text-gray-900 text-lg">Not available</span>
                        )}
                      </div>
                    </div>

                    {/* Skills Tags */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Requirements:</h4>
                      <div className="flex flex-wrap gap-2">
                        {drive.requirements.slice(0, 3).map((req, i) => (
                          <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setSelectedDrive(drive);
                          setShowApplyModal(true);
                        }}
                        disabled={!canApply}
                        className={`flex-1 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${canApply
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                      >
                        <ExternalLink className="w-4 h-4" />
                        {!isEligibleYear()
                          ? 'Not Eligible'
                          : drive.status === 'ongoing'
                            ? 'Ongoing'
                            : drive.status === 'completed'
                              ? 'Completed'
                              : !drive.googleFormLink
                                ? 'No Form Available'
                                : 'Apply Now'}
                      </button>

                      <button
                        onClick={() => setSelectedDrive(drive)}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filteredDrives.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No placement drives found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Apply Modal */}
      <AnimatePresence>
        {showApplyModal && selectedDrive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowApplyModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky z-1 top-0 bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <h2 className="text-2xl font-bold">Apply to {selectedDrive.companyName}</h2>
                <p className="text-blue-100">{selectedDrive.roles}</p>
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="absolute top-4 right-4 text-white/80 hover:text-white"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Drive Details</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <p><span className="font-medium">Company:</span> {selectedDrive.companyName}</p>
                    <p><span className="font-medium">Position:</span> {selectedDrive.roles}</p>
                    <p><span className="font-medium">Package:</span> {formatPackage(selectedDrive.package)}</p>
                    <p><span className="font-medium">Location:</span> {selectedDrive.location}</p>
                    <p><span className="font-medium">Drive Date:</span> {new Date(selectedDrive.date).toLocaleDateString()}</p>
                    <p>
                      <span className="font-medium">Status:</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${selectedDrive.status === 'upcoming' ? 'bg-blue-100 text-blue-700' : selectedDrive.status === 'ongoing' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
                        {getStatusText(selectedDrive.status)}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium">Your Eligibility:</span>
                      {isStudentEligible(studentData, selectedDrive) && selectedDrive.status === 'upcoming' ? (
                        <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                          ✅ Eligible
                        </span>
                      ) : selectedDrive.status === 'ongoing' ? (
                        <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">
                          ⏳ Ongoing - Not Accepting
                        </span>
                      ) : selectedDrive.status === 'completed' ? (
                        <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
                          ❌ Completed
                        </span>
                      ) : (
                        <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                          ❌ Not Eligible
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Google Form Link Section */}
                <div className="mb-6 bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <LinkIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-blue-800 text-lg">Application Form</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        You will be redirected to Google Form to complete your application.
                      </p>
                      <div className="mt-3 flex items-center gap-2 flex-wrap">
                        <div className="flex-1 min-w-[200px] relative">
                          <input
                            type="text"
                            value={selectedDrive.googleFormLink || 'No link available'}
                            readOnly
                            className="w-full text-xs font-mono text-gray-500 bg-white px-3 py-1.5 rounded border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            title="Click the copy button to copy the link"
                          />
                        </div>
                        {selectedDrive.googleFormLink && (
                          <>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(selectedDrive.googleFormLink)
                                  .then(() => {
                                    showAlert('📋 Link copied to clipboard!', 'success', 2000);
                                  })
                                  .catch(() => {
                                    const textArea = document.createElement('textarea');
                                    textArea.value = selectedDrive.googleFormLink;
                                    document.body.appendChild(textArea);
                                    textArea.select();
                                    try {
                                      document.execCommand('copy');
                                      showAlert('📋 Link copied to clipboard!', 'success', 2000);
                                    } catch (err) {
                                      showAlert('❌ Failed to copy link.', 'error', 2000);
                                    }
                                    document.body.removeChild(textArea);
                                  });
                              }}
                              className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition flex items-center gap-1 whitespace-nowrap"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                              </svg>
                              Copy
                            </button>
                            <a
                              href={selectedDrive.googleFormLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition flex items-center gap-1 whitespace-nowrap"
                            >
                              <ExternalLink className="w-3 h-3" />
                              Open
                            </a>
                          </>
                        )}
                      </div>
                      {selectedDrive.googleFormLink && (
                        <p className="text-xs text-gray-400 mt-2">
                          💡 Click "Copy" to copy the link or "Open" to open in new tab
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Interview Process</h3>
                  <div className="space-y-2">
                    {selectedDrive.interviewRounds.map((round, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-bold">
                          {index + 1}
                        </div>
                        <span>{round}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-yellow-800">Before applying, please ensure:</p>
                      <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                        <li>✓ Your profile is complete and up-to-date</li>
                        <li>✓ Your resume is uploaded</li>
                        <li>✓ You are in 3rd or 4th year</li>
                        <li>✓ You have relevant skills for this position</li>
                        <li>✓ You have access to the Google Form</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleApply}
                    disabled={selectedDrive.status !== 'upcoming' || !isEligibleYear() || !selectedDrive.googleFormLink}
                    className={`flex-1 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${selectedDrive.status === 'upcoming' && isEligibleYear() && selectedDrive.googleFormLink
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                  >
                    <ExternalLink className="w-5 h-5" />
                    {!isEligibleYear()
                      ? 'Not Eligible (Year)'
                      : selectedDrive.status === 'ongoing'
                        ? 'Ongoing - Not Accepting'
                        : selectedDrive.status === 'completed'
                          ? 'Completed'
                          : !selectedDrive.googleFormLink
                            ? 'No Form Available'
                            : 'Open Google Form'}
                  </button>
                  <button
                    onClick={() => setShowApplyModal(false)}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>

                {selectedDrive.status === 'upcoming' && selectedDrive.googleFormLink && isEligibleYear() && (
                  <p className="text-md text-gray-500 mt-3 text-center">
                    ⚡ You will be redirected to Google Form in a new tab
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drive Details Modal */}
      <AnimatePresence>
        {selectedDrive && !showApplyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedDrive(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`bg-gradient-to-r p-6 text-white sticky top-0 ${selectedDrive.status === 'upcoming' ? 'from-gray-800 to-gray-900' :
                selectedDrive.status === 'ongoing' ? 'from-yellow-600 to-orange-700' :
                  'from-gray-700 to-gray-900'
                }`}>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                    <Building className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedDrive.companyName}</h2>
                    <p className="text-gray-200">{selectedDrive.roles}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDrive(null)}
                  className="absolute top-4 right-4 text-white/80 hover:text-white"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Job Details</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="font-medium">Package:</span>
                        <span className="font-semibold text-green-700">{formatPackage(selectedDrive.package)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-red-600" />
                        <span className="font-medium">Location:</span>
                        <span>{selectedDrive.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">Drive Date:</span>
                        <span>{new Date(selectedDrive.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-orange-600" />
                        <span className="font-medium">Deadline:</span>
                        <span>{new Date(selectedDrive.applicationDeadline).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-purple-600" />
                        <span className="font-medium">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${selectedDrive.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                          selectedDrive.status === 'ongoing' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                          {getStatusText(selectedDrive.status)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Eligibility</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-purple-600" />
                        <span className="font-medium">Min CGPA:</span>
                        <span>{selectedDrive.eligibility.minCGPA || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">Your CGPA:</span>
                        <span>{studentData?.profile?.cgpa || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="font-medium">Status:</span>
                        {isStudentEligible(studentData, selectedDrive) && selectedDrive.status === 'upcoming' ? (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                            ✅ Eligible
                          </span>
                        ) : selectedDrive.status === 'ongoing' ? (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">
                            ⏳ Ongoing - Not Accepting
                          </span>
                        ) : selectedDrive.status === 'completed' ? (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
                            ❌ Completed
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                            ❌ Not Eligible
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Job Description</h3>
                  <p className="text-gray-600">{selectedDrive.description}</p>
                </div>

                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Requirements</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    {selectedDrive.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>

                {/* Google Form Link in Details Modal */}
                <div className="mt-6 border-t pt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Application Process</h3>

                  {selectedDrive.googleFormLink ? (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                          <LinkIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium text-blue-800">Step 1: Fill Google Form</p>
                          <a
                            href={selectedDrive.googleFormLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1 mt-1 hover:underline"
                          >
                            Click here to fill the application form <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">No application form link provided.</p>
                  )}

                  <div className="space-y-2 mt-3">
                    {selectedDrive.interviewRounds.map((round, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-bold">
                          {selectedDrive.googleFormLink ? index + 2 : index + 1}
                        </div>
                        <span>{round}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t flex gap-3">
                  {selectedDrive?.status === 'upcoming' && isEligibleYear() && selectedDrive.googleFormLink ? (
                    <button
                      onClick={() => {
                        setShowApplyModal(true);
                      }}
                      className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-5 h-5" />
                      Apply Now
                    </button>
                  ) : (
                    <button
                      disabled
                      className="flex-1 bg-gray-300 text-gray-500 py-3 rounded-lg font-semibold cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {!isEligibleYear()
                        ? 'Not Eligible (Year)'
                        : selectedDrive?.status === 'ongoing'
                          ? 'Ongoing - Not Accepting'
                          : selectedDrive?.status === 'completed'
                            ? 'Completed'
                            : !selectedDrive?.googleFormLink
                              ? 'No Form Available'
                              : 'Not Available'}
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedDrive(null)}
                    className="flex-1 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition"
                  >
                    Close
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

export default StudentPlacements;