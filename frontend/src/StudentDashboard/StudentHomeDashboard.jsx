import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  User, Mail, Phone, BookOpen, Code, Award, Calendar, CheckCircle,
  Clock, TrendingUp, Briefcase, FileText, Download, Edit,
  BarChart3, PieChart, LineChart, Users, GraduationCap,
  Activity, Zap, Star, Target, Shield, DollarSign, MapPin, Upload, Image,
  AlertTriangle, XCircle, AlertCircle
} from 'lucide-react';
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
  Filler
} from 'chart.js';
import StudentDashboardSkeleton from './components/StudentDashboardSkeleton';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';
import { useAlert } from '../components/Alert';
import { io } from "socket.io-client";

// Register ChartJS components
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
  Filler
);


const StudentHomeDashboard = () => {
  const { id } = useParams();
  const [socketConnected, setSocketConnected] = useState(false);
  const { showAlert, AlertComponent } = useAlert();

  const [year, setYear] = useState(null);
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);
  const [resumeUrl, setResumeUrl] = useState(null);
  const [stats, setStats] = useState({
    totalDrives: 0,
    appliedDrives: 0,
    shortlistedDrives: 0,
    eligibleDrives: 0,
    applicationRate: 0,
    successRate: 0
  });
  // const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingDrives, setUpcomingDrives] = useState([]);
  const [placementStats, setPlacementStats] = useState(null);

   useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    const socket = io(backendUrl);
    
    socket.on('connect', () => {
      setSocketConnected(true);
      console.log('✅ Dashboard socket connected');
      
      // Emit student-online when dashboard loads
      if (id) {
        socket.emit('student-online', id);
        console.log('📱 Emitted student-online for:', id);
      }
    });
    
    socket.on('disconnect', () => {
      setSocketConnected(false);
    });
    
    return () => socket.disconnect();
  }, [id]);
  useEffect(() => {
    // Call all fetch functions when component mounts or id changes
    const fetchAllData = async () => {
      await fetchStudentData();
      await fetchPlacementStats();
      await fetchUpcomingDrives();
      await findYear();
    };

    fetchAllData();
  }, [id]);

  useEffect(() => {
    showAlert("Welcome to your Student Dashboard! 🎓 \n You can access your placement opportunities", "success", 4000);
  }, []);

  const fetchStudentData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/studentprofile/${id}`);
      const data = response.data;
      setStudentData(data);

      // Set profile picture URL if exists
      if (data.profile?.profilePicture) {
        setProfilePictureUrl(`${import.meta.env.VITE_BACKEND_URL}/getProfilePicture/${id}`);
      }

      // Set resume URL if exists
      if (data.profile?.resume) {
        setResumeUrl(`${import.meta.env.VITE_BACKEND_URL}/getResume/${id}`);
      }

      // Calculate statistics
      const drivesResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/companydrives`);

      const allDrives = drivesResponse.data;

      const eligible = allDrives.filter((drive) => {
        const studentCGPA = data.profile?.cgpa || 0;
        const minCGPA = drive.eligibility?.minCGPA || 0;
        return studentCGPA >= minCGPA;
      }).length;
      const applied = data.applied_drives?.length || 0;
      const shortlisted = data.shortlisted_drives?.length || 0;

      setStats({
        totalDrives: eligible,
        appliedDrives: applied,
        shortlistedDrives: shortlisted,
        eligibleDrives: eligible,
        applicationRate: eligible > 0 ? (applied / eligible) * 100 : 0,
        successRate: applied > 0 ? (shortlisted / applied) * 100 : 0
      });

    } catch (error) {
      console.error('Error fetching student data:', error);
      showAlert("Error fetching student data ❌: " + (error.response?.data?.message || error.message), "error", 5000);
    } finally {
      setLoading(false);
    }
  };

  const fetchUpcomingDrives = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/companydrives`);
      const drives = response.data;

      const upcoming = drives.filter(drive => drive.status === "upcoming");

      const formattedDrives = upcoming.map(drive => ({
        id: drive._id,
        companyName: drive.companyName,
        roles: drive.roles,
        date: new Date(drive.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        eligibility: drive.eligibility || 'All Branches',
        package: drive.package || 'Not specified'
      }));

      setUpcomingDrives(formattedDrives);
    } catch (error) {
      console.error('Error fetching upcoming drives:', error);
      showAlert("Error fetching upcoming drives ❌: " + (error.response?.data?.message || error.message), "error", 5000);
    }
  };

  const fetchPlacementStats = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/placements`);
      setPlacementStats(response.data);
    } catch (error) {
      console.error('Error fetching placement stats:', error);
      showAlert("Error fetching placement stats ❌: " + (error.response?.data?.message || error.message), "error", 5000);
    }
  };

  const findYear = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/studentyear/${id}`);
      setYear(res.data.year);
      console.log("Student year fetched:", res.data.year);
    } catch (error) {
      console.error('Error fetching student year:', error);
      showAlert("Error fetching student year ❌: " + (error.response?.data?.message || error.message), "error", 5000);
    }
  };

  // Handle resume upload
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/uploadResume/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      showAlert("Resume uploaded successfully ✅", "success", 5000);
      setResumeUrl(`${import.meta.env.VITE_BACKEND_URL}/getResume/${id}?t=${Date.now()}`);
      await fetchStudentData(); // Refresh data

    } catch (err) {
      console.error('Error uploading resume:', err);
      showAlert("Upload failed ❌: " + (err.response?.data?.message || err.message), "error", 5000);
    }
  };

  if (loading) {
    return (
      // <LoadingAnimation
      //   variant="premium"
      //   message="Loading your Dashboard..."
      //   subMessage="Please wait for while..."
      // />
      <StudentDashboardSkeleton />
    );
  }

  // Chart Data Configurations
  const applicationChartData = {
    labels: ['Eligible Drives', 'Applied Drives', 'Shortlisted'],
    datasets: [
      {
        label: 'Number of Drives',
        data: [stats.eligibleDrives, stats.appliedDrives, stats.shortlistedDrives],
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
        ],
        borderColor: [
          'rgb(54, 162, 235)',
          'rgb(75, 192, 192)',
          'rgb(153, 102, 255)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const successRateChartData = {
    labels: ['Success Rate', 'Remaining'],
    datasets: [
      {
        data: [stats.successRate, 100 - stats.successRate],
        backgroundColor: ['rgba(75, 192, 192, 0.8)', 'rgba(200, 200, 200, 0.3)'],
        borderColor: ['rgb(75, 192, 192)', 'rgb(200, 200, 200)'],
        borderWidth: 2,
      },
    ],
  };

  const skillsData = {
    labels: studentData?.profile?.skills || ['No Skills Added'],
    datasets: [
      {
        label: 'Skill Proficiency',
        data: studentData?.profile?.skills?.map(() => Math.floor(Math.random() * 40) + 60) || [0],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 1,
      },
    ],
  };

  const placementTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Companies Visited',
        data: [12, 19, 15, 17, 14, 20],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Students Placed',
        data: [8, 14, 12, 15, 18, 22],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4 sm:p-6">
      <div className="flex justify-end mb-4">
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
          socketConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          <span className={`w-2 h-2 rounded-full ${socketConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          {socketConnected ? 'Connected' : 'Disconnected'}
        </div>
      </div>
      {/* Alert Component */}
      {AlertComponent}

      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome {studentData?.name || 'Student'}! 🎓
            </h1>
            <p className="text-gray-600 mt-2">Track your placement journey and performance</p>
          </div>
        </div>
      </div>

      {/* Profile Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Personal Info Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Profile Overview</h2>
            <div className="bg-blue-100 p-2 rounded-full">
              <User className="w-5 h-5 text-blue-600" />
            </div>
          </div>

          {/* Profile Picture Display with Upload */}
          <div className="flex justify-center mb-4">
            {profilePictureUrl ? (
              <div className="relative group">
                <img
                  src={profilePictureUrl}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '';
                    e.target.parentElement.innerHTML = `
                      <div class="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-blue-500">
                        <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                      </div>
                    `;
                  }}
                />
              </div>
            ) : (
              <div className="relative group">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-blue-500">
                  <User className="w-12 h-12 text-gray-400" />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center">
              <User className="w-4 h-4 text-gray-400 mr-3" />
              <span className="text-gray-600">Name:</span>
              <span className="ml-2 font-medium text-gray-800">{studentData?.name}</span>
            </div>
            <div className="flex items-center">
              <Mail className="w-4 h-4 text-gray-400 mr-3" />
              <span className="text-gray-600">Email:</span>
              <span className="ml-2 font-medium text-gray-800">{studentData?.email}</span>
            </div>
            <div className="flex items-center">
              <GraduationCap className="w-4 h-4 text-gray-400 mr-3" />
              <span className="text-gray-600">Student ID:</span>
              <span className="ml-2 font-medium text-gray-800">
                {studentData?.studentId || 'Not added'}
              </span>
            </div>
            <div className="flex items-center">
              <Phone className="w-4 h-4 text-gray-400 mr-3" />
              <span className="text-gray-600">Phone:</span>
              <span className="ml-2 font-medium text-gray-800">
                {studentData?.profile?.phone || 'Not added'}
              </span>
            </div>
            <div className="flex items-center">
              <BookOpen className="w-4 h-4 text-gray-400 mr-3" />
              <span className="text-gray-600">Department:</span>
              <span className="ml-2 font-medium text-gray-800">
                {studentData?.profile?.department || 'Not added'}
              </span>
            </div>
            <div className="flex items-center">
              <GraduationCap className="w-4 h-4 text-gray-400 mr-3" />
              <span className="text-gray-600">Year:</span>
              <span className="ml-2 font-medium text-gray-800">
                {year ? `${year}` : 'Not available'}
              </span>
            </div>
          </div>
        </div>

        {/* Academic Info Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Academic Details</h2>
            <div className="bg-green-100 p-2 rounded-full">
              <Award className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="text-center mb-4">
            <div className="relative inline-block">
              <div className="text-5xl font-bold text-blue-600">
                {studentData?.profile?.cgpa || 0}
              </div>
              <div className="text-sm text-gray-500">out of 10</div>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-600 text-md font-semibold">CGPA Progress</span>
                <span className="text-blue-600 font-medium">{((studentData?.profile?.cgpa || 0) / 10 * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-500 bg-blue-600"
                  style={{ width: `${(studentData?.profile?.cgpa || 0) / 10 * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-gray-600">Required CGPA for Top Companies</span>
              <span className="font-semibold text-green-600">8.0+</span>
            </div>
          </div>
        </div>

        {/* Skills Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Skills & Projects</h2>
            <div className="bg-purple-100 p-2 rounded-full">
              <Code className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Technical Skills</h3>
            <div className="flex flex-wrap gap-2">
              {studentData?.profile?.skills?.length > 0 ? (
                studentData.profile.skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-gray-500 text-sm">No skills added yet</span>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Projects</h3>
            <div className="space-y-2">
              {studentData?.profile?.projects?.length > 0 ? (
                studentData.profile.projects.slice(0, 2).map((project, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Target className="w-4 h-4 text-green-500 mt-0.5" />
                    <span className="text-sm text-gray-600">{project}</span>
                  </div>
                ))
              ) : (
                <span className="text-gray-500 text-sm">No projects added</span>
              )}
              {studentData?.profile?.projects?.length > 2 && (
                <button className="text-green-800 text-sm mt-1">+{studentData.profile.projects.length - 2} more</button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-3">
            <Briefcase className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">{stats.eligibleDrives}</span>
          </div>
          <h3 className="text-md">Eligible Drives</h3>
          <p className="text-sm opacity-75 mt-1">Companies you can apply to</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-3">
            <CheckCircle className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">{stats.appliedDrives}</span>
          </div>
          <h3 className="text-md">Applied Drives</h3>
          <p className="text-sm opacity-75 mt-1">Applications submitted</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-3">
            <Star className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">{stats.shortlistedDrives}</span>
          </div>
          <h3 className="text-md">Shortlisted</h3>
          <p className="text-sm opacity-75 mt-1">Selected for next rounds</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-3">
            <TrendingUp className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">{stats.successRate.toFixed(1)}%</span>
          </div>
          <h3 className="text-md">Success Rate</h3>
          <p className="text-sm opacity-75 mt-1">Shortlisted / Applied ratio</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Application Status Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Drive Details</h2>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <Bar
            data={applicationChartData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'top' },
                title: { display: false }
              },
              scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } }
              }
            }}
          />
        </div>

        {/* Success Rate Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Success Rate Analysis</h2>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex justify-center">
            <div className="w-64 h-64">
              <Doughnut
                data={successRateChartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'bottom' },
                    tooltip: { callbacks: { label: (context) => `${context.label}: ${context.raw.toFixed(1)}%` } }
                  }
                }}
              />
            </div>
          </div>
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">Your shortlisting success rate</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{stats.successRate.toFixed(1)}%</p>
          </div>
        </div>
      </div>

      {/* Placement Trends & Skill Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Placement Trends */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Placement Trends</h2>
            <LineChart className="w-5 h-5 text-gray-400" />
          </div>
          <Line
            data={placementTrendData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'top' },
              },
              scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } }
              }
            }}
          />
        </div>

        {/* Skills Proficiency Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Skills Analysis</h2>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          {studentData?.profile?.skills?.length > 0 ? (
            <Bar
              data={skillsData}
              options={{
                responsive: true,
                indexAxis: 'x',
                plugins: {
                  legend: { position: 'top' },
                },
                scales: {
                  x: { max: 100, title: { display: true, text: 'Proficiency Level (%)' } }
                }
              }}
            />
          ) : (
            <div className="text-center py-12">
              <Code className="w-16 h-16 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No skills added yet</p>
              <a
                href={`/studentprofile/${id}`}
                className="mt-3 text-blue-600 text-sm inline-block hover:underline"
              >
                Add your skills now
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Drives & Resume Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Drives Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Upcoming Next 3 Drives
            </h2>
          </div>
          <div className="overflow-x-auto">
            {upcomingDrives.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Company</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Package</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {upcomingDrives.slice(0, 3).map((drive) => (
                    <tr key={drive.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <Briefcase className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="font-medium text-gray-900">{drive.companyName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{drive.roles}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span className="text-gray-600">{drive.date}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          {drive.package}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8">
                <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No upcoming drives available</p>
              </div>
            )}
          </div>
        </div>

        {/* Resume Section with MongoDB Storage */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Resume / CV
            </h2>
          </div>
          <div className="p-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="font-medium text-gray-800 mb-2">Your Resume</h3>

              {resumeUrl ? (
                <div className="space-y-3">
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition"
                  >
                    <Download className="w-4 h-4" />
                    Download Resume
                  </a>
                  <p className="text-xs text-gray-500">Resume stored securely in database</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-gray-600 font-medium">No resume uploaded</p>
                  <p className="text-sm text-gray-500">Upload your resume to apply for drives</p>
                </div>
              )}

              <div className="mt-4">
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition cursor-pointer">
                  <Upload className="w-4 h-4" />
                  {resumeUrl ? 'Update Resume' : 'Upload Resume'}
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeUpload}
                  />
                </label>
                <p className="text-xs text-gray-400 mt-2">PDF, DOC, or DOCX (Max 5MB)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentHomeDashboard;