// Dashboard.jsx - Updated socket connection

import React, { useEffect, useState, useRef } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import StudentSidebar from './components/StudentSidebar';
import StudentNavbar from './components/StudentNavbar';
import StudentHomeDashboard from './StudentHomeDashboard';
import StudentProfile from './StudentProfile';
import StudentPlacements from './StudentPlacements';
import { io } from "socket.io-client";

const Dashboard = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const socketRef = useRef(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  // Initialize socket connection
  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    console.log('🔌 Connecting to socket server:', backendUrl);

    if (!socketRef.current) {
      socketRef.current = io(backendUrl, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socketRef.current.on('connect', () => {
        console.log('✅ Socket connected successfully:', socketRef.current.id);
        setSocketConnected(true);

        // Emit student-online if user is logged in
        const savedUser = localStorage.getItem('user');
        const savedIsLogin = localStorage.getItem('isLogin');
        
        if (savedIsLogin === 'true' && savedUser) {
          try {
            const userData = JSON.parse(savedUser);
            if (userData.id) {
              console.log('📱 Emitting student-online for:', userData.id);
              socketRef.current.emit('student-online', userData.id);
            }
          } catch (error) {
            console.error('Error parsing user data:', error);
          }
        } else if (user.isLogin && user.id) {
          console.log('📱 Emitting student-online for logged in user:', user.id);
          socketRef.current.emit('student-online', user.id);
        }
      });

      socketRef.current.on('connect_error', (error) => {
        console.error('❌ Socket connection error:', error);
        setSocketConnected(false);
      });

      socketRef.current.on('disconnect', () => {
        console.log('🔌 Socket disconnected');
        setSocketConnected(false);
      });

      socketRef.current.on('online-users-update', (users) => {
        console.log('📊 Online users update:', users);
      });
    }

    return () => {
      if (socketRef.current) {
        console.log('🔄 Cleaning up socket connection');
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Handle user authentication - EMIT STUDENT-ONLINE AFTER AUTH
  useEffect(() => {
    const checkAuth = async () => {
      const savedUser = localStorage.getItem('user');
      const savedIsLogin = localStorage.getItem('isLogin');

      if (savedUser && savedIsLogin === 'true') {
        try {
          const userData = JSON.parse(savedUser);
          
          // Update user state if not already set
          if (!user.isLogin || user.id !== userData.id) {
            setUser({
              isLogin: true,
              role: userData.role || 'student',
              name: userData.name || '',
              id: userData.id
            });
          }

          // Emit student-online after a small delay to ensure socket is ready
          if (socketRef.current && socketRef.current.connected && userData.id) {
            setTimeout(() => {
              console.log('📱 Emitting student-online after auth for:', userData.id);
              socketRef.current.emit('student-online', userData.id);
            }, 500);
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
          navigate('/login');
        }
      } else if (!user.isLogin) {
        navigate('/login');
      }
      setIsAuthChecked(true);
    };

    checkAuth();
  }, []);

  // Watch for user state changes
  useEffect(() => {
    if (user.isLogin && user.id && socketRef.current && socketRef.current.connected) {
      console.log('📱 User state changed - emitting student-online for:', user.id);
      socketRef.current.emit('student-online', user.id);
    }
  }, [user.isLogin, user.id]);

  // Handle beforeunload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (user.isLogin && user.id && socketRef.current) {
        console.log('📱 Page closing, emitting student-offline for:', user.id);
        socketRef.current.emit('student-offline', user.id);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [user.isLogin, user.id]);

  // Auth check
  useEffect(() => {
    if (!user.isLogin || user.role !== 'student') {
      navigate('/login');
    }
  }, [user.isLogin, user.role]);

  // Show nothing while checking auth
  if (!isAuthChecked || !user.isLogin || user.role !== "student") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <StudentSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          user={user}
          setUser={setUser}
          socket={socketRef.current}
        />

        <div
          className={`flex-1 min-h-screen transition-all duration-300 ease-in-out
            ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}
        >
          <StudentNavbar
            user={user}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />

          <main className="p-4 sm:p-6">
            <Routes>
              <Route
                path=":id"
                element={<StudentHomeDashboard />}
              />
              <Route
                path=":id/profiledetails"
                element={<StudentProfile user={user} />}
              />
              <Route
                path=":id/placement-drives"
                element={<StudentPlacements user={user} />}
              />
              <Route
                path="*"
                element={<Navigate to={`/studentprofile/${user.id}`} />}
              />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;