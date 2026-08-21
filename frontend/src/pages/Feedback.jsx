import React, { useState, useEffect } from "react";
import {
    Star,
    Send,
    MessageSquare,
    Lightbulb,
    Bug,
    Heart,
    User,
    Mail,
    Phone,
    CheckCircle,
    X,
    Sparkles,
    ThumbsUp,
    ThumbsDown,
    TrendingUp,
    Zap,
    Award,
    Clock,
    ArrowLeft,
    AlertCircle,
    Smile,
    Frown,
    Meh,
    Lock
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useAlert } from '../components/Alert';

const Feedback = () => {
    const navigate = useNavigate();
    const { showAlert, AlertComponent } = useAlert();

    // States
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        category: 'suggestion',
        rating: 0,
        message: '',
        improvements: '',
        experience: 'neutral'
    });
    const [hoverRating, setHoverRating] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const [errors, setErrors] = useState({});

    // Check if user is logged in
    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        if (token && user) {
            try {
                const parsedUser = JSON.parse(user);
                setUserData(parsedUser);
                setIsLoggedIn(true);
                // Auto-fill form with user data
                setFormData(prev => ({
                    ...prev,
                    name: parsedUser.name || '',
                    email: parsedUser.email || ''
                }));
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
    }, []);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Handle rating
    const handleRating = (value) => {
        setFormData(prev => ({ ...prev, rating: value }));
        if (errors.rating) {
            setErrors(prev => ({ ...prev, rating: '' }));
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Message is required';
        } else if (formData.message.length < 10) {
            newErrors.message = 'Message must be at least 10 characters';
        } else if (formData.message.length > 1000) {
            newErrors.message = 'Message cannot exceed 1000 characters';
        }

        if (formData.rating === 0) {
            newErrors.rating = 'Please select a rating';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            showAlert('Please fill in all required fields correctly', 'warning');
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/feedback`,
                formData
            );

            if (response.data.success) {
                setShowSuccessPopup(true);
                // Reset form
                setFormData({
                    name: userData?.name || '',
                    email: userData?.email || '',
                    phone: '',
                    category: 'suggestion',
                    rating: 0,
                    message: '',
                    improvements: '',
                    experience: 'neutral'
                });
                
                setTimeout(() => {
                    setShowSuccessPopup(false);
                    navigate('/student/dashboard');
                }, 5000);
            } else {
                showAlert(response.data.message || 'Failed to submit feedback', 'error');
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Something went wrong. Please try again.';
            showAlert(message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Category options
    const categories = [
        { value: 'suggestion', label: '💡 Suggestion', icon: Lightbulb },
        { value: 'bug', label: '🐛 Bug Report', icon: Bug },
        { value: 'feature', label: '🚀 Feature Request', icon: Zap },
        { value: 'improvement', label: '⚡ Improvement', icon: TrendingUp },
        { value: 'complaint', label: '😞 Complaint', icon: Frown },
        { value: 'other', label: '📝 Other', icon: MessageSquare }
    ];

    // Experience options
    const experiences = [
        { value: 'positive', label: '😊 Positive', icon: Smile },
        { value: 'neutral', label: '😐 Neutral', icon: Meh },
        { value: 'negative', label: '😞 Negative', icon: Frown }
    ];

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 py-8 px-4">
            {AlertComponent}

            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl shadow-lg mb-4"
                    >
                        <Heart className="w-10 h-10 text-white" fill="currentColor" />
                    </motion.div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                        We Value Your Feedback!
                    </h1>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Your feedback helps us improve the TNPC Portal. Share your thoughts, suggestions, or report any issues.
                    </p>
                </motion.div>

                {/* Main Form Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl shadow-2xl overflow-hidden"
                >
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-white">
                                <MessageSquare className="w-6 h-6" />
                                <h2 className="text-xl font-semibold">Feedback Form</h2>
                            </div>
                            <button
                                onClick={() => navigate(-1)}
                                className="text-white/80 hover:text-white transition-colors flex items-center gap-2"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                <span className="text-sm">Back</span>
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                        {/* User Info - Two columns */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name *
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter your name"
                                        className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 ${
                                            errors.name
                                                ? 'border-red-400 focus:ring-red-400'
                                                : 'border-gray-300 focus:ring-purple-500'
                                        }`}
                                        disabled={isLoading}
                                    />
                                </div>
                                {errors.name && (
                                    <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address *
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email"
                                        className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 ${
                                            errors.email
                                                ? 'border-red-400 focus:ring-red-400'
                                                : 'border-gray-300 focus:ring-purple-500'
                                        }`}
                                        disabled={isLoading}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                                )}
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number (Optional)
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Enter your phone number"
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category *
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {categories.map((cat) => {
                                    const Icon = cat.icon;
                                    const isSelected = formData.category === cat.value;
                                    return (
                                        <button
                                            key={cat.value}
                                            type="button"
                                            onClick={() => {
                                                setFormData(prev => ({ ...prev, category: cat.value }));
                                                if (errors.category) {
                                                    setErrors(prev => ({ ...prev, category: '' }));
                                                }
                                            }}
                                            className={`p-3 rounded-xl border-2 transition-all flex items-center gap-2 ${
                                                isSelected
                                                    ? 'border-purple-600 bg-purple-50 text-purple-700'
                                                    : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                                            }`}
                                            disabled={isLoading}
                                        >
                                            <Icon className="w-4 h-4" />
                                            <span className="text-sm font-medium">{cat.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Rating */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Rate Your Experience *
                            </label>
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => handleRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        className="focus:outline-none transition-transform hover:scale-110"
                                        disabled={isLoading}
                                    >
                                        <Star
                                            className={`w-10 h-10 ${
                                                (hoverRating || formData.rating) >= star
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'text-gray-300'
                                            } transition-colors`}
                                        />
                                    </button>
                                ))}
                                <span className="ml-2 text-sm text-gray-500">
                                    {formData.rating > 0 ? `${formData.rating} / 5` : 'Click to rate'}
                                </span>
                            </div>
                            {errors.rating && (
                                <p className="mt-1 text-xs text-red-500">{errors.rating}</p>
                            )}
                        </div>

                        {/* Experience */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                How would you describe your overall experience?
                            </label>
                            <div className="flex gap-3">
                                {experiences.map((exp) => {
                                    const Icon = exp.icon;
                                    const isSelected = formData.experience === exp.value;
                                    return (
                                        <button
                                            key={exp.value}
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, experience: exp.value }))}
                                            className={`flex-1 p-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                                                isSelected
                                                    ? 'border-purple-600 bg-purple-50 text-purple-700'
                                                    : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                                            }`}
                                            disabled={isLoading}
                                        >
                                            <Icon className="w-5 h-5" />
                                            <span className="text-sm font-medium">{exp.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Message */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Your Message *
                            </label>
                            <div className="relative">
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Please share your feedback, suggestions, or describe any issues you encountered..."
                                    rows="5"
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
                                        errors.message
                                            ? 'border-red-400 focus:ring-red-400'
                                            : 'border-gray-300 focus:ring-purple-500'
                                    } resize-none`}
                                    disabled={isLoading}
                                />
                                <div className="absolute bottom-2 right-3 text-xs text-gray-400">
                                    {formData.message.length}/1000
                                </div>
                            </div>
                            {errors.message && (
                                <p className="mt-1 text-xs text-red-500">{errors.message}</p>
                            )}
                        </div>

                        {/* Improvements */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Suggested Improvements (Optional)
                            </label>
                            <textarea
                                name="improvements"
                                value={formData.improvements}
                                onChange={handleChange}
                                placeholder="What features or improvements would you like to see? How can we make the portal better?"
                                rows="3"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                                disabled={isLoading}
                            />
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            whileHover={{ scale: isLoading ? 1 : 1.02 }}
                            whileTap={{ scale: isLoading ? 1 : 0.98 }}
                            className="w-full py-3 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    Submit Feedback
                                </>
                            )}
                        </motion.button>

                        {/* Trust indicators */}
                        <div className="flex justify-center items-center gap-6 text-xs text-gray-400 pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-1">
                                <Lock className="w-3 h-3" />
                                <span>Secure Submission</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                <span>We value your privacy</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>Response within 24-48 hours</span>
                            </div>
                        </div>
                    </form>
                </motion.div>
            </div>

            {/* Success Popup */}
            <AnimatePresence>
                {showSuccessPopup && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowSuccessPopup(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 50 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
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
                                <button
                                    onClick={() => setShowSuccessPopup(false)}
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
                                        Thank You! 🎉
                                    </motion.h2>
                                    <motion.p
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                        className="text-green-100"
                                    >
                                        Your feedback has been submitted successfully
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
                                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                                        <div className="flex items-center gap-2 text-blue-700 mb-2">
                                            <Sparkles className="w-4 h-4" />
                                            <span className="font-semibold">What Happens Next?</span>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            Our team will review your feedback and get back to you within 
                                            24-48 hours. Your input helps us make TNPC Portal better for everyone!
                                        </p>
                                    </div>

                                    <div className="bg-green-50 rounded-lg p-3">
                                        <div className="flex items-center gap-2 text-green-700">
                                            <Award className="w-4 h-4" />
                                            <span className="text-sm font-medium">Your feedback matters!</span>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        setShowSuccessPopup(false);
                                        navigate('/student/dashboard');
                                    }}
                                    className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-md flex items-center justify-center gap-2"
                                >
                                    <ThumbsUp className="w-5 h-5" />
                                    Return to Dashboard
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Feedback;