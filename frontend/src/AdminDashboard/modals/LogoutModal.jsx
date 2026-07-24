// src/AdminDashboard/modals/LogoutModal.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { LogOut as LogOutIcon } from 'lucide-react';

const LogoutModal = ({ onClose, onConfirm }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-3 sm:mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative">
                    <div className="absolute -top-10 sm:-top-12 left-1/2 transform -translate-x-1/2">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-red-100 rounded-full flex items-center justify-center">
                            <LogOutIcon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-red-600" />
                        </div>
                    </div>
                    <div className="pt-12 sm:pt-14 md:pt-16 pb-4 sm:pb-6 px-4 sm:px-6 text-center">
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2">Confirm Logout</h3>
                        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                            Are you sure you want to logout from the Admin Portal?
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-2.5 sm:py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium text-sm sm:text-base order-2 sm:order-1"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onConfirm}
                                className="flex-1 px-4 py-2.5 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium flex items-center justify-center gap-2 text-sm sm:text-base order-1 sm:order-2"
                            >
                                <LogOutIcon className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default LogoutModal;