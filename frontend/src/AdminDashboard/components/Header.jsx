// src/AdminDashboard/components/Header.jsx

import React from 'react';
import { Menu } from 'lucide-react';

const Header = ({ sidebarOpen, setSidebarOpen, user, activeTab, sidebarItems }) => {
    const currentTab = sidebarItems.find(item => item.id === activeTab);

    return (
        <header className="bg-white shadow-sm sticky top-0 z-20">
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex items-center gap-2 sm:gap-4">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <h2 className="text-base sm:text-lg font-semibold text-gray-800 hidden sm:block">
                        {currentTab?.name || 'Dashboard'}
                    </h2>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="text-right xs:block">
                            <p className="text-sm font-medium">{user.name || 'Admin User'}</p>
                            <p className="text-xs text-gray-500">Placement Officer</p>
                        </div>
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;