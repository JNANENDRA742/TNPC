import React, { useState, useEffect } from "react";
import {
    Mail,
    Lock,
    ArrowLeft,
    CheckCircle,
    X,
    Shield,
    Key,
    Send,
    User,
    AlertCircle,
    Sparkles,
    Fingerprint,
    Eye,
    UserPlus
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useAlert } from '../components/Alert';
import { MdEmail } from "react-icons/md";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const { showAlert, AlertComponent } = useAlert();

    // States
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Reset Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [resetToken, setResetToken] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [timer, setTimer] = useState(0);
    const [errors, setErrors] = useState({});
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [userEmail, setUserEmail] = useState('');

    // Timer for OTP resend
    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    // Handle OTP input change
    const handleOtpChange = (index, value) => {
        if (value.length > 1) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    // Handle OTP key down (backspace)
    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    // Step 1: Send OTP
    const handleSendOTP = async (e) => {
        e.preventDefault();
        
        if (!email) {
            showAlert('Please enter your email address', 'warning');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showAlert('Please enter a valid email address', 'error');
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/forgot-password`,
                { email: email.trim() }
            );

            if (response.data.success) {
                setUserEmail(email.trim());
                setStep(2);
                setTimer(60);
                showAlert('OTP sent successfully to your email!', 'success', 3000);
            } else {
                showAlert(response.data.message || 'Failed to send OTP', 'error');
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Something went wrong. Please try again.';
            showAlert(message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            showAlert('Please enter complete 6-digit OTP', 'warning');
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/verify-otp`,
                { 
                    email: userEmail,
                    otp: otpString 
                }
            );

            if (response.data.success) {
                setResetToken(response.data.resetToken);
                setStep(3);
                showAlert('OTP verified successfully!', 'success', 2000);
                // Clear OTP
                setOtp(['', '', '', '', '', '']);
            } else {
                showAlert(response.data.message || 'Invalid OTP! , please enter a valid OTP', 'error');
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to verify OTP';
            showAlert(message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Resend OTP
    const handleResendOTP = async () => {
        if (timer > 0) return;
        
        setIsLoading(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/forgot-password`,
                { email: userEmail }
            );

            if (response.data.success) {
                setTimer(60);
                showAlert('New OTP sent successfully!', 'success', 3000);
            } else {
                showAlert(response.data.message || 'Failed to send OTP', 'error');
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Something went wrong.';
            showAlert(message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Step 3: Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        
        // Validate password
        if (!password) {
            showAlert('Please enter a new password', 'warning');
            return;
        }

        if (password.length < 8) {
            showAlert('Password must be at least 8 characters long', 'error');
            return;
        }

        if (password !== confirmPassword) {
            showAlert('Passwords do not match!', 'error');
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.patch(
                `${import.meta.env.VITE_BACKEND_URL}/reset-password`,
                {
                    email: userEmail,
                    password: password,
                    resetToken: resetToken
                }
            );

            if (response.data.success) {
                setShowSuccessPopup(true);
                // Clear form
                setPassword('');
                setConfirmPassword('');
                // Show success after popup
                setTimeout(() => {
                    setShowSuccessPopup(false);
                    navigate('/login');
                    showAlert('Password reset successfully! Please login with your new password.', 'success', 5000);
                }, 3000);
            } else {
                showAlert(response.data.message || 'Failed to reset password', 'error');
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to reset password. Please try again.';
            showAlert(message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Format timer
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Get step icon
    const getStepIcon = (stepNumber) => {
        if (step > stepNumber) return <CheckCircle className="w-5 h-5 text-green-500" />;
        if (step === stepNumber) return <div className="w-5 h-5 bg-blue-600 rounded-full animate-pulse" />;
        return <div className="w-5 h-5 bg-gray-300 rounded-full" />;
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
            {AlertComponent}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md"
            >
                <div className="bg-white backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
                    {/* Back Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        // className=" py-3 px-4 mt-4 rounded-xl border-2 border-blue-200 text-blue-600 font-semibold text-sm transition-all hover:bg-blue-50 flex items-center justify-center gap-2"
                        onClick={() => step === 1 ? navigate('/login') : setStep(step - 1)}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 " />
                        <span className="text-sm font-medium">Back</span>
                    </motion.button>

                    {/* Header */}
                    <div className="text-center mb-6">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg mb-4"
                        >
                            {step === 1 && <MdEmail className="w-8 h-8 text-white" />}
                            {step === 2 && <Key className="w-8 h-8 text-white" />}
                            {step === 3 && <Fingerprint className="w-8 h-8 text-white" />}
                        </motion.div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">
                            {step === 1 && 'Reset Your Password'}
                            {step === 2 && 'Verify OTP'}
                            {step === 3 && 'Create New Password'}
                        </h1>
                        <p className="text-gray-500 text-sm">
                            {step === 1 && 'Enter your registered email address to receive OTP'}
                            {step === 2 && `Enter the 6-digit OTP sent to ${userEmail}`}
                            {step === 3 && 'Enter your new password below'}
                        </p>
                    </div>

                    {/* Steps Progress */}
                    <div className="flex justify-between items-center mb-8 px-4">
                        {[1, 2, 3].map((num) => (
                            <div key={num} className="flex items-center flex-1">
                                <div className="flex flex-col items-center">
                                    {getStepIcon(num)}
                                    <span className={`text-xs mt-1 font-medium ${
                                        step >= num ? 'text-blue-600' : 'text-gray-400'
                                    }`}>
                                        Step {num}
                                    </span>
                                </div>
                                {num < 3 && (
                                    <div className={`flex-1 h-0.5 mx-2 ${
                                        step > num ? 'bg-blue-600' : 'bg-gray-300'
                                    }`} />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Step 1: Email */}
                    {step === 1 && (
                        <motion.form
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            onSubmit={handleSendOTP}
                            className="space-y-4"
                        >
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your registered email"
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        disabled={isLoading}
                                    />
                                </div>
                                <p className="mt-1 text-xs text-gray-500">
                                    We'll send a 6-digit OTP to this email
                                </p>
                            </div>

                            <motion.button
                                type="submit"
                                disabled={isLoading}
                                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                                className="w-full py-3 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Sending OTP...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        Send OTP
                                    </>
                                )}
                            </motion.button>
                        </motion.form>
                    )}

                    {/* Step 2: OTP */}
                    {step === 2 && (
                        <motion.form
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            onSubmit={handleVerifyOTP}
                            className="space-y-4"
                        >
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                                    Enter OTP Code
                                </label>
                                <div className="flex gap-2 justify-center">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            id={`otp-${index}`}
                                            type="text"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                            className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
                                            disabled={isLoading}
                                            autoFocus={index === 0}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={handleResendOTP}
                                    disabled={timer > 0 || isLoading}
                                    className={`text-sm font-medium transition-colors ${
                                        timer > 0 || isLoading
                                            ? 'text-gray-400 cursor-not-allowed'
                                            : 'text-blue-600 hover:text-blue-700'
                                    }`}
                                >
                                    {timer > 0 ? `Resend in ${formatTime(timer)}` : 'Resend OTP'}
                                </button>
                            </div>

                            <motion.button
                                type="submit"
                                disabled={isLoading}
                                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                                className="w-full py-3 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 mt-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Verifying...
                                    </>
                                ) : (
                                    <>
                                        <Shield className="w-4 h-4" />
                                        Verify OTP
                                    </>
                                )}
                            </motion.button>
                        </motion.form>
                    )}

                    {/* Step 3: Reset Password */}
                    {step === 3 && (
                        <motion.form
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            onSubmit={handleResetPassword}
                            className="space-y-4"
                        >
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    New Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter new password"
                                        className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                <p className="mt-1 text-xs text-gray-500">
                                    Password must be at least 6 characters long
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm new password"
                                        className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {password && confirmPassword && password !== confirmPassword && (
                                    <p className="mt-1 text-xs text-red-500">Passwords do not match</p>
                                )}
                            </div>

                            <motion.button
                                type="submit"
                                disabled={isLoading}
                                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                                className="w-full py-3 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Resetting Password...
                                    </>
                                ) : (
                                    <>
                                        <Key className="w-4 h-4" />
                                        Reset Password
                                    </>
                                )}
                            </motion.button>
                        </motion.form>
                    )}

                    {/* Footer */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => navigate("/login")}
                        className="w-full py-3 mt-4 rounded-xl border-2 border-blue-200 text-blue-600 font-semibold text-sm transition-all hover:bg-blue-50 flex items-center justify-center gap-2"
                    >
                        <Key className="w-4 h-4" />
                        Remember your password? Sign in
                    </motion.button>
                </div>
            </motion.div>

            {/* Success Popup */}
            <AnimatePresence>
                {showSuccessPopup && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 50 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
                        >
                            <div className="relative bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                    className="absolute -top-8 left-1/2 transform -translate-x-1/2"
                                >
                                    <div className="bg-white rounded-full p-3 shadow-lg">
                                        <CheckCircle className="w-12 h-12 text-green-600" />
                                    </div>
                                </motion.div>
                                <div className="mt-6">
                                    <motion.h2
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className="text-2xl font-bold mb-2"
                                    >
                                        Password Reset Successful! 🎉
                                    </motion.h2>
                                    <motion.p
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                        className="text-green-100"
                                    >
                                        Your password has been reset successfully
                                    </motion.p>
                                </div>
                            </div>

                            <div className="p-6">
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="text-center mb-6"
                                >
                                    <div className="bg-green-50 rounded-lg p-4 mb-4">
                                        <div className="flex items-center gap-2 text-green-700 mb-2">
                                            <Sparkles className="w-4 h-4" />
                                            <span className="font-semibold">What's Next?</span>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            You can now login with your new password. 
                                            You'll be redirected to the login page shortly.
                                        </p>
                                    </div>
                                </motion.div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        setShowSuccessPopup(false);
                                        navigate('/login');
                                    }}
                                    className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-md flex items-center justify-center gap-2"
                                >
                                    <User className="w-5 h-5" />
                                    Go to Login
                                </motion.button>

                                <p className="text-center text-xs text-gray-400 mt-4">
                                    Redirecting to login in 3 seconds...
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ForgotPassword;