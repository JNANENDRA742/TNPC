// src/AdminDashboard/components/Sidebar.jsx

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LayoutDashboard, 
    Users, 
    Briefcase, 
    Activity, 
    GraduationCap, 
    Award, 
    BarChart3, 
    LogOut, 
    Shield, 
    ChevronRight, 
    Menu 
} from 'lucide-react';

const iconMap = {
    LayoutDashboard: LayoutDashboard,
    Users: Users,
    Briefcase: Briefcase,
    Award: Award,
    BarChart3: BarChart3,
    Activity: Activity,
    GraduationCap: GraduationCap
};

const Sidebar = ({ 
    sidebarOpen, 
    setSidebarOpen, 
    activeTab, 
    setActiveTab, 
    isMobile, 
    setShowLogoutModal 
}) => {
    const sidebarItems = [
        { id: 'overview', name: 'Overview', icon: 'LayoutDashboard', color: 'from-blue-500 to-blue-600' },
        { id: 'students', name: 'Students', icon: 'Users', color: 'from-green-500 to-green-600' },
        { id: 'drives', name: 'Company Drives', icon: 'Briefcase', color: 'from-purple-500 to-purple-600' },
        { id: 'placements', name: 'Placements', icon: 'Award', color: 'from-yellow-500 to-yellow-600' },
        { id: 'activities', name: 'Activities', icon: "Activity", color: 'from-pink-500 to-pink-600' },
        { id: 'department-stats', name: 'Department Stats', icon: 'GraduationCap', color: 'from-indigo-500 to-indigo-600' }
    ];

    // Sidebar container variants
    const sidebarVariants = {
        open: {
            width: '16rem',
            transition: {
                type: 'spring',
                stiffness: 300,
                damping: 30,
                staggerChildren: 0.05
            }
        },
        closed: {
            width: '5rem',
            transition: {
                type: 'spring',
                stiffness: 300,
                damping: 30
            }
        },
        mobileOpen: {
            x: 0,
            transition: {
                type: 'spring',
                stiffness: 300,
                damping: 30
            }
        },
        mobileClosed: {
            x: '-100%',
            transition: {
                type: 'spring',
                stiffness: 300,
                damping: 30
            }
        }
    };

    // Item variants for 3D effect
    const itemVariants = {
        open: {
            x: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 300,
                damping: 25
            }
        },
        closed: {
            x: -20,
            opacity: 0,
            transition: {
                type: 'spring',
                stiffness: 300,
                damping: 25
            }
        }
    };

    // 3D hover effect variants
    const hover3D = {
        rest: {
            scale: 1,
            rotateX: 0,
            rotateY: 0,
            boxShadow: '0px 0px 0px rgba(0, 0, 0, 0)',
            transition: {
                type: 'spring',
                stiffness: 400,
                damping: 20
            }
        },
        hover: {
            scale: 1.05,
            rotateX: 5,
            rotateY: 8,
            boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.3)',
            transition: {
                type: 'spring',
                stiffness: 400,
                damping: 15
            }
        }
    };

    // Active tab 3D effect
    const activeVariants = {
        rest: {
            scale: 1,
            rotateX: 0,
            rotateY: 0,
            zIndex: 1
        },
        active: {
            scale: 1.02,
            rotateX: 2,
            rotateY: 5,
            zIndex: 10,
            boxShadow: '0px 8px 25px rgba(59, 130, 246, 0.4)',
            transition: {
                type: 'spring',
                stiffness: 400,
                damping: 20
            }
        }
    };

    // Icon animation variants
    const iconVariants = {
        rest: {
            scale: 1,
            rotate: 0,
            transition: {
                type: 'spring',
                stiffness: 300,
                damping: 20
            }
        },
        hover: {
            scale: 1.2,
            rotate: 10,
            transition: {
                type: 'spring',
                stiffness: 400,
                damping: 10
            }
        },
        active: {
            scale: 1.1,
            rotate: 0,
            transition: {
                type: 'spring',
                stiffness: 400,
                damping: 15
            }
        }
    };

    // Text animation variants
    const textVariants = {
        open: {
            opacity: 1,
            x: 0,
            transition: {
                type: 'spring',
                stiffness: 300,
                damping: 25,
                delay: 0.1
            }
        },
        closed: {
            opacity: 0,
            x: -20,
            transition: {
                type: 'spring',
                stiffness: 300,
                damping: 25
            }
        }
    };

    // Glow effect variants
    const glowVariants = {
        rest: {
            opacity: 0,
            scale: 0.8
        },
        hover: {
            opacity: 1,
            scale: 1.2,
            transition: {
                type: 'spring',
                stiffness: 300,
                damping: 20
            }
        }
    };

    return (
        <motion.aside
            className={`fixed top-0 left-0 h-full bg-gradient-to-b from-gray-900 to-gray-800 text-white z-30 overflow-hidden
                ${isMobile ? '' : 'shadow-2xl'}`}
            initial={false}
            animate={
                isMobile 
                    ? (sidebarOpen ? 'mobileOpen' : 'mobileClosed')
                    : (sidebarOpen ? 'open' : 'closed')
            }
            variants={sidebarVariants}
            style={{
                transformStyle: 'preserve-3d',
                perspective: '1000px'
            }}
        >
            {/* Sidebar Background Glow */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: sidebarOpen ? 1 : 0.3 }}
                transition={{ duration: 0.5 }}
            />

            {/* Logo Section with 3D Effect */}
            <motion.div 
                className="p-4 border-b border-gray-700/50 relative"
                whileHover={{
                    scale: 1.02,
                    rotateX: 2,
                    transition: { type: 'spring', stiffness: 400, damping: 20 }
                }}
                style={{ transformStyle: 'preserve-3d' }}
            >
                <motion.div 
                    className="flex items-center gap-3"
                    style={{ transform: 'translateZ(20px)' }}
                >
                    <motion.div
                        whileHover={{
                            rotate: 360,
                            scale: 1.1,
                            transition: { duration: 0.6, type: 'spring' }
                        }}
                    >
                        <Shield className="w-8 h-8 text-blue-400 flex-shrink-0" />
                    </motion.div>
                    
                    <AnimatePresence>
                        {sidebarOpen && (
                            <motion.div
                                className="overflow-hidden whitespace-nowrap"
                                initial="closed"
                                animate="open"
                                exit="closed"
                                variants={textVariants}
                            >
                                <motion.h1 
                                    className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
                                    whileHover={{
                                        scale: 1.05,
                                        transition: { type: 'spring', stiffness: 400 }
                                    }}
                                >
                                    Admin Portal
                                </motion.h1>
                                <motion.p 
                                    className="text-xs text-gray-400"
                                    whileHover={{
                                        color: '#60a5fa',
                                        transition: { duration: 0.2 }
                                    }}
                                >
                                    Placement Cell
                                </motion.p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </motion.div>

            {/* Navigation */}
            <motion.nav 
                className="p-4 space-y-2 overflow-y-auto relative"
                style={{ height: 'calc(100vh - 80px)' }}
            >
                {sidebarItems.map((item) => {
                    const Icon = iconMap[item.icon];
                    const isActive = activeTab === item.id;
                    
                    return (
                        <motion.button
                            key={item.id}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg relative group
                                ${!sidebarOpen && !isMobile ? 'justify-center px-2' : ''}`}
                            onClick={() => {
                                setActiveTab(item.id);
                                if (isMobile) setSidebarOpen(false);
                            }}
                            initial="rest"
                            whileHover="hover"
                            animate={isActive ? 'active' : 'rest'}
                            variants={hover3D}
                            style={{
                                transformStyle: 'preserve-3d',
                                perspective: '800px'
                            }}
                            title={!sidebarOpen && !isMobile ? item.name : ''}
                        >
                            {/* Background Glow on Hover */}
                            <motion.div
                                className={`absolute inset-0 rounded-lg bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-20`}
                                variants={glowVariants}
                                style={{ transform: 'translateZ(-10px)' }}
                            />

                            {/* Active Tab Background with 3D Effect */}
                            {isActive && (
                                <motion.div
                                    className={`absolute inset-0 rounded-lg bg-gradient-to-r ${item.color} opacity-90`}
                                    layoutId="activeTab"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ 
                                        opacity: 0.9, 
                                        scale: 1,
                                        transition: {
                                            type: 'spring',
                                            stiffness: 400,
                                            damping: 20
                                        }
                                    }}
                                    style={{ transform: 'translateZ(-5px)' }}
                                />
                            )}

                            {/* Icon with 3D Animation */}
                            <motion.div
                                className="relative z-10"
                                variants={iconVariants}
                                animate={isActive ? 'active' : 'rest'}
                                style={{ transform: 'translateZ(15px)' }}
                            >
                                <Icon className={`w-5 h-5 flex-shrink-0 ${
                                    isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                                }`} />
                            </motion.div>

                            {/* Text with 3D Animation */}
                            <AnimatePresence>
                                {sidebarOpen && (
                                    <motion.span
                                        className={`whitespace-nowrap relative z-10 text-sm font-medium ${
                                            isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'
                                        }`}
                                        initial="closed"
                                        animate="open"
                                        exit="closed"
                                        variants={textVariants}
                                        style={{ transform: 'translateZ(10px)' }}
                                    >
                                        {item.name}
                                    </motion.span>
                                )}
                            </AnimatePresence>

                            {/* Active Indicator Dot with 3D Effect */}
                            {isActive && (
                                <motion.div
                                    className={`absolute -right-1 w-1.5 h-8 bg-white rounded-full`}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ 
                                        scale: 1, 
                                        opacity: 1,
                                        transition: {
                                            type: 'spring',
                                            stiffness: 400,
                                            damping: 20
                                        }
                                    }}
                                    style={{ transform: 'translateZ(20px)' }}
                                />
                            )}
                        </motion.button>
                    );
                })}

                {/* Logout Button with 3D Effect */}
                <motion.button
                    onClick={() => {
                        setShowLogoutModal(true);
                        if (isMobile) setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-white rounded-lg hover:bg-red-400 transition-all mt-4 text-sm
                        ${!sidebarOpen && !isMobile ? 'justify-center px-2' : ''}`}
                    whileHover={{
                        scale: 1.05,
                        rotateX: 3,
                        rotateY: 5,
                        boxShadow: '0px 8px 20px rgba(239, 68, 68, 0.3)',
                        transition: {
                            type: 'spring',
                            stiffness: 400,
                            damping: 15
                        }
                    }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                        transformStyle: 'preserve-3d',
                        perspective: '800px'
                    }}
                    title={!sidebarOpen && !isMobile ? 'Logout' : ''}
                >
                    <motion.div
                        whileHover={{
                            rotate: -10,
                            scale: 1.1,
                            transition: { type: 'spring', stiffness: 400 }
                        }}
                        style={{ transform: 'translateZ(15px)' }}
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                    </motion.div>
                    
                    <AnimatePresence>
                        {sidebarOpen && (
                            <motion.span
                                className="whitespace-nowrap "
                                initial="closed"
                                animate="open"
                                exit="closed"
                                variants={textVariants}
                                style={{ transform: 'translateZ(10px)' }}
                            >
                                Logout
                            </motion.span>
                        )}
                    </AnimatePresence>
                </motion.button>
            </motion.nav>

            {/* Toggle Button with 3D Effect */}
            {!isMobile && (
                <motion.button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="absolute -right-1 top-24 bg-gray-700 rounded-full p-1 hover:bg-gray-600 transition-colors shadow-lg z-50"
                    whileHover={{
                        scale: 1.2,
                        rotate: 180,
                        boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.4)',
                        transition: {
                            type: 'spring',
                            stiffness: 400,
                            damping: 15
                        }
                    }}
                    whileTap={{ scale: 0.9 }}
                >
                    <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${sidebarOpen ? 'rotate-180' : ''}`} />
                </motion.button>
            )}

            {/* Floating Particles Effect */}
            <motion.div
                className="absolute inset-0 pointer-events-none overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: sidebarOpen ? 0.3 : 0.1 }}
            >
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
                        initial={{
                            x: Math.random() * 200 - 100,
                            y: Math.random() * 400,
                            scale: 0
                        }}
                        animate={{
                            x: Math.random() * 200 - 100,
                            y: Math.random() * 400,
                            scale: [0, 1, 0],
                            transition: {
                                duration: 3 + Math.random() * 4,
                                repeat: Infinity,
                                delay: Math.random() * 3
                            }
                        }}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`
                        }}
                    />
                ))}
            </motion.div>
        </motion.aside>
    );
};

export default Sidebar;


// // src/AdminDashboard/components/Sidebar.jsx

// import React from 'react';
// import { LayoutDashboard, Users, Briefcase, Activity, GraduationCap, Award, BarChart3, LogOut, Shield, ChevronRight, Menu } from 'lucide-react';

// const iconMap = {
//     LayoutDashboard: LayoutDashboard,
//     Users: Users,
//     Briefcase: Briefcase,
//     Award: Award,
//     BarChart3: BarChart3,
//     Activity: Activity,
//     GraduationCap: GraduationCap
// };

// const Sidebar = ({ 
//     sidebarOpen, 
//     setSidebarOpen, 
//     activeTab, 
//     setActiveTab, 
//     isMobile, 
//     setShowLogoutModal 
// }) => {
//     const sidebarItems = [
//         { id: 'overview', name: 'Overview', icon: 'LayoutDashboard' },
//         { id: 'students', name: 'Students', icon: 'Users' },
//         { id: 'drives', name: 'Company Drives', icon: 'Briefcase' },
//         { id: 'placements', name: 'Placements', icon: 'Award' },
//         { id: 'analytics', name: 'Analytics', icon: 'BarChart3' },
//         { id: 'activities' , name: 'Activities' , icon: "Activity" },
//         { id: 'department-stats', name: 'Department Stats', icon: 'GraduationCap' }
//     ];

//     return (
//         <aside className={`fixed top-0 left-0 h-full bg-gradient-to-b from-gray-900 to-gray-800 text-white z-30 transition-all duration-300 ease-in-out
//             ${sidebarOpen ? 'w-64' : 'w-20'} 
//             ${isMobile ? (sidebarOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}`}
//         >
//             <div className="p-4 border-b border-gray-700">
//                 <div className="flex items-center gap-3">
//                     <Shield className="w-8 h-8 text-blue-400 flex-shrink-0" />
//                     {sidebarOpen && (
//                         <div className="overflow-hidden whitespace-nowrap">
//                             <h1 className="text-xl font-bold">Admin Portal</h1>
//                             <p className="text-xs text-gray-400">Placement Cell</p>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             <nav className="p-4 space-y-2 overflow-y-auto" style={{ height: 'calc(100vh - 80px)' }}>
//                 {sidebarItems.map((item) => {
//                     const Icon = iconMap[item.icon];
//                     return (
//                         <button
//                             key={item.id}
//                             onClick={() => {
//                                 setActiveTab(item.id);
//                                 if (isMobile) setSidebarOpen(false);
//                             }}
//                             className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm
//                                 ${activeTab === item.id
//                                     ? 'bg-blue-600 text-white shadow-lg'
//                                     : 'text-gray-300 hover:bg-gray-700'
//                                 }
//                                 ${!sidebarOpen && !isMobile ? 'justify-center px-2' : ''}`}
//                             title={!sidebarOpen && !isMobile ? item.name : ''}
//                         >
//                             <Icon className={`w-5 h-5 flex-shrink-0 ${activeTab === item.id ? 'text-white' : 'text-gray-400'}`} />
//                             {sidebarOpen && <span className="whitespace-nowrap">{item.name}</span>}
//                         </button>
//                     );
//                 })}

//                 <button
//                     onClick={() => {
//                         setShowLogoutModal(true);
//                         if (isMobile) setSidebarOpen(false);
//                     }}
//                     className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-900/20 transition-all mt-4 text-sm
//                         ${!sidebarOpen && !isMobile ? 'justify-center px-2' : ''}`}
//                     title={!sidebarOpen && !isMobile ? 'Logout' : ''}
//                 >
//                     <LogOut className="w-5 h-5 flex-shrink-0" />
//                     {sidebarOpen && <span className="whitespace-nowrap">Logout</span>}
//                 </button>
//             </nav>

//             {!isMobile && (
//                 <button
//                     onClick={() => setSidebarOpen(!sidebarOpen)}
//                     className="absolute -right-3 top-24 bg-gray-700 rounded-full p-1 hover:bg-gray-600 transition-colors shadow-lg z-50"
//                 >
//                     <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${sidebarOpen ? 'rotate-180' : ''}`} />
//                 </button>
//             )}
//         </aside>
//     );
// };

// export default Sidebar;