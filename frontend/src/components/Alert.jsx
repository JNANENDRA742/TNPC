// components/SimpleAlert.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, XCircle, AlertTriangle, Info, X, 
  Bell, Sparkles, Clock, Award, Star, Zap 
} from 'lucide-react';

// Enhanced Alert configurations with gradients and animations
const ALERT_TYPES = {
  success: {
    icon: CheckCircle,
    gradient: 'from-emerald-500 to-teal-500',
    bgGradient: 'from-emerald-50 to-teal-50',
    borderColor: 'border-emerald-400',
    textColor: 'text-emerald-800',
    iconColor: 'text-emerald-500',
    titleColor: 'text-emerald-800',
    shadowColor: 'shadow-emerald-500/20',
    ringColor: 'ring-emerald-400',
    bgColor: 'bg-white',
  },
  error: {
    icon: XCircle,
    gradient: 'from-rose-500 to-red-500',
    bgGradient: 'from-rose-50 to-red-50',
    borderColor: 'border-rose-400',
    textColor: 'text-rose-800',
    iconColor: 'text-rose-500',
    titleColor: 'text-rose-800',
    shadowColor: 'shadow-rose-500/20',
    ringColor: 'ring-rose-400',
    bgColor: 'bg-white',
  },
  warning: {
    icon: AlertTriangle,
    gradient: 'from-amber-500 to-orange-500',
    bgGradient: 'from-amber-50 to-orange-50',
    borderColor: 'border-amber-400',
    textColor: 'text-amber-800',
    iconColor: 'text-amber-500',
    titleColor: 'text-amber-800',
    shadowColor: 'shadow-amber-500/20',
    ringColor: 'ring-amber-400',
    bgColor: 'bg-white',
  },
  info: {
    icon: Info,
    gradient: 'from-blue-500 to-indigo-500',
    bgGradient: 'from-blue-50 to-indigo-50',
    borderColor: 'border-blue-400',
    textColor: 'text-blue-800',
    iconColor: 'text-blue-500',
    titleColor: 'text-blue-800',
    shadowColor: 'shadow-blue-500/20',
    ringColor: 'ring-blue-400',
    bgColor: 'bg-white',
  },
  premium: {
    icon: Sparkles,
    gradient: 'from-purple-500 to-pink-500',
    bgGradient: 'from-purple-50 to-pink-50',
    borderColor: 'border-purple-400',
    textColor: 'text-purple-800',
    iconColor: 'text-purple-500',
    titleColor: 'text-purple-800',
    shadowColor: 'shadow-purple-500/20',
    ringColor: 'ring-purple-400',
    bgColor: 'bg-white',
  }
};

// Individual Alert Component
const Alert = ({ 
  message, 
  type = 'info', 
  onClose, 
  duration = 3000,
  showIcon = true,
  className = '',
  position = 'bottom-right', // Changed to bottom-right by default
  title = '',
}) => {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (duration > 0) {
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
        setProgress(remaining);
        if (remaining === 0) {
          clearInterval(interval);
        }
      }, 50);

      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) {
          setTimeout(onClose, 400);
        }
      }, duration);
      
      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    }
  }, [duration, onClose]);

  if (!visible) return null;

  const config = ALERT_TYPES[type] || ALERT_TYPES.info;
  const Icon = config.icon;

  // Position classes
  const positionClasses = {
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-center': 'top-6 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2',
  };

  // Animation variants based on position
  const getAnimationVariants = (pos) => {
    const variants = {
      'top-right': { initial: { opacity: 0, x: 50, y: -30, scale: 0.9 }, animate: { opacity: 1, x: 0, y: 0, scale: 1 }, exit: { opacity: 0, x: 50, y: -30, scale: 0.9 } },
      'top-left': { initial: { opacity: 0, x: -50, y: -30, scale: 0.9 }, animate: { opacity: 1, x: 0, y: 0, scale: 1 }, exit: { opacity: 0, x: -50, y: -30, scale: 0.9 } },
      'bottom-right': { initial: { opacity: 0, x: 50, y: 30, scale: 0.9 }, animate: { opacity: 1, x: 0, y: 0, scale: 1 }, exit: { opacity: 0, x: 50, y: 30, scale: 0.9 } },
      'bottom-left': { initial: { opacity: 0, x: -50, y: 30, scale: 0.9 }, animate: { opacity: 1, x: 0, y: 0, scale: 1 }, exit: { opacity: 0, x: -50, y: 30, scale: 0.9 } },
      'top-center': { initial: { opacity: 0, y: -50, scale: 0.9 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -50, scale: 0.9 } },
      'bottom-center': { initial: { opacity: 0, y: 50, scale: 0.9 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 50, scale: 0.9 } },
    };
    return variants[pos] || variants['bottom-right'];
  };

  const animation = getAnimationVariants(position);

  return (
    <motion.div
      initial={animation.initial}
      animate={animation.animate}
      exit={animation.exit}
      transition={{ 
        duration: 0.3, 
        type: "spring", 
        stiffness: 300, 
        damping: 20 
      }}
      className={`fixed ${positionClasses[position] || positionClasses['bottom-right']} z-50 max-w-md w-full ${className}`}
    >
      <div className={`
        relative overflow-hidden rounded-2xl shadow-2xl backdrop-blur-sm
        bg-gradient-to-br ${config.bgGradient}
        border ${config.borderColor}
        ${config.shadowColor} shadow-lg
        ring-1 ${config.ringColor} ring-opacity-30
      `}>
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: '-100%' }}
          animate={{ x: '200%' }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />

        {/* Progress bar */}
        {duration > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200/50">
            <motion.div
              className={`h-full bg-gradient-to-r ${config.gradient}`}
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: duration / 1000, ease: "linear" }}
            />
          </div>
        )}

        <div className="relative p-4 flex items-start gap-3">
          {/* Icon with pulsing animation */}
          {showIcon && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="flex-shrink-0"
            >
              <div className={`
                w-10 h-10 rounded-xl flex items-center justify-center
                bg-gradient-to-br ${config.gradient} shadow-lg
                ${config.shadowColor}
              `}>
                <Icon className="w-5 h-5 text-white" />
              </div>
            </motion.div>
          )}
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            {title && (
              <motion.h4 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className={`text-sm font-bold ${config.titleColor} mb-0.5`}
              >
                {title}
              </motion.h4>
            )}
            <motion.p 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className={`text-sm font-medium ${config.textColor} leading-relaxed`}
            >
              {message}
            </motion.p>
          </div>
          
          {/* Close Button */}
          {onClose && (
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setVisible(false);
                setTimeout(onClose, 300);
              }}
              className="flex-shrink-0 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-200/50 transition-colors"
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </div>

        {/* Decorative dots */}
        <div className="absolute top-2 right-2 flex gap-1 opacity-30">
          <div className="w-1 h-1 rounded-full bg-current"></div>
          <div className="w-1 h-1 rounded-full bg-current"></div>
          <div className="w-1 h-1 rounded-full bg-current"></div>
        </div>
      </div>
    </motion.div>
  );
};

// Enhanced useAlert hook with more features - default position bottom-right
export const useAlert = () => {
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type = 'info', duration = 3000, title = '', position = 'bottom-right') => {
    setAlert({ message, type, duration, title, position });
  };

  const hideAlert = () => {
    setAlert(null);
  };

  // Predefined alert types for convenience - all default to bottom-right
  const showSuccess = (message, duration = 3000, position = 'bottom-right') => 
    showAlert(message, 'success', duration, '✅ Success!', position);
  const showError = (message, duration = 4000, position = 'bottom-right') => 
    showAlert(message, 'error', duration, '❌ Error!', position);
  const showWarning = (message, duration = 3500, position = 'bottom-right') => 
    showAlert(message, 'warning', duration, '⚠️ Warning', position);
  const showInfo = (message, duration = 3000, position = 'bottom-right') => 
    showAlert(message, 'info', duration, 'ℹ️ Information', position);
  const showPremium = (message, duration = 3000, position = 'bottom-right') => 
    showAlert(message, 'premium', duration, '✨ Premium', position);

  const AlertComponent = alert ? (
    <Alert
      message={alert.message}
      type={alert.type}
      duration={alert.duration}
      title={alert.title}
      position={alert.position || 'bottom-right'}
      onClose={hideAlert}
    />
  ) : null;

  return {
    showAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showPremium,
    hideAlert,
    AlertComponent,
  };
};

// Toast queue system for multiple alerts - bottom-right by default
export const useAlertQueue = () => {
  const [alerts, setAlerts] = useState([]);

  const showAlert = (message, type = 'info', duration = 3000, title = '', position = 'bottom-right') => {
    const id = Date.now() + Math.random();
    setAlerts(prev => [...prev, { id, message, type, duration, title, position }]);

    setTimeout(() => {
      setAlerts(prev => prev.filter(alert => alert.id !== id));
    }, duration + 300);
  };

  const showSuccess = (message, duration = 3000, position = 'bottom-right') => 
    showAlert(message, 'success', duration, '✅ Success!', position);
  const showError = (message, duration = 4000, position = 'bottom-right') => 
    showAlert(message, 'error', duration, '❌ Error!', position);
  const showWarning = (message, duration = 3500, position = 'bottom-right') => 
    showAlert(message, 'warning', duration, '⚠️ Warning', position);
  const showInfo = (message, duration = 3000, position = 'bottom-right') => 
    showAlert(message, 'info', duration, 'ℹ️ Information', position);

  const AlertContainer = () => (
    <div className="fixed bottom-4 right-4 z-50 space-y-3 max-w-md w-full pointer-events-none">
      <AnimatePresence>
        {alerts.map((alert, index) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            transition={{ delay: index * 0.1 }}
            className="pointer-events-auto"
          >
            <Alert
              message={alert.message}
              type={alert.type}
              duration={alert.duration}
              title={alert.title}
              position={alert.position || 'bottom-right'}
              onClose={() => setAlerts(prev => prev.filter(a => a.id !== alert.id))}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );

  return { showAlert, showSuccess, showError, showWarning, showInfo, AlertContainer };
};

// Floating alert button component (optional)
export const AlertButton = ({ children, message, type = 'info', duration = 3000, position = 'bottom-right', ...props }) => {
  const { showAlert } = useAlert();
  
  return (
    <button
      onClick={() => showAlert(message, type, duration, '', position)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Alert;