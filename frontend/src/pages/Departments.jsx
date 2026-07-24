import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useAlert } from '../components/Alert';
import { BarChart, Bar, Tooltip, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts';
import { LuBuilding, LuRefreshCw, LuPlus, LuBell, LuMail, LuMessageSquare } from 'react-icons/lu';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingAnimation from '../components/LoadingAnimation';
import { Building, Building2 } from 'lucide-react';

const Departments = () => {

    const { showAlert, AlertComponent } = useAlert();

    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeDept, setActiveDept] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [showNotification, setShowNotification] = useState(false);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/departments`);
                setDepartments(res.data);
                setLoading(false);
                showAlert(
                    <div className='flex items-center gap-2'>
                        Welcome to our Departments Page! <LuBuilding className="w-4 h-4" />
                    </div>,
                    "success",
                    4000
                );
            }
            catch (err) {
                console.log(err);
                setLoading(false);
                showAlert('Failed to load departments data', 'error', 4000);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 sm:h-20 w-16 sm:w-20 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Building2 className="w-6 sm:w-8 h-6 sm:h-8 text-blue-600 animate-pulse" />
                        </div>
                    </div>
                    <p className="mt-4 sm:mt-6 text-base sm:text-lg font-semibold text-gray-700">Loading Departments Page ...</p>
                    <p className="text-xs sm:text-sm text-gray-400 mt-1">Please wait a moment . . .</p>
                </div>
            </div>
        );
    }

    if (departments.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-2xl w-full"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 relative overflow-hidden"
                    >
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50"
                            animate={{
                                scale: [1, 1.05, 1],
                                rotate: [0, 1, -1, 0],
                            }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />

                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            {[...Array(6)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
                                    animate={{
                                        y: [0, -100, 0],
                                        x: [0, Math.random() * 50 - 25, 0],
                                        opacity: [0, 1, 0],
                                    }}
                                    transition={{
                                        duration: 4 + Math.random() * 3,
                                        repeat: Infinity,
                                        delay: i * 0.8,
                                        ease: "easeInOut",
                                    }}
                                    style={{
                                        top: `${20 + i * 12}%`,
                                        left: `${10 + i * 15}%`,
                                    }}
                                />
                            ))}
                        </div>

                        <div className="relative">
                            <motion.div
                                className="flex justify-center mb-4 sm:mb-6"
                                whileHover={{ scale: 1.1 }}
                                onHoverStart={() => setIsHovered(true)}
                                onHoverEnd={() => setIsHovered(false)}
                            >
                                <div className="relative">
                                    <motion.div
                                        className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/30"
                                        animate={{
                                            rotate: isHovered ? [0, -5, 5, -5, 0] : 0,
                                        }}
                                        transition={{
                                            duration: 0.5,
                                        }}
                                    >
                                        <LuBuilding className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                                    </motion.div>

                                    <motion.div
                                        className="absolute inset-0 rounded-2xl border-2 border-blue-400/20"
                                        animate={{
                                            scale: [1, 1.2, 1],
                                            opacity: [0.5, 0, 0.5],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        }}
                                    />

                                    <motion.div
                                        className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1 shadow-lg"
                                        animate={{
                                            scale: [1, 1.2, 1],
                                            rotate: [0, 90, 0],
                                        }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        }}
                                    >
                                        <LuPlus className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                    </motion.div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-center"
                            >
                                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                                    No Departments Found
                                </h2>
                                <p className="text-sm sm:text-base text-gray-500">
                                    It looks like there are no departments available right now.
                                </p>
                            </motion.div>

                            <motion.div
                                className="flex justify-center gap-1 mt-2"
                                animate={{
                                    opacity: [0.3, 1, 0.3],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            >
                                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="mt-6 sm:mt-8 grid gap-3"
                            >
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => window.location.reload()}
                                    className="flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition-all duration-300 group"
                                >
                                    <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                                        <LuRefreshCw className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 group-hover:rotate-180 transition-transform duration-500" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs sm:text-sm font-semibold text-gray-800">Refresh Page</p>
                                        <p className="text-[10px] sm:text-xs text-gray-500">Try loading again</p>
                                    </div>
                                </motion.button>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-xl border border-gray-200"
                            >
                                <p className="text-[10px] sm:text-xs text-gray-500 text-center">
                                    💡 <span className="font-medium">Tip:</span> Departments are usually added during the
                                    beginning of each academic year. Check back later!
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        );
    }

    const dept = departments[activeDept];
    const placementPerc = dept?.totalStudents
        ? Math.round((dept.placed / dept.totalStudents) * 100)
        : 0;

    return (
        <section className='min-h-screen w-full p-3 sm:p-5 md:p-10 bg-gray-100'>
            {AlertComponent}

            {/* title container */}
            <div className='container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 bg-[#024a70] text-white rounded-lg shadow-lg mb-4 sm:mb-6 md:mb-10'>
                <h1 className='text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2'>Departments Statistics</h1>
                <p className='text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed'>Placement performance across all engineering departments.</p>
            </div>

            {/* Department Tabs */}
            <div className='container mx-auto pt-3 sm:pt-4 md:pt-6 overflow-x-auto'>
                <div className='flex flex-nowrap sm:flex-wrap gap-2 sm:gap-3 md:gap-4 min-w-max sm:min-w-0'>
                    {departments.map((dep, index) => (
                        <button
                            key={dep.code}
                            onClick={() => setActiveDept(index)}
                            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                                activeDept === index
                                    ? "bg-[#024a70] text-white shadow-lg shadow-cyan-950"
                                    : "bg-white text-[#024a70] shadow-lg shadow-gray-300 hover:bg-gray-200"
                            }`}
                        >
                            {dep.code}
                        </button>
                    ))}
                </div>
            </div>

            {/* departments container */}
            <section className='container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 my-4 sm:m-6 md:m-10 bg-white rounded-lg shadow-lg'>
                {/* mini data representation */}
                <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 shadow-lg shadow-gray-300 mb-6 sm:mb-8 md:mb-10 p-3 sm:p-4 md:p-6 rounded-lg'>
                    <div className='bg-blue-100 shadow-md shadow-gray-300 p-2 sm:p-3 md:p-4 rounded-lg'>
                        <p className='text-[10px] sm:text-xs md:text-sm ml-1 sm:ml-2 md:ml-4 mt-1 sm:mt-2'>Total Students :</p>
                        <p className='text-base sm:text-lg md:text-xl font-bold text-center'>{dept.totalStudents}</p>
                    </div>
                    <div className='bg-blue-100 shadow-md shadow-gray-300 p-2 sm:p-3 md:p-4 rounded-lg'>
                        <p className='text-[10px] sm:text-xs md:text-sm ml-1 sm:ml-2 md:ml-4 mt-1 sm:mt-2'>Placed Students :</p>
                        <p className='text-base sm:text-lg md:text-xl font-bold text-center'>{dept.placed}</p>
                    </div>
                    <div className='bg-blue-100 shadow-md shadow-gray-300 p-2 sm:p-3 md:p-4 rounded-lg'>
                        <p className='text-[10px] sm:text-xs md:text-sm ml-1 sm:ml-2 md:ml-4 mt-1 sm:mt-2'>Avg Package :</p>
                        <p className='text-base sm:text-lg md:text-xl font-bold text-center'>₹ {dept.avgPackage}</p>
                    </div>
                    <div className='bg-blue-100 shadow-md shadow-gray-300 p-2 sm:p-3 md:p-4 rounded-lg'>
                        <p className='text-[10px] sm:text-xs md:text-sm ml-1 sm:ml-2 md:ml-4 mt-1 sm:mt-2'>Highest Package :</p>
                        <p className='text-base sm:text-lg md:text-xl font-bold text-center'>₹ {dept.highestPackage}</p>
                    </div>
                </div>

                {/* status bar */}
                <div className='w-full bg-gray-200 rounded-full h-4 sm:h-5 md:h-6 mb-6 sm:mb-8 md:mb-10'>
                    <div
                        className='bg-[#024a70] h-4 sm:h-5 md:h-6 rounded-full text-center text-white font-medium text-xs sm:text-sm transition-all duration-1000 flex items-center justify-center'
                        style={{ width: `${placementPerc}%` }}
                    >
                        <span className="hidden xs:inline-block">{placementPerc}%</span>
                    </div>
                </div>

                {/* our Top Recruiters */}
                <div className='mb-6 sm:mb-8 md:mb-10'>
                    <h3 className="text-base sm:text-lg md:text-xl font-display font-bold mb-2 sm:mb-3 md:mb-4">Top Recruiters — {dept.code}</h3>
                    <div className='flex flex-wrap gap-1.5 sm:gap-2'>
                        {dept?.topRecruiters?.map((company, index) => (
                            <span key={index} className='bg-[#024a70] text-white px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-lg shadow-md shadow-gray-300 text-xs sm:text-sm'>
                                {company}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* bar chart */}
            <div className='container mx-auto bg-blue-100 rounded-lg shadow-lg p-3 sm:p-4 md:p-6'>
                <h3 className="text-base sm:text-lg md:text-xl font-display font-bold mb-2 sm:mb-3 md:mb-4">Year-wise Placement Trend — {dept.code}</h3>
                <div className='w-full h-[200px] sm:h-[250px] md:h-[300px]'>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dept?.yearWise || []} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                                dataKey="year" 
                                tick={{ fontSize: 10, sm: 12 }}
                                interval={0}
                            />
                            <YAxis 
                                tick={{ fontSize: 10, sm: 12 }}
                                width={30}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: 8 }}
                                formatter={(value) => [`${value} students`, "Placed"]}
                            />
                            <Bar
                                dataKey="placed"
                                fill="hsl(215, 65%, 18%)"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </section>
    )
}

export default Departments;