import React from 'react'
import campus from '../assets/campus.webp'
import { useScrollReveal } from "../hooks/useScrollReveal";
import { Link } from "react-router-dom";
import { ArrowRight, Award, Building2, HomeIcon, TrendingUp, User, GraduationCap, Briefcase, Star, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAlert } from '../components/Alert';
import { LuAlbum } from 'react-icons/lu';
import SpiralBallLoader from '../components/LoadingAnimation';

const Home = () => {
  const revealRef = useScrollReveal();
  const { showAlert, AlertComponent } = useAlert();

  const [placedStudents, setPlacedStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState('all');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/placedStudents`);
        setPlacedStudents(res.data);
        setLoading(false);
        showAlert(
          <div className='flex items-center gap-2'>
            Welcome to our Home Page! <HomeIcon className="w-4 h-4" />
          </div>,
          "success",
          4000
        );
      }
      catch (err) {
        console.log(err);
        setLoading(false);
        showAlert('Failed to load placement data', 'error', 4000);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <HomeIcon className="w-8 h-8 text-blue-600 animate-pulse" />
            </div>
          </div>
          <p className="mt-6 text-lg font-semibold text-gray-700">Loading Home Page ...</p>
          <p className="text-sm text-gray-400 mt-1">Please wait a moment . . .</p>
        </div>
      </div>
    );
  }

  // Get unique years from data for dropdown
  const years = ['all', ...new Set(placedStudents.map(s => s.year).sort((a, b) => b - a))];

  // Filter students based on selected year
  const filteredStudents = selectedYear === 'all'
    ? placedStudents
    : placedStudents.filter(s => s.year === parseInt(selectedYear));

  // Get top 4 students by package from filtered list
  const topPlacers = [...filteredStudents]
    .sort((a, b) => b.package - a.package)
    .slice(0, 4);

  // Calculate dynamic placement statistics - FIXED AVERAGE CALCULATION
  const getPlacementStats = () => {
    const totalStudents = filteredStudents.length;

    // Get unique companies
    const uniqueCompanies = new Set(filteredStudents.map(s => s.company));
    const totalCompanies = uniqueCompanies.size;

    // Calculate average package - FIXED: Ensure proper calculation with valid numbers
    let averagePackage = 0;
    if (totalStudents > 0) {
      const totalPackage = filteredStudents.reduce((sum, student) => {
        const pkg = parseFloat(student.package) || 0;
        return sum + pkg;
      }, 0);
      // Round to 1 decimal place
      averagePackage = parseFloat((totalPackage / totalStudents).toFixed(1));
    }

    // Find highest package
    let highestPackage = 0;
    if (totalStudents > 0) {
      highestPackage = Math.max(...filteredStudents.map(s => parseFloat(s.package) || 0));
    }

    // Get year display text
    const yearDisplay = selectedYear === 'all' ? 'All Years' : selectedYear;

    return {
      studentsPlaced: totalStudents,
      companies: totalCompanies,
      averagePackage: averagePackage,
      highestPackage: highestPackage,
      yearDisplay: yearDisplay
    };
  };

  const stats = getPlacementStats();

  // Color gradients for stat cards
  const cardColors = [
    { bg: 'from-blue-50 to-blue-100', icon: 'text-blue-600', hover: 'hover:from-blue-100 hover:to-blue-200' },
    { bg: 'from-green-50 to-green-100', icon: 'text-green-600', hover: 'hover:from-green-100 hover:to-green-200' },
    { bg: 'from-purple-50 to-purple-100', icon: 'text-purple-600', hover: 'hover:from-purple-100 hover:to-purple-200' },
    { bg: 'from-orange-50 to-orange-100', icon: 'text-orange-600', hover: 'hover:from-orange-100 hover:to-orange-200' }
  ];

  const placementDetails = [
    {
      icon: <User size={24} />,
      count: stats.studentsPlaced,
      description: `Students Placed`,
      subtitle: stats.yearDisplay,
      color: cardColors[0]
    },
    {
      icon: <Building2 size={24} />,
      count: stats.companies > 0 ? `${stats.companies}+` : "0",
      description: "Recruiting Companies",
      subtitle: "Top organizations",
      color: cardColors[1]
    },
    {
      icon: <TrendingUp size={24} />,
      count: stats.averagePackage > 0 ? `₹${stats.averagePackage}L` : "₹0",
      description: "Average Package",
      subtitle: "Per annum",
      color: cardColors[2]
    },
    {
      icon: <Award size={24} />,
      count: stats.highestPackage > 0 ? `₹${stats.highestPackage}L` : "₹0",
      description: "Highest Package",
      subtitle: "Top offer",
      color: cardColors[3]
    }
  ];

  return (
    <div ref={revealRef}>
      {AlertComponent}
      <div>
        {/* Hero Section */}
        <section className='min-h-[85vh] w-full relative p-5'>
          <div className='w-full absolute inset-0'>
            <img src={campus} alt="Campus" className='w-screen h-[85vh] object-cover' />
            <div className='absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30'></div>
          </div>

          {/* overlay Text */}
          <div className='relative z-20 mx-auto container section-padding py-20'>
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-1 w-12 bg-blue-500 rounded-full"></div>
                <span className="text-blue-400 font-medium tracking-wider">RGUKT AP • SRIKAKULAM</span>
              </div>
              <h1 className="sm:text-4xl md:text-5xl lg:text-6xl font-display text-white font-bold leading-tight">
                Shaping Careers,<br />
                <span className="text-blue-400">Building Futures</span>
              </h1>
              <p className="text-white/90 text-lg leading-relaxed mb-8 max-w-lg mt-4">
                Rajiv Gandhi University of Knowledge Technologies (IIIT) AP, Srikakulam — connecting talent with top companies since 2008.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/placements" className="group inline-flex items-center gap-3 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40">
                  View Placements
                  <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-300" />
                </Link>
                <Link to="/about" className="group inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-lg hover:bg-white/20 transition-all duration-300 border border-white/20">
                  Learn More
                </Link>
              </div>
            </div>
          </div>

          
        </section>

        {/* Stats Cards */}
        <div className="-mt-10 relative z-30">
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full px-4 max-w-7xl mx-auto">
            {placementDetails.map((detail, index) => (
              <div 
                key={index} 
                className={`group bg-gradient-to-br ${detail.color.bg} rounded-2xl shadow-lg shadow-gray-300/30 p-6 flex flex-col items-center text-center hover:scale-105 transition-all duration-300 hover:${detail.color.hover} cursor-default border border-white/50 backdrop-blur-sm`}
              >
                <div className={`${detail.color.icon} mb-3 p-3 rounded-xl bg-white/60 group-hover:scale-110 transition-transform duration-300`}>
                  {detail.icon}
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-1">{detail.count}</h2>
                <p className="text-gray-600 font-medium">{detail.description}</p>
                <p className="text-xs text-gray-400 mt-1">{detail.subtitle}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top Achievers Section */}
        <div className='mt-20 max-w-7xl mx-auto px-4'>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <h1 className='text-2xl font-bold text-gray-800'>
                  Top Achievers
                </h1>
              </div>
              <p className='text-gray-600'>
                {selectedYear !== 'all' ? `Class of ${selectedYear}` : 'All Years'} • Our brightest minds, placed in leading companies
              </p>
            </div>

            {/* Year Dropdown with icon */}
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-gray-400" />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-4 py-2 pr-8 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm cursor-pointer hover:border-blue-300 transition-colors appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236B7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-no-repeat bg-[right_1rem_center]"
              >
                {years.map(year => (
                  <option key={year} value={year}>
                    {year === 'all' ? 'All Years' : year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {topPlacers.length === 0 ? (
            <div className="text-center py-16 px-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No students found for the selected year.</p>
              <p className="text-gray-400 text-sm mt-1">Try selecting a different year or check back later.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {topPlacers.map((student, index) => {
                // Generate gradient based on rank
                const rankGradients = [
                  'from-yellow-100 to-yellow-50 border-yellow-300',
                  'from-gray-200 to-gray-100 border-gray-300',
                  'from-orange-100 to-orange-50 border-orange-300',
                  'from-blue-100 to-blue-50 border-blue-300'
                ];
                
                const rankEmojis = ['🥇', '🥈', '🥉', '🏅'];
                
                return (
                  <div 
                    key={index} 
                    className={`group bg-gradient-to-br ${rankGradients[index] || 'from-gray-50 to-white'} border-2 rounded-2xl p-6 flex flex-col items-center text-center hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-gray-300/50 relative`}
                  >
                    <div className="absolute top-3 right-3 text-2xl">
                      {rankEmojis[index] || '⭐'}
                    </div>
                    
                    <div className={`bg-gradient-to-br from-blue-500 to-blue-600 w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300`}>
                      {student.name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    
                    <div className='mt-3'>
                      <h3 className='text-lg font-bold text-gray-800'>{student.name}</h3>
                      <p className="text-blue-600 font-semibold text-sm flex items-center justify-center gap-1">
                        <Briefcase size={14} />
                        {student.company}
                      </p>
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          {student.department}
                        </span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                          ₹{student.package} LPA
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <Link 
            to="/placements" 
            className='flex items-center justify-center gap-2 mt-10 text-blue-600 hover:text-blue-700 group transition-all duration-300'
          >
            <span className="font-medium">View all Placements</span> 
            <ArrowRight size={18} className='group-hover:translate-x-2 transition-transform duration-300' />
          </Link>
        </div>

        {/* Footer CTA */}
        <div className="mt-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h2 className="text-2xl font-bold mb-2">Ready to Shape Your Future?</h2>
                <p className="text-blue-100">Join our alumni network and become part of our success story</p>
              </div>
              <Link 
                to="/login" 
                className="group inline-flex items-center gap-3 bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg shadow-black/20"
              >
                Explore more
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home