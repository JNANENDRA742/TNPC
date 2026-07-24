// src/AdminDashboard/components/RecentActivities.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, UserPlus, Award, Briefcase, CheckCircle } from 'lucide-react';

const RecentActivities = ({ activities, onRefresh }) => {
    const getTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60,
            second: 1
        };

        for (const [unit, secondsInUnit] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / secondsInUnit);
            if (interval >= 1) {
                return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
            }
        }
        return 'Just now';
    };

    const getActivityIcon = (type) => {
        const iconProps = { className: 'w-4 h-4' };
        switch (type) {
            case 'student_registered':
                return <UserPlus className="text-blue-600 w-4 h-4" />;
            case 'placement_added':
                return <Award className="text-green-600 w-4 h-4" />;
            case 'drive_added':
                return <Briefcase className="text-purple-600 w-4 h-4" />;
            default:
                return <CheckCircle className="text-gray-600 w-4 h-4" />;
        }
    };

    const getActivityBgColor = (type) => {
        switch (type) {
            case 'student_registered':
                return 'bg-blue-100';
            case 'placement_added':
                return 'bg-green-100';
            case 'drive_added':
                return 'bg-purple-100';
            default:
                return 'bg-gray-100';
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4">
                <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800">Recent Activities</h3>
                <button
                    onClick={onRefresh}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                    Refresh
                </button>
            </div>

            {activities.length === 0 ? (
                <div className="text-center py-6 sm:py-8 text-gray-500">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                        <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                    </div>
                    <p className="text-sm">No recent activities</p>
                    <p className="text-xs mt-1">Activities will appear here when students register or placements are added</p>
                </div>
            ) : (
                <div className="space-y-2 sm:space-y-3 max-h-80 sm:max-h-96 overflow-y-auto">
                    {activities.map((activity) => (
                        <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-start gap-2 sm:gap-3 py-2 sm:py-3 border-b last:border-0 hover:bg-gray-50 rounded-lg transition-colors px-2"
                        >
                            <div className={`w-8 h-8 sm:w-10 sm:h-10 ${getActivityBgColor(activity.type)} rounded-full flex items-center justify-center flex-shrink-0`}>
                                {getActivityIcon(activity.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
                                    <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                                        {activity.title}
                                    </p>
                                    <span className="text-xs text-gray-400 whitespace-nowrap">
                                        {getTimeAgo(activity.timestamp)}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-0.5 break-words">
                                    {activity.description}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {activity.timestamp.toLocaleDateString()} at {activity.timestamp.toLocaleTimeString()}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecentActivities;