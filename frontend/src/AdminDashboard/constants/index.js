
export const sidebarItems = [
    { id: 'overview', name: 'Overview', icon: 'LayoutDashboard' },
    { id: 'students', name: 'Students', icon: 'Users' },
    { id: 'drives', name: 'Company Drives', icon: 'Briefcase' },
    { id: 'placements', name: 'Placements', icon: 'Award' },
    { id: 'activities', name: 'Activities', icon: 'Activity' },
    { id: 'department-stats', name: 'Department Stats', icon: 'GraduationCap' },
];

export const tabMessages = {
    overview: { message: "📊 Welcome to the Overview Dashboard!", type: "info", duration: 3000 },
    students: { message: "👥 Manage Students - View and manage student records.", type: "info", duration: 3000 },
    drives: { message: "🚀 Manage Company Drives - Create and manage placement drives.", type: "info", duration: 3000 },
    placements: { message: "🎯 Manage Placements - View and manage placement records.", type: "info", duration: 3000 },
    activities: { message: "📋 Recent Activities - View all recent admin activities.", type: "info", duration: 3000 },
    'department-stats': { message: "📊 Department Statistics - View placement stats by department.", type: "info", duration: 3000 },
    'yearly-placements': { message: "📈 Yearly Placements - Manage yearly placement statistics.", type: "info", duration: 3000 }
};

// export const placementTrendData = {
//     labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
//     datasets: [
//         {
//             label: 'Students Placed',
//             data: [12, 19, 15, 25, 32, 45, 52, 48, 60, 72, 85, 95],
//             borderColor: 'rgb(59, 130, 246)',
//             backgroundColor: 'rgba(59, 130, 246, 0.1)',
//             fill: true,
//             tension: 0.4
//         }
//     ]
// };

// export const departmentWiseData = {
//     labels: ['CSE', 'ECE', 'Mech', 'Civil', 'EEE', 'IT'],
//     datasets: [{
//         label: 'Students Placed',
//         data: [45, 32, 28, 15, 22, 38],
//         backgroundColor: [
//             'rgba(59, 130, 246, 0.8)',
//             'rgba(34, 197, 94, 0.8)',
//             'rgba(168, 85, 247, 0.8)',
//             'rgba(249, 115, 22, 0.8)',
//             'rgba(236, 72, 153, 0.8)',
//             'rgba(20, 184, 166, 0.8)'
//         ]
//     }]
// };