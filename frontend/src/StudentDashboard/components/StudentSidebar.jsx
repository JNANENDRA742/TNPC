// StudentSidebar.jsx
import React, { useEffect, useRef, useState } from 'react';
import {
  Home, UserCircle, Calendar, Briefcase, FileText,
  Bell, Settings, LogOut, Shield, Menu, ChevronRight,
  LayoutDashboard, GraduationCap, Award, BarChart3,
  Users
} from "lucide-react";
import { useNavigate, useLocation } from 'react-router-dom';
import { AlertCircle, X } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';

const StudentSidebar = ({ 
  sidebarOpen, 
  setSidebarOpen, 
  user, 
  setUser,
  socket // Receiving socket from parent
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const timeoutRef = useRef(null);

  // Set active tab based on current URL
  const getActiveTabFromPath = () => {
    const path = location.pathname;
    if (path.includes('/profiledetails')) return "profile";
    if (path.includes('/placement-drives')) return "drives";
    return "dashboard";
  };

  const [activeTab, setActiveTab] = useState(getActiveTabFromPath());

  // Update active tab when URL changes
  useEffect(() => {
    setActiveTab(getActiveTabFromPath());
  }, [location.pathname]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const sidebarItems = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: LayoutDashboard,
      link: `/studentprofile/${user?.id || ''}`
    },
    {
      id: 'profile',
      name: 'My Profile',
      icon: UserCircle,
      link: `/studentprofile/${user?.id || ''}/profiledetails`
    },
    {
      id: 'drives',
      name: 'Placement Drives',
      icon: Briefcase,
      link: `/studentprofile/${user?.id || ''}/placement-drives`
    },
  ];

  const handleOpenPopup = () => {
    setShowLogoutPopup(true);
  };

  const handleClosePopup = () => {
    if (!isLoggingOut) {
      setShowLogoutPopup(false);
    }
  };

  const handleLogout = () => {
    setIsLoggingOut(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Emit student-offline event BEFORE clearing user data
    if (socket && user.id) {
      console.log('Emitting student-offline for:', user.id);
      socket.emit("student-offline", user.id);
    }

    timeoutRef.current = setTimeout(() => {
      // Clear localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('isLogin');

      // Clear user state
      setUser({
        isLogin: false,
        role: "",
        name: "",
        id: ""
      });

      // Close popup
      setShowLogoutPopup(false);
      setIsLoggingOut(false);
      
      // Navigate to login
      navigate("/login", { replace: true });
    }, 500);
  };

  const handleNavigation = (item) => {
    if (item.link) {
      setActiveTab(item.id);
      navigate(item.link);
      // Close sidebar on mobile after navigation
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 ease-in-out z-50
          ${sidebarOpen ? 'w-64' : 'w-20'} 
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Brand/Logo */}
        <div className={`p-4 border-b border-gray-700 transition-all duration-300 ${!sidebarOpen && 'px-3'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            {sidebarOpen && (
              <div className="overflow-hidden">
                <h1 className="text-lg font-bold text-white whitespace-nowrap">Student Portal</h1>
                <p className="text-xs text-gray-400 whitespace-nowrap">Placement Cell</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100%-8rem)]">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                ${activeTab === item.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                }
                ${!sidebarOpen && 'justify-center px-2'}`}
              title={!sidebarOpen ? item.name : ''}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${activeTab === item.id ? 'text-white' : 'text-gray-400'}`} />
              {sidebarOpen && <span className="text-sm font-medium whitespace-nowrap">{item.name}</span>}
            </button>
          ))}

          {/* Logout Button */}
          <button
            onClick={handleOpenPopup}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 mt-4
              text-red-400 hover:bg-red-900/20 hover:text-red-300
              ${!sidebarOpen && 'justify-center px-2'}`}
            title={!sidebarOpen ? 'Logout' : ''}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="text-sm font-medium whitespace-nowrap">Logout</span>}
          </button>
        </nav>

        {/* Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-24 bg-gray-700 rounded-full p-1 hover:bg-gray-600 transition-colors shadow-lg z-50"
        >
          <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${sidebarOpen ? 'rotate-180' : ''}`} />
        </button>
      </aside>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
            onClick={handleClosePopup}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative bg-gradient-to-r from-red-500 to-red-600 p-6 text-white text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="absolute -top-8 left-1/2 transform -translate-x-1/2"
                >
                  <div className="bg-white rounded-full p-3 shadow-lg">
                    <AlertCircle className="w-12 h-12 text-red-500" />
                  </div>
                </motion.div>

                <button
                  onClick={handleClosePopup}
                  className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                  disabled={isLoggingOut}
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="mt-6">
                  <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl font-bold mb-2"
                  >
                    Confirm Logout
                  </motion.h2>
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-red-100"
                  >
                    Are you sure you want to logout?
                  </motion.p>
                </div>
              </div>

              <div className="p-6">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center mb-6"
                >
                  <div className="flex justify-center mb-4">
                    <motion.div
                      animate={{
                        rotate: [0, -5, 5, -5, 0]
                      }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                    >
                      <LogOut className="w-16 h-16 text-red-500" />
                    </motion.div>
                  </div>

                  <p className="text-gray-600 mb-4">
                    You will be redirected to the login page and will need to log in again to access your account.
                  </p>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                    <div className="flex items-center gap-2 text-yellow-700 mb-1">
                      <AlertCircle className="w-4 h-4" />
                      <span className="font-semibold text-sm">Note:</span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Any unsaved changes will be lost. Make sure to save your work before logging out.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-3"
                >
                  <motion.button
                    whileHover={{ scale: isLoggingOut ? 1 : 1.02 }}
                    whileTap={{ scale: isLoggingOut ? 1 : 0.98 }}
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className={`w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold transition-all shadow-md flex items-center justify-center gap-2 ${isLoggingOut ? 'opacity-70 cursor-not-allowed' : 'hover:from-red-600 hover:to-red-700'
                      }`}
                  >
                    {isLoggingOut ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Logging out...
                      </>
                    ) : (
                      <>
                        <LogOut className="w-5 h-5" />
                        Yes, Logout
                      </>
                    )}
                  </motion.button>

                  <button
                    onClick={handleClosePopup}
                    disabled={isLoggingOut}
                    className={`w-full py-3 border-2 border-gray-200 text-gray-600 rounded-xl font-semibold transition-all ${!isLoggingOut && 'hover:bg-gray-50 hover:border-gray-300'
                      }`}
                  >
                    Cancel
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default StudentSidebar;