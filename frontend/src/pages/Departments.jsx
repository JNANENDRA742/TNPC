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

    // Loading State with Enhanced Animation
    //     if (loading) {
    //     return (
    //       <div className="flex items-center justify-center min-h-[400px]">
    //         <div className="text-center">
    //           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
    //           <p className="mt-4 text-gray-500">Loading department statistics please wait...</p>
    //         </div>
    //       </div>
    //     );
    //   }
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Building2 className="w-8 h-8 text-blue-600 animate-pulse" />
                        </div>
                    </div>
                    <p className="mt-6 text-lg font-semibold text-gray-700">Loading Departments Page ...</p>
                    <p className="text-sm text-gray-400 mt-1">Please wait a moment . . .</p>
                </div>
            </div>
        );
    }

    // Enhanced Empty State
    if (departments.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-2xl w-full"
                >
                    {/* Main Card */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 relative overflow-hidden"
                    >
                        {/* Animated background gradient */}
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

                        {/* Floating particles */}
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
                            {/* Icon with animation */}
                            <motion.div
                                className="flex justify-center mb-6"
                                whileHover={{ scale: 1.1 }}
                                onHoverStart={() => setIsHovered(true)}
                                onHoverEnd={() => setIsHovered(false)}
                            >
                                <div className="relative">
                                    <motion.div
                                        className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/30"
                                        animate={{
                                            rotate: isHovered ? [0, -5, 5, -5, 0] : 0,
                                        }}
                                        transition={{
                                            duration: 0.5,
                                        }}
                                    >
                                        <LuBuilding className="w-12 h-12 text-white" />
                                    </motion.div>

                                    {/* Animated circle ring */}
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

                                    {/* Plus icon floating */}
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
                                        <LuPlus className="w-4 h-4 text-white" />
                                    </motion.div>
                                </div>
                            </motion.div>

                            {/* Title with typing animation */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-center"
                            >
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                                    No Departments Found
                                </h2>
                                <p className="text-gray-500 text-sm md:text-base">
                                    It looks like there are no departments available right now.
                                </p>
                            </motion.div>

                            {/* Animated dots under text */}
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

                            {/* Suggestions Grid */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="mt-8 grid  gap-3"
                            >
                                {/* Retry Button */}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => window.location.reload()}
                                    className="flex items-center gap-3 px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition-all duration-300 group"
                                >
                                    <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                                        <LuRefreshCw className="w-5 h-5 text-blue-600 group-hover:rotate-180 transition-transform duration-500" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-semibold text-gray-800">Refresh Page</p>
                                        <p className="text-xs text-gray-500">Try loading again</p>
                                    </div>
                                </motion.button>



                            </motion.div>

                            {/* Helpful Tip */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200"
                            >
                                <p className="text-xs text-gray-500 text-center">
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
        <section className='min-h-screen w-full p-10 bg-gray-100'>
            {AlertComponent}

            {/* title container */}
            <div className='container mx-auto px-4 py-8 bg-[#024a70] text-white rounded-lg shadow-lg mb-10'>
                <h1 className='text-3xl font-bold mb-2'>Departments Statistics</h1>
                <p className='text-lg text-gray-300 leading-relaxed'>Placement performance across all engineering departments.</p>
            </div>

            <div className='container mx-auto pt-6'>
                <div className='flex flex-wrap gap-4'>
                    {departments.map((dep, index) => (
                        <button
                            key={dep.code}
                            onClick={() => setActiveDept(index)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeDept === index
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
            <section className='container mx-auto px-4 py-8 m-10 bg-white rounded-lg shadow-lg'>
                {/* mini data representation */}
                <div className='grid sm:grid-cols-2 md:grid-cols-4 sma:gap-2 md:gap-4 shadow-lg shadow-gray-300 mb-10 p-6 rounded-lg'>
                    <div className='bg-blue-100 shadow-md shadow-gray-300 sm:p-2 md:p-4 rounded-lg'>
                        <p className='text-sm ml-4 mt-2'>Total Students : </p>
                        <p className='text-lg font-bold text-center'>{dept.totalStudents}</p>
                    </div>
                    <div className='bg-blue-100 shadow-md shadow-gray-300 sm:p-2 md:p-4 rounded-lg'>
                        <p className='text-sm ml-4 mt-2'>Placed Students : </p>
                        <p className='text-lg font-bold text-center'>{dept.placed}</p>
                    </div>
                    <div className='bg-blue-100 shadow-md shadow-gray-300 sm:p-2 md:p-4 rounded-lg'>
                        <p className='text-sm ml-4 mt-2'>Average Package : </p>
                        <p className='text-lg font-bold text-center'>₹ {dept.avgPackage}</p>
                    </div>
                    <div className='bg-blue-100 shadow-md shadow-gray-300 sm:p-2 md:p-4 rounded-lg'>
                        <p className='text-sm ml-4 mt-2'>Highest Package : </p>
                        <p className='text-lg font-bold text-center'>₹ {dept.highestPackage}</p>
                    </div>
                </div>

                {/* status bar */}
                <div className='w-full bg-gray-200 rounded-full h-6 mb-10'>
                    <div
                        className='bg-[#024a70] h-6 rounded-full text-center text-white font-medium transition-all duration-1000'
                        style={{ width: `${placementPerc}%` }}
                    >
                        {placementPerc}%
                    </div>
                </div>

                {/* our Top Recruiters */}
                <div className='mb-10'>
                    <h3 className="text-lg font-display font-bold mb-4">Top Recruiters — {dept.code}</h3>
                    <div className='flex flex-wrap gap-2'>
                        {dept?.topRecruiters?.map((company, index) => (
                            <span key={index} className='bg-[#024a70] text-white px-4 py-2 rounded-lg shadow-md shadow-gray-300'>
                                {company}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* bar chart */}
            <div className='bg-blue-100 rounded-lg shadow-lg p-6'>
                <h3 className="text-lg font-display font-bold mb-4">Year-wise Placement Trend — {dept.code}</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dept?.yearWise || []} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
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
        </section>
    )
}

export default Departments;