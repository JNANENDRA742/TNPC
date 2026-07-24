// src/context/SocketContext.jsx
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};

export const SocketProvider = ({ children }) => {
    const socketRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
        
        // Initialize socket
        socketRef.current = io(backendUrl, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        // Socket event listeners
        socketRef.current.on('connect', () => {
            console.log('✅ Socket connected:', socketRef.current.id);
            setIsConnected(true);
            
            // Request current online users
            socketRef.current.emit('get-online-users');
        });

        socketRef.current.on('disconnect', () => {
            console.log('🔌 Socket disconnected');
            setIsConnected(false);
        });

        socketRef.current.on('connect_error', (error) => {
            console.error('❌ Socket connection error:', error);
            setIsConnected(false);
        });

        // Listen for online users updates
        socketRef.current.on('online-users-update', (users) => {
            console.log('📊 Online users update:', users);
            setOnlineUsers(users);
        });

        // Cleanup
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    const emitStudentOnline = (studentId) => {
        if (socketRef.current && socketRef.current.connected && studentId) {
            socketRef.current.emit('student-online', studentId);
        }
    };

    const emitStudentOffline = (studentId) => {
        if (socketRef.current && socketRef.current.connected && studentId) {
            socketRef.current.emit('student-offline', studentId);
        }
    };

    const value = {
        socket: socketRef.current,
        isConnected,
        onlineUsers,
        emitStudentOnline,
        emitStudentOffline,
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};