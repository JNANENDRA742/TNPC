// socket.js
const { Server } = require("socket.io");

let io;
const onlineUsers = new Map();

function initializeSocket(server) {
    console.log("🔄 Initializing Socket.IO...");
    
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            credentials: true
        },
        transports: ['websocket', 'polling'],
        allowEIO3: true
    });

    io.on('connection', (socket) => {
        console.log('✅ User connected:', socket.id);
        console.log('📊 Total connections:', io.engine.clientsCount);

        // Handle student online
        socket.on("student-online", (studentId) => {
            console.log(`📱 Student ${studentId} came to online`);
            onlineUsers.set(studentId, socket.id);
            console.log("📊 Online Users:", [...onlineUsers.keys()]);
            io.emit("online-users-update", Array.from(onlineUsers.keys()));
        });

        // Handle student offline
        socket.on("student-offline", (studentId) => {
            console.log(`📱 Student ${studentId} went offline`);
            onlineUsers.delete(studentId);
            console.log("📊 Online Users:", [...onlineUsers.keys()]);
            io.emit("online-users-update", Array.from(onlineUsers.keys()));
        });

        // Handle admin online (optional)
        socket.on("admin-online", (adminId) => {
            console.log(`👤 Admin ${adminId} went online`);
            // You can track admins separately if needed
        });

        // Handle get online users request
        socket.on("get-online-users", () => {
            console.log("📊 Sending online users list:", [...onlineUsers.keys()]);
            socket.emit("online-users-update", Array.from(onlineUsers.keys()));
        });

        // Handle disconnect
        socket.on("disconnect", () => {
            console.log('❌ User disconnected:', socket.id);
            let disconnectedStudentId = null;
            for (const [studentId, socketId] of onlineUsers) {
                if (socketId === socket.id) {
                    disconnectedStudentId = studentId;
                    onlineUsers.delete(studentId);
                    console.log(`📱 Student ${studentId} disconnected`);
                    break;
                }
            }
            if (disconnectedStudentId) {
                io.emit("online-users-update", Array.from(onlineUsers.keys()));
            }
            console.log("📊 Online Users:", [...onlineUsers.keys()]);
        });

        // Keep connection alive with ping-pong
        socket.on('ping', () => {
            socket.emit('pong');
        });
    });

    console.log("✅ Socket.IO initialized successfully");
    return io;
}

function getIO() {
    if (!io) {
        throw new Error("Socket is not initialized");
    }
    return io;
}

module.exports = {
    initializeSocket,
    getIO,
    onlineUsers
};