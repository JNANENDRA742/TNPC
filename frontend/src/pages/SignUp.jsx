import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  X,
  Rocket,
  Sparkles,
  Trophy,
  GraduationCap
} from 'lucide-react';
import { useAlert } from '../components/Alert';

const Signup = () => {
  const navigate = useNavigate();
  const { showAlert, AlertComponent } = useAlert();

  // State management
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [userData, setUserData] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Check password strength
  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[$@#&!]/.test(password)) strength++;
    return strength;
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setFormData(prev => ({ ...prev, password }));
    setPasswordStrength(checkPasswordStrength(password));
    if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
    if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' }));
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (serverError) setServerError('');
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
      showAlert('Please enter your email address', 'warning', 3000);
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      showAlert('Please enter a valid email address', 'error', 3000);
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
      showAlert('Please create a password', 'warning', 3000);
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      showAlert('Password must be at least 6 characters long', 'error', 3000);
    } else if (passwordStrength < 3) {
      newErrors.password = 'Password should contain uppercase, lowercase, and numbers';
      showAlert('Password should contain uppercase, lowercase, and numbers', 'warning', 3000);
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      showAlert('Passwords do not match. Please try again.', 'error', 3000);
    }

    // Terms validation
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions';
      showAlert('Please agree to the terms and conditions', 'warning', 3000);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("📤 Form submitting");

    if (!validateForm()) return;

    setIsLoading(true);
    setServerError('');

    try {
      // Only send email and password
      const payload = {
        email: formData.email.trim(),
        password: formData.password,
      };

      console.log("📤 Sending payload:", payload);

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/signup`,
        payload
      );

      console.log("📤 Response data:", response.data);

      if (response.data.success) {
        const { token, user, studentDetails } = response.data;

        // Store token and user data
        if (token) {
          localStorage.setItem('token', token);
        }
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          setUserData(user);
        }

        // Store student details
        if (studentDetails) {
          setStudentDetails(studentDetails);
        }

        // Show success alert
        showAlert(
          `Welcome ${studentDetails?.name || 'Student'}! Your account has been created successfully.`,
          'success',
          4000,
          '🎉 Registration Successful!'
        );

        // Reset form
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
          agreeTerms: false
        });
        setPasswordStrength(0);

        // Show success popup after a small delay
        setTimeout(() => {
          setShowSuccessPopup(true);
        }, 500);
      } else {
        const errorMsg = response.data.message || 'Signup failed';
        setServerError(errorMsg);
        showAlert(errorMsg, 'error', 4000);
      }
    } catch (error) {
      console.error('Signup Error:', error);

      let errorMessage = 'Something went wrong. Please try again.';

      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
        // Show specific error based on status
        if (error.response.status === 400) {
          showAlert(errorMessage, 'error', 4000);
        } else if (error.response.status === 409) {
          showAlert('This email is already registered. Please login instead.', 'warning', 4000);
        } else {
          showAlert(errorMessage, 'error', 4000);
        }
      } else if (error.request) {
        errorMessage = 'Cannot connect to server. Please check your connection.';
        showAlert(errorMessage, 'error', 4000);
      } else {
        showAlert(errorMessage, 'error', 4000);
      }

      setServerError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Get strength color
  const getStrengthColor = () => {
    if (passwordStrength <= 2) return 'bg-red-500';
    if (passwordStrength === 3) return 'bg-yellow-500';
    if (passwordStrength >= 4) return 'bg-green-500';
    return 'bg-gray-300';
  };

  // Get strength text
  const getStrengthText = () => {
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength === 3) return 'Medium';
    if (passwordStrength >= 4) return 'Strong';
    return '';
  };

  // Handle close popup
  const handleClosePopup = () => {
    setShowSuccessPopup(false);
    showAlert('Redirecting to login page...', 'info', 2000);
    setTimeout(() => {
      navigate('/login');
    }, 500);
  };

  // Handle go to login
  const handleGoToLogin = () => {
    setShowSuccessPopup(false);
    showAlert('Redirecting to login page...', 'info', 2000);
    setTimeout(() => {
      navigate('/login');
    }, 500);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      {AlertComponent}
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg"
      >
        <div className="bg-white backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Header */}
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl shadow-lg mb-4"
            >
              <GraduationCap className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Student Registration</h1>
            <p className="text-gray-500">Sign up using your college email</p>
          </div>

          {/* Server Error */}
          {/* <AnimatePresence>
            {serverError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 text-sm"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{serverError}</span>
              </motion.div>
            )}
          </AnimatePresence> */}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                College Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your college email"
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 ${errors.email
                    ? 'border-red-400 focus:ring-red-400'
                    : 'border-gray-300 focus:ring-emerald-500'
                    }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
              <p className="mt-1 text-xs text-gray-400">
                Use your college email address (3rd/4th year students only)
              </p>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handlePasswordChange}
                  placeholder="Create a strong password"
                  className={`w-full pl-10 pr-12 py-2.5 border rounded-xl focus:outline-none focus:ring-2 ${errors.password
                    ? 'border-red-400'
                    : 'border-gray-300 focus:ring-emerald-500'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getStrengthColor()} transition-all duration-300`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{getStrengthText()}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Use 6+ characters with uppercase, numbers & symbols
                  </p>
                </div>
              )}
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className={`w-full pl-10 pr-12 py-2.5 border rounded-xl focus:outline-none focus:ring-2 ${errors.confirmPassword
                    ? 'border-red-400'
                    : 'border-gray-300 focus:ring-emerald-500'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="mt-1 w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
              />
              <label className="text-sm text-gray-600">
                I agree to the{' '}
                <button type="button" className="text-emerald-600 hover:underline">
                  Terms of Service
                </button>{' '}
                and{' '}
                <button type="button" className="text-emerald-600 hover:underline">
                  Privacy Policy
                </button>
              </label>
            </div>
            {errors.agreeTerms && (
              <p className="text-xs text-red-500">{errors.agreeTerms}</p>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              className={`w-full py-3 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 mt-4 ${isLoading
                ? 'bg-emerald-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg'
                }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Register as Student
                </>
              )}
            </motion.button>
            <AnimatePresence>
              {serverError && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-center"
                >
                  <p className="text-sm text-red-700">
                    {serverError}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          {/* Divider */}
          <div className="relative mt-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white/80 text-gray-500">Or</span>
            </div>
          </div>

          {/* Login Link */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => navigate("/login")}
            className="w-full py-3 mt-4 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold text-sm transition-all hover:bg-cyan-50 flex items-center justify-center gap-2"
          >
            Already have an account? Sign In
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </motion.div>

      {/* Success Popup - Scrollable */}
      <AnimatePresence>
        {showSuccessPopup && userData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleClosePopup}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Fixed Header - stays at top */}
              <div className="relative bg-gradient-to-r from-emerald-500 to-teal-500 p-6 text-white text-center flex-shrink-0">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="absolute -top-8 left-1/2 transform -translate-x-1/2"
                >
                  <div className="bg-white rounded-full p-3 shadow-lg">
                    <CheckCircle className="w-12 h-12 text-emerald-500" />
                  </div>
                </motion.div>
                <button
                  onClick={handleClosePopup}
                  className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="mt-6">
                  <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl font-bold mb-2"
                  >
                    Registration Successful!
                  </motion.h2>
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-emerald-100"
                  >
                    Welcome to the college community
                  </motion.p>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-4">
                    <motion.div
                      animate={{
                        rotate: [0, 10, -10, 10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                    >
                      <Rocket className="w-16 h-16 text-emerald-500" />
                    </motion.div>
                  </div>

                  <p className="text-gray-600 mb-4">
                    Your account has been created successfully!
                    You can now log in to access your student dashboard.
                  </p>

                  {/* Show student details in popup */}
                  {studentDetails && (
                    <div className="bg-emerald-50 rounded-lg p-4 mb-6 text-left">
                      <div className="flex items-center gap-2 text-emerald-700 mb-2">
                        <GraduationCap className="w-4 h-4" />
                        <span className="font-semibold">Student Details</span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><span className="font-medium">Name:</span> {studentDetails.name}</p>
                        <p><span className="font-medium">ID:</span> {studentDetails.studentId}</p>
                        <p><span className="font-medium">Department:</span> {studentDetails.department}</p>
                        <p><span className="font-medium">Gender:</span> {studentDetails.gender}</p>
                        <p><span className="font-medium">Year:</span> {studentDetails.year}</p>
                      </div>
                    </div>
                  )}

                  <div className="bg-emerald-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 text-emerald-700 mb-2">
                      <Sparkles className="w-4 h-4" />
                      <span className="font-semibold">What's next?</span>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1 text-left">
                      <li>✓ Complete your student profile</li>
                      <li>✓ Browse available placement drives</li>
                      <li>✓ Apply for opportunities</li>
                      <li>✓ Track your applications</li>
                    </ul>
                  </div>
                </motion.div>
              </div>

              {/* Fixed Footer - stays at bottom */}
              <div className="flex-shrink-0 p-6 pt-0 border-t border-gray-100">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-3"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGoToLogin}
                    className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <Trophy className="w-5 h-5" />
                    Go to Login
                  </motion.button>
                  <p className="text-center text-xs text-gray-400">
                    You can now login in the login page to access your student dashboard.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Signup;