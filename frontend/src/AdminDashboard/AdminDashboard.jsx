// src/AdminDashboard/AdminDashboard.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAlert } from '../components/Alert';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import OverviewTab from './tabs/OverviewTab';
import StudentsTab from './tabs/StudentsTab';
import DrivesTab from './tabs/DrivesTab';
import PlacementsTab from './tabs/PlacementsTab';
import StudentModal from './modals/StudentModal';
import DriveModal from './modals/DriveModal';
import PlacementModal from './modals/PlacementModal';
import LogoutModal from './modals/LogoutModal';
import { useAdminData } from './hooks/useAdminData';
import { sidebarItems, tabMessages } from './constants';
import { AnimatePresence } from 'framer-motion';
import ActivitiesTab from './tabs/ActivitiesTab';
import DepartmentStatsTab from './tabs/DepartmentStatsTab';
import AdminDashboardSkeleton from './components/AdminDashboardSkeleton';
import { io } from "socket.io-client";
const AdminDashboard = ({ user, setUser }) => {
    const navigate = useNavigate();
    const { showAlert, AlertComponent } = useAlert();
    const socketRef = useRef(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [activeTab, setActiveTab] = useState('overview');
    const [showStudentModal, setShowStudentModal] = useState(false);
    const [showDriveModal, setShowDriveModal] = useState(false);
    const [showPlacementModal, setShowPlacementModal] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const [socketConnected, setSocketConnected] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        name: '', email: '', studentId: '', department: '', cgpa: '', phone: '', password: '', year: ''
    });
    const [driveFormData, setDriveFormData] = useState({
        companyName: '', roles: '', package: '', location: '', date: '', status: 'upcoming', description: '', eligibility: '', googleFormLink: ''
    });
    const [placementFormData, setPlacementFormData] = useState({
        name: '', company: '', package: '', department: '', year: new Date().getFullYear()
    });

    const { loading, students, drives, placements, stats, recentActivities, fetchAllData, fetchRecentActivities, refreshActivities } = useAdminData();

    useEffect(() => {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;

        socketRef.current = io(backendUrl);

        socketRef.current.on("connect", () => {
            console.log("✅ Admin Connected");
            setSocketConnected(true);
            socketRef.current.emit("admin-online", user.id);
            socketRef.current.emit("get-online-users");
        });

        socketRef.current.on("disconnect", () => {
            console.log("🔌 Admin Disconnected");
            setSocketConnected(false);
        });

        socketRef.current.on("online-users-update", (users) => {
            console.log("📊 Online users:", users);
            setOnlineUsers(users);
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);
    // Responsive handling
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth < 768) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Welcome alert
    useEffect(() => {
        showAlert("Welcome to the Admin Dashboard!", "success", 4000);
    }, []);

    // Tab change alert
    useEffect(() => {
        const tabConfig = tabMessages[activeTab];
        if (tabConfig) {
            showAlert(tabConfig.message, tabConfig.type, tabConfig.duration);
        }
    }, [activeTab]);

    // Auth check
    useEffect(() => {
        if (!user.isLogin || user.role !== "admin") {
            navigate("/login");
        }
    }, [user.isLogin, user.role, navigate]);

    if (!user.isLogin || user.role !== "admin") {
        return null;
    }

    // Show skeleton while loading
    if (loading) {
        return <AdminDashboardSkeleton />;
    }

    // ================= STUDENT HANDLERS =================
    const handleAddStudent = async (e) => {
        e.preventDefault();
        if (submitting) return;
        setSubmitting(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/students`, formData);
            if (response.status === 201 || response.status === 200) {
                showAlert('Student added successfully!', 'success', 3000);
                setShowStudentModal(false);
                setFormData({
                    name: '', email: '', studentId: '', department: '', cgpa: '', phone: '', password: '', year: ""
                });
                await fetchAllData();
            }
        } catch (error) {
            console.error('Error adding student:', error);
            showAlert(error.response?.data?.message || 'Failed to add student', 'error', 3000);
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdateStudent = async (e) => {
        e.preventDefault();
        if (submitting) return;
        setSubmitting(true);
        try {
            const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/admin/students/${editingItem}`, formData);
            if (response.status === 200) {
                showAlert('Student updated successfully!', 'success', 3000);
                setShowStudentModal(false);
                setEditingItem(null);
                setFormData({
                    name: '', email: '', studentId: '', department: '', cgpa: '', phone: '', password: '', year: ''
                });
                await fetchAllData();
            }
        } catch (error) {
            console.error('Error updating student:', error);
            showAlert(error.response?.data?.message || 'Failed to update student', 'error', 3000);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteStudent = async (studentId) => {
        if (!window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
            return;
        }

        try {
            const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/admin/students/${studentId}`);
            if (response.status === 200) {
                showAlert('Student deleted successfully!', 'success', 3000);
                await fetchAllData();
            } else {
                throw new Error(response.data.message || 'Failed to delete student');
            }
        } catch (error) {
            console.error('Error deleting student:', error);
            showAlert(error.response?.data?.message || 'Failed to delete student', 'error', 3000);
        }
    };

    const handleEditStudent = (student) => {
        const studentId = student.student?._id || student._id;
        setEditingItem(studentId);
        setFormData({
            name: student.student?.name || student.name || '',
            email: student.student?.email || student.email || '',
            studentId: student.studentId || '',
            department: student.profile?.department || '',
            cgpa: student.profile?.cgpa || '',
            phone: student.profile?.phone || '',
            password: '',
            year: student.year
        });
        setShowStudentModal(true);
    };

    // ================= DRIVE HANDLERS =================

    const handleAddDrive = async (driveData) => {
        if (submitting) return;
        setSubmitting(true);
        try {
            console.log('📤 Adding drive with data:', driveData);

            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/admin/drives`,
                driveData,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                showAlert('Drive added successfully!', 'success', 3000);
                setShowDriveModal(false);
                setDriveFormData({
                    companyName: '', roles: '', package: '', location: '',
                    date: '', status: 'upcoming', description: '', eligibility: '', googleFormLink: "",
                });
                await fetchAllData();
            } else {
                showAlert(response.data.message || 'Failed to add drive', 'error', 3000);
            }
        } catch (error) {
            console.error('❌ Error adding drive:', error);
            showAlert(
                error.response?.data?.message || 'Failed to add drive. Please try again.',
                'error',
                3000
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdateDrive = async (driveData) => {
        if (submitting) return;
        setSubmitting(true);
        try {
            console.log('📤 Updating drive with data:', driveData);

            const response = await axios.patch(
                `${import.meta.env.VITE_BACKEND_URL}/admin/drives/${editingItem}`,
                driveData,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data) {
                showAlert('Drive updated successfully!', 'success', 3000);
                setShowDriveModal(false);
                setEditingItem(null);
                setDriveFormData({
                    companyName: '', roles: '', package: '', location: '',
                    date: '', status: 'upcoming', description: '', eligibility: '', googleFormLink: "",
                });
                await fetchAllData();
            } else {
                showAlert(response.data.message || 'Failed to update drive', 'error', 3000);
            }
        } catch (error) {
            console.error('❌ Error updating drive:', error);
            showAlert(
                error.response?.data?.message || 'Failed to update drive. Please try again.',
                'error',
                3000
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteDrive = async (driveId) => {
        if (!window.confirm('Are you sure you want to delete this drive? This action cannot be undone.')) {
            return;
        }

        try {
            const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/admin/drives/${driveId}`);
            if (response.status === 200) {
                showAlert('Drive deleted successfully!', 'success', 3000);
                await fetchAllData();
            }
        } catch (error) {
            console.error('Error deleting drive:', error);
            showAlert(error.response?.data?.message || 'Failed to delete drive', 'error', 3000);
        }
    };

    const handleEditDrive = (drive) => {
        setEditingItem(drive._id);
        setDriveFormData({
            companyName: drive.companyName || '',
            roles: drive.roles || '',
            package: drive.package || '',
            location: drive.location || '',
            date: drive.date ? drive.date.split('T')[0] : '',
            status: drive.status || 'upcoming',
            description: drive.description || '',
            eligibility: drive.eligibility || '',
            googleFormLink: drive.googleFormLink || ''
        });
        setShowDriveModal(true);
    };

    // ================= PLACEMENT HANDLERS =================
    const handleAddPlacement = async (e) => {
        e.preventDefault();
        if (submitting) return;
        setSubmitting(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/admin/placements`,
                placementFormData
            );
            if (response.status === 201 || response.status === 200) {
                const newPlacement = response.data.placement;
                console.log('📊 New placement created:', newPlacement);
                console.log('📊 CreatedAt:', newPlacement.createdAt);

                showAlert('Placement added successfully!', 'success', 3000);
                setShowPlacementModal(false);
                setPlacementFormData({
                    name: '', company: '', package: '',
                    department: '', year: new Date().getFullYear()
                });

                await fetchAllData();
            }
        } catch (error) {
            console.error('Error adding placement:', error);
            showAlert(error.response?.data?.message || 'Failed to add placement', 'error', 3000);
        } finally {
            setSubmitting(false);
        }
    };

    // Function to refresh placements - uses the hook's fetchAllData
    const handleRefreshPlacements = async () => {
        await fetchAllData();
    };

    const handleDeletePlacement = async (placementId) => {
        if (!window.confirm('Are you sure you want to delete this placement record?')) {
            return;
        }

        try {
            const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/admin/placements/${placementId}`);
            if (response.status === 200) {
                showAlert('Placement deleted successfully!', 'success', 3000);
                await fetchAllData();
            }
        } catch (error) {
            console.error('Error deleting placement:', error);
            showAlert(error.response?.data?.message || 'Failed to delete placement', 'error', 3000);
        }
    };

    // ================= LOGOUT HANDLER =================
    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('isLogin');
        localStorage.removeItem('token');

        setUser({
            isLogin: false,
            role: "",
            name: "",
            id: ""
        });
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {AlertComponent}

            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isMobile={isMobile}
                setShowLogoutModal={setShowLogoutModal}
            />

            <main className={`transition-all duration-300 min-h-screen
                ${isMobile ? 'ml-0' : (sidebarOpen ? 'ml-64' : 'ml-20')}`}
            >
                <Header
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    user={user}
                    activeTab={activeTab}
                    sidebarItems={sidebarItems}
                />

                <div className="p-3 sm:p-4 md:p-6">
                    {activeTab === 'overview' && (
                        <OverviewTab
                            stats={stats}
                            recentActivities={recentActivities}
                            fetchRecentActivities={fetchRecentActivities}
                            isMobile={isMobile}
                        />
                    )}

                    {activeTab === 'students' && (
                        <StudentsTab
                            students={students}
                            onlineUsers={onlineUsers}
                            onAddStudent={() => {
                                setEditingItem(null);
                                setFormData({
                                    name: '', email: '', studentId: '',
                                    department: '', cgpa: '', phone: '', password: '', year: ''
                                });
                                setShowStudentModal(true);
                            }}
                            onEditStudent={handleEditStudent}
                            onDeleteStudent={handleDeleteStudent}
                        />
                    )}

                    {activeTab === 'drives' && (
                        <DrivesTab
                            drives={drives}
                            onAddDrive={() => {
                                setEditingItem(null);
                                setDriveFormData({
                                    companyName: '', roles: '', package: '',
                                    location: '', date: '', status: 'upcoming',
                                    description: '', eligibility: '', googleFormLink: "",
                                });
                                setShowDriveModal(true);
                            }}
                            onEditDrive={handleEditDrive}
                            onDeleteDrive={handleDeleteDrive}
                            loading={loading}
                        />
                    )}

                    {activeTab === 'placements' && (
                        <PlacementsTab
                            placements={placements}
                            onAddPlacement={() => {
                                setPlacementFormData({
                                    name: '', company: '', package: '',
                                    department: '', year: new Date().getFullYear()
                                });
                                setShowPlacementModal(true);
                            }}
                            onDeletePlacement={handleDeletePlacement}
                            onRefresh={handleRefreshPlacements}
                        />
                    )}

                    {activeTab === 'activities' && (
                        <ActivitiesTab
                            activities={recentActivities}
                            onRefresh={refreshActivities}
                            isMobile={isMobile}
                        />
                    )}

                    {activeTab === 'department-stats' && (
                        <DepartmentStatsTab
                            activities={recentActivities}
                            stats={stats}
                            isMobile={isMobile} />
                    )}
                </div>
            </main>

            {/* Modals */}
            <AnimatePresence>
                {showStudentModal && (
                    <StudentModal
                        isEditing={!!editingItem}
                        formData={formData}
                        setFormData={setFormData}
                        onClose={() => setShowStudentModal(false)}
                        onSubmit={editingItem ? handleUpdateStudent : handleAddStudent}
                        isSubmitting={submitting}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showDriveModal && (
                    <DriveModal
                        isEditing={!!editingItem}
                        formData={driveFormData}
                        setFormData={setDriveFormData}
                        onClose={() => {
                            setShowDriveModal(false);
                            setEditingItem(null);
                        }}
                        onSubmit={editingItem ? handleUpdateDrive : handleAddDrive}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showPlacementModal && (
                    <PlacementModal
                        formData={placementFormData}
                        setFormData={setPlacementFormData}
                        onClose={() => setShowPlacementModal(false)}
                        onSubmit={handleAddPlacement}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showLogoutModal && (
                    <LogoutModal
                        onClose={() => setShowLogoutModal(false)}
                        onConfirm={handleLogout}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;