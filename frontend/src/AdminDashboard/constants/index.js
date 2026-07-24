
export const sidebarItems = [
    { id: 'overview', name: 'Overview', icon: 'LayoutDashboard' },
    { id: 'students', name: 'Students', icon: 'Users' },
    { id: 'drives', name: 'Company Drives', icon: 'Briefcase' },
    { id: 'placements', name: 'Placements', icon: 'Award' },
    { id: 'activities', name: 'Activities', icon: 'Activity' },
    { id: 'department-stats', name: 'Department Stats', icon: 'GraduationCap' },
];

export const tabMessages = {
    overview: {
        message: '📊 Welcome to Overview! View key statistics, placement trends, and recent activities at a glance.',
        type: 'success',
        duration: 3500
    },
    students: {
        message: '👨‍🎓 Student Management: Add new students, edit profiles, or remove student accounts.',
        type: 'info',
        duration: 3500
    },
    drives: {
        message: '🚀 Company Drives: Create new placement drives, update existing ones, and track drive status.',
        type: 'info',
        duration: 3500
    },
    placements: {
        message: '💼 Placement Records: View and manage student placements. Track placement statistics.',
        type: 'success',
        duration: 3500
    },
    activities: {
        message: '📋 Activity Log: View all recent activities across the platform with filtering and search options.',
        type: 'info',
        duration: 3500
    },
    'department-stats': {
        message: '📊 Department Statistics: View student distribution across all departments with detailed breakdowns.',
        type: 'success',
        duration: 3500
    },

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