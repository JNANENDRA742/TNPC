// src/AdminDashboard/components/StatsCards.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Briefcase, Calendar, Award, TrendingUp, DollarSign } from 'lucide-react';

const StatsCards = ({ stats }) => {
    const cards = [
        {
            title: 'Total Students',
            value: stats.totalStudents,
            icon: Users,
            bgColor: 'bg-blue-100',
            iconColor: 'text-blue-600',
            hoverBg: 'hover:bg-blue-50',
            borderColor: 'hover:border-blue-200'
        },
        {
            title: 'Company Drives',
            value: stats.totalDrives,
            icon: Briefcase,
            bgColor: 'bg-green-100',
            iconColor: 'text-green-600',
            hoverBg: 'hover:bg-green-50',
            borderColor: 'hover:border-green-200'
        },
        {
            title: 'Active Drives',
            value: stats.activeDrives,
            icon: Calendar,
            bgColor: 'bg-orange-100',
            iconColor: 'text-orange-600',
            hoverBg: 'hover:bg-orange-50',
            borderColor: 'hover:border-orange-200'
        },
        {
            title: 'Students Placed',
            value: stats.totalPlacements,
            icon: Award,
            bgColor: 'bg-purple-100',
            iconColor: 'text-purple-600',
            hoverBg: 'hover:bg-purple-50',
            borderColor: 'hover:border-purple-200'
        },
        {
            title: 'Placement Rate',
            value: `${stats.placementRate}%`,
            icon: TrendingUp,
            bgColor: 'bg-emerald-100',
            iconColor: 'text-emerald-600',
            hoverBg: 'hover:bg-emerald-50',
            borderColor: 'hover:border-emerald-200'
        },
        {
            title: 'Avg Package',
            value: `${stats.avgPackage} LPA`,
            icon: DollarSign,
            bgColor: 'bg-amber-100',
            iconColor: 'text-amber-600',
            hoverBg: 'hover:bg-amber-50',
            borderColor: 'hover:border-amber-200'
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 25
            }
        }
    };

    return (
        <motion.div 
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 mb-4 sm:mb-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {cards.map((card, index) => {
                const Icon = card.icon;
                return (
                    <motion.div
                        key={index}
                        variants={cardVariants}
                        whileHover={{ 
                            scale: 1.03,
                            y: -4,
                            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                        }}
                        whileTap={{ scale: 0.97 }}
                        className={`bg-white rounded-xl shadow-sm p-3 sm:p-4 border border-gray-100 transition-all duration-300 cursor-pointer ${card.hoverBg} ${card.borderColor}`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-[10px] sm:text-xs lg:text-sm font-medium">
                                    {card.title}
                                </p>
                                <motion.p 
                                    className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mt-1"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                >
                                    {card.value}
                                </motion.p>
                            </div>
                            <motion.div 
                                className={`${card.bgColor} p-2 sm:p-3 rounded-full`}
                                whileHover={{ 
                                    scale: 1.1,
                                    rotate: 5,
                                }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${card.iconColor}`} />
                            </motion.div>
                        </div>
                    </motion.div>
                );
            })}
        </motion.div>
    );
};

export default StatsCards;