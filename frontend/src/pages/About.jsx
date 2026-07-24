
import { Check, Award, Target, Eye, Briefcase, Calendar, Users, BookOpen, Sparkles, Rocket, Star, TrendingUp, Zap, Shield, Globe, Linkedin, Mail, Phone, MapPin, Clock, GraduationCap, Building2 } from 'lucide-react';
import { useAlert } from '../components/Alert';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const About = () => {
    const { showAlert, AlertComponent } = useAlert();
    const [activeCard, setActiveCard] = useState(null);

    useEffect(() => {
        showAlert('🎓 Welcome to our About Us page! Discover who we are.', 'success', 4000);
    }, []);

    // Animation variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const cardHover = {
        rest: { scale: 1 },
        hover: { 
            scale: 1.02,
            transition: { 
                type: "spring",
                stiffness: 400,
                damping: 10
            }
        }
    };

    return (
        <div className='min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 md:p-8'>
            {AlertComponent}
            
            {/* Hero Section */}
            <motion.section 
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className='relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-50 via-white to-indigo-50 p-8 md:p-16 mb-8 shadow-2xl'
            >
                {/* Animated background elements */}
                {/* <motion.div 
                    className="absolute inset-0 opacity-10"
                    animate={{
                        background: [
                            'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.9) 0%, transparent 50%)',
                            'radial-gradient(circle at 80% 50%, rgba(255,255,255,0.9) 0%, transparent 50%)',
                            'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.9) 0%, transparent 50%)'
                        ]
                    }}
                    transition={{ duration: 10, repeat: Infinity }}
                /> */}
                
                {/* <motion.div 
                    className="absolute top-0 right-0 w-64 h-64 bg-black/50 rounded-full blur-3xl"
                    animate={{ x: [0, -50, 0], y: [0, 50, 0] }}
                    transition={{ duration: 8, repeat: Infinity }}
                />
                <motion.div 
                    className="absolute bottom-0 left-0 w-96 h-96 bg-black/50 rounded-full blur-3xl"
                    animate={{ x: [0, 50, 0], y: [0, -50, 0] }}
                    transition={{ duration: 10, repeat: Infinity }}
                /> */}

                <div className="relative z-10 text-center text-black">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                        className="inline-flex items-center justify-center w-20 h-20 bg-cyan-200 rounded-full backdrop-blur-sm mb-6"
                    >
                        <GraduationCap className="w-10 h-10 animate-pulse" />
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className='text-4xl md:text-6xl font-bold mb-4'
                    >
                        About Us
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className='text-xl text-gray-600 max-w-3xl mx-auto'
                    >
                        Who We Are & What We Stand For
                    </motion.p>

                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="w-24 h-1 bg-black mx-auto mt-6 rounded"
                    />
                </div>
            </motion.section>

            <motion.section 
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className='bg-white rounded-3xl shadow-xl p-6 md:p-12 mb-8 border border-gray-300'
            >
                <div className="text-center max-w-4xl mx-auto">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.6 }}
                        className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4"
                    >
                        <Building2 className="w-6 h-6 text-blue-600" />
                    </motion.div>
                    
                    <motion.h2 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className='text-3xl md:text-4xl font-bold text-gray-800 mb-4'
                    >
                        Bridging Academic Excellence with Professional Success
                    </motion.h2>
                    
                    <motion.p 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className='text-gray-600 leading-relaxed text-lg'
                    >
                        The Placement Cell of Rajiv Gandhi University of Knowledge Technologies, Srikakulam (AP IIIT) serves as a vital link between academic learning and the professional world. We are committed to shaping career-ready individuals who possess the skills, confidence, and adaptability to thrive across diverse industries.
                    </motion.p>
                </div>
            </motion.section>

            {/* Mission & Vision Grid */}
            <motion.div 
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className='grid md:grid-cols-2 gap-8 mb-12'
            >
                {/* Mission Card */}
                <motion.div 
                    variants={fadeInUp}
                    whileHover="hover"
                    initial="rest"
                    className='group bg-white rounded-3xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-500'
                >
                    <div className="flex items-center gap-3 mb-6">
                        <motion.div 
                            className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-600 transition-colors duration-300"
                            whileHover={{ rotate: 10, scale: 1.1 }}
                        >
                            <Target className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-300" />
                        </motion.div>
                        <h2 className='text-2xl font-bold text-gray-800'>
                            Our Mission
                        </h2>
                    </div>
                    
                    <div className="space-y-4">
                        <p className='text-gray-600 leading-relaxed'>
                            Our vision is to establish the Placement Cell of RGUKT Srikakulam as a transformative platform that bridges academic excellence with professional success. We aim to develop career-ready individuals who possess the skills, confidence, and adaptability to thrive across diverse industries.
                        </p>
                        <p className='text-gray-600 leading-relaxed'>
                            We strive to go beyond traditional placement practices by promoting a future-oriented mindset where innovation, professionalism, and ethical values form the foundation of career growth. Through strategic industry collaborations and experiential learning opportunities, we aspire to position our students as competent, responsible, and industry-ready professionals.
                        </p>
                    </div>
                </motion.div>

                {/* Vision Card */}
                <motion.div 
                    variants={fadeInUp}
                    whileHover="hover"
                    initial="rest"
                    className='group bg-white rounded-3xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-500'
                >
                    <div className="flex items-center gap-3 mb-6">
                        <motion.div 
                            className="p-3 bg-purple-100 rounded-xl group-hover:bg-purple-600 transition-colors duration-300"
                            whileHover={{ rotate: 10, scale: 1.1 }}
                        >
                            <Eye className="w-6 h-6 text-purple-600 group-hover:text-white transition-colors duration-300" />
                        </motion.div>
                        <h2 className='text-2xl font-bold text-gray-800'>
                            Our Vision
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {[
                            "To prepare students not just for employment, but for building meaningful and impactful careers.",
                            "To foster a future-ready mindset that emphasizes continuous learning, informed decision-making, and ethical professional conduct.",
                            "To promote an inclusive and growth-driven placement culture through newsletters, career blogs, and data-driven insights.",
                            "To create awareness about emerging career opportunities and industry trends.",
                            "To enhance students' employability skills through resume building and mock interviews.",
                            "To provide quality internship and placement opportunities through strong industry collaborations."
                        ].map((item, index) => (
                            <motion.div 
                                key={index} 
                                className="flex items-start gap-3 group/item"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ x: 5 }}
                            >
                                <motion.div
                                    whileHover={{ scale: 1.2, rotate: 10 }}
                                    className="mt-1 flex-shrink-0"
                                >
                                    <Check className="text-purple-600" size={20} />
                                </motion.div>
                                <p className="text-gray-700">{item}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>

            {/* What We Do Section */}
            <motion.section 
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="bg-white rounded-3xl shadow-xl p-6 md:p-12 border border-gray-100"
            >
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
                        className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4"
                    >
                        <Sparkles className="w-7 h-7 text-white" />
                    </motion.div>
                    
                    <motion.h2 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
                    >
                        What We Do
                    </motion.h2>
                    
                    <motion.p 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="text-gray-600 text-lg max-w-2xl mx-auto"
                    >
                        Key initiatives and activities carried out by the Placement Cell.
                    </motion.p>
                    
                    <motion.div 
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                        className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mt-4 rounded"
                    />
                </div>

                <motion.div 
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="grid md:grid-cols-2 gap-6"
                >
                    {[
                        {
                            icon: Briefcase,
                            title: "Internship Drives",
                            desc: "The Placement Cell actively organises internship drives in collaboration with reputed companies, startups, and organizations, providing students with opportunities across technical and non-technical domains.",
                            color: "blue"
                        },
                        {
                            icon: Briefcase,
                            title: "Placement Drives",
                            desc: "The Placement Cell facilitates campus recruitment by connecting students with leading companies and organizations, ensuring diverse and rewarding career opportunities.",
                            color: "green"
                        },
                        {
                            icon: Calendar,
                            title: "Converge – Internship Fair",
                            desc: "Converge is the annual flagship internship fair offering students a platform to interact with industry professionals and secure valuable internship opportunities.",
                            color: "purple"
                        },
                        {
                            icon: Rocket,
                            title: "Career Readiness Boot Camp",
                            desc: "The Career Readiness Boot Camp equips students with essential skills through expert-led sessions focusing on industry expectations, recruitment processes, and career preparation.",
                            color: "orange"
                        },
                        {
                            icon: Users,
                            title: "Webinars & Seminars",
                            desc: "Regular webinars and seminars featuring industry experts and alumni to guide students on career planning, interview preparation, and emerging trends.",
                            color: "pink"
                        },
                        {
                            icon: BookOpen,
                            title: "Corporate Catena",
                            desc: "Corporate Catena is the official monthly blog showcasing student-driven insights on industry trends, corporate culture, and career development.",
                            color: "indigo"
                        },
                        {
                            icon: TrendingUp,
                            title: "Newsletter",
                            desc: "The Placement Cell publishes a monthly newsletter highlighting key activities, placement drives, and student achievements.",
                            color: "teal"
                        },
                        {
                            icon: Shield,
                            title: "Career Counselling",
                            desc: "Dedicated career counselling support including resume building, mock interviews, aptitude training, and personalised guidance for student success.",
                            color: "red"
                        }
                    ].map((item, index) => {
                        const IconComponent = item.icon;
                        const colors = {
                            blue: "from-blue-500 to-blue-600",
                            green: "from-green-500 to-green-600",
                            purple: "from-purple-500 to-purple-600",
                            orange: "from-orange-500 to-orange-600",
                            pink: "from-pink-500 to-pink-600",
                            indigo: "from-indigo-500 to-indigo-600",
                            teal: "from-teal-500 to-teal-600",
                            red: "from-red-500 to-red-600"
                        };
                        const bgColors = {
                            blue: "bg-blue-50 group-hover:bg-blue-100",
                            green: "bg-green-50 group-hover:bg-green-100",
                            purple: "bg-purple-50 group-hover:bg-purple-100",
                            orange: "bg-orange-50 group-hover:bg-orange-100",
                            pink: "bg-pink-50 group-hover:bg-pink-100",
                            indigo: "bg-indigo-50 group-hover:bg-indigo-100",
                            teal: "bg-teal-50 group-hover:bg-teal-100",
                            red: "bg-red-50 group-hover:bg-red-100"
                        };

                        return (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                whileHover="hover"
                                initial="rest"
                                custom={index}
                                className="group relative bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-transparent transition-all duration-300 hover:shadow-xl overflow-hidden"
                                onMouseEnter={() => setActiveCard(index)}
                                onMouseLeave={() => setActiveCard(null)}
                            >
                                {/* Animated gradient background */}
                                <motion.div 
                                    className={`absolute inset-0 bg-gradient-to-br ${colors[item.color]} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                                />
                                
                                <div className="relative z-10">
                                    <div className="flex items-start gap-4">
                                        <motion.div 
                                            className={`p-3 rounded-xl ${bgColors[item.color]} transition-all duration-300`}
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                        >
                                            <IconComponent className={`w-6 h-6 text-${item.color}-600`} />
                                        </motion.div>
                                        
                                        <div className="flex-1">
                                            <motion.h3 
                                                className="text-lg font-semibold text-gray-800 mb-2"
                                                whileHover={{ x: 5 }}
                                            >
                                                {item.title}
                                            </motion.h3>
                                            <p className="text-gray-600 text-sm leading-relaxed">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Animated border */}
                                <motion.div 
                                    className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${colors[item.color]} rounded-full`}
                                    initial={{ width: 0 }}
                                    animate={{ width: activeCard === index ? '100%' : '0%' }}
                                    transition={{ duration: 0.4 }}
                                />
                            </motion.div>
                        );
                    })}
                </motion.div>
            </motion.section>

            
        </div>
    );
};

export default About;