import React from 'react'
import campus from '../assets/campus.webp'
import { useScrollReveal } from "../hooks/useScrollReveal";
import { Link } from "react-router-dom";
import { ArrowRight, Award, Building2, HomeIcon, LucideHome, TrendingUp, User } from 'lucide-react';
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
            Welcome to our Home Page! <LucideHome className="w-4 h-4" />
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

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-[400px]">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
  //         <p className="mt-4 text-gray-500">Loading Home Page please wait ...</p>
  //       </div>
  //     </div>
  //   );
  // }
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

  // Calculate dynamic placement statistics
  const getPlacementStats = () => {
    const totalStudents = filteredStudents.length;

    // Get unique companies
    const uniqueCompanies = new Set(filteredStudents.map(s => s.company));
    const totalCompanies = uniqueCompanies.size;

    // Calculate average package
    const totalPackage = filteredStudents.reduce((sum, student) => sum + student.package, 0);
    const averagePackage = totalStudents > 0 ? (totalPackage / totalStudents).toFixed(1) : 0;

    // Find highest package
    const highestPackage = totalStudents > 0 ? Math.max(...filteredStudents.map(s => s.package)) : 0;

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

  const placementDetails = [
    {
      icon: <User size={24} />,
      count: stats.studentsPlaced,
      description: `Students Placed (${stats.yearDisplay})`
    },
    {
      icon: <Building2 size={24} />,
      count: stats.companies > 0 ? `${stats.companies}+` : "0",
      description: "Recruiting Companies"
    },
    {
      icon: <TrendingUp size={24} />,
      count: stats.averagePackage > 0 ? `₹${stats.averagePackage}` : "₹0",
      description: "Average Package (LPA)"
    },
    {
      icon: <Award size={24} />,
      count: stats.highestPackage > 0 ? `₹${stats.highestPackage}` : "₹0",
      description: "Highest Package (LPA)"
    }
  ];

  return (
    <div ref={revealRef}>
      {AlertComponent}
      <div>
        <section className='min-h-[85vh] w-full relative p-5'>
          <div className='w-full absolute inset-0'>
            <img src={campus} alt="Campus" className='w-screen h-[85vh] object-cover' />
            <div className='absolute inset-0 bg-black opacity-40'></div>
          </div>

          {/* overlay Text */}
          <div className='relative z-20 mx-auto container section-padding py-20'>
            <div className="max-w-2xl">
              <h1 className="sm:text-4xl md:text-5xl lg:text-6xl font-display text-white font-bold leading-relaxed">Shaping Careers</h1>
              <p className="text-white text-lg leading-relaxed mb-8 max-w-lg">
                Rajiv Gandhi University of Knowledge Technologies (IIIT) AP, Srikakulam — connecting talent with top companies since 2008.
              </p>

              <Link to="/placements" className="group inline-flex items-center gap-4 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300 hover:text-gray-900">
                View Placements
                <ArrowRight size={16} className="text-white group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </section>

        {/* cards */}
        <div className="mt-15 grid sm:grid-cols-1 md:grid-cols-4 gap-6 w-full px-4 py-8">
          {placementDetails.map((detail, index) => (
            <div key={index} className="group bg-white rounded-lg shadow-lg shadow-gray-700 p-6 flex flex-col items-center text-center hover:scale-103 transition-transform duration-300">
              <div className="text-blue-500 mb-4 group-hover:bg-blue-400 p-4 rounded-md group-hover:text-white transition duration-300">{detail.icon}</div>
              <h2 className="text-2xl font-bold mb-2">{detail.count}</h2>
              <p className="text-gray-600">{detail.description}</p>
            </div>
          ))}
        </div>

        {/* cards for placed students with dropdown */}
        <div className='mt-15'>
          <div className="flex flex-col sm:flex-row justify-between items-center mb-10 px-4">
            <div>
              <h1 className='text-2xl font-semibold leading-relaxed text-center sm:text-left'>
                Top Achievers {selectedYear !== 'all' ? `- ${selectedYear}` : '(All Years)'}
              </h1>
              <p className='text-sm text-gray-700 text-center sm:text-left'>Our brightest minds, placed in the world's leading technology companies.</p>
            </div>

            {/* Year Dropdown */}
            <div className="mt-4 sm:mt-0">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm cursor-pointer"
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
            <div className="text-center py-12 px-4">
              <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No students found for the selected year.</p>
              <p className="text-gray-400 text-sm mt-1">Try selecting a different year or check back later.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-1 md:grid-cols-4 gap-6 w-full px-4 py-8">
              {topPlacers.map((student, index) => (
                <div key={index} className="group bg-white w-full p-6 rounded-lg shadow-lg shadow-gray-700 flex flex-col items-center text-center hover:scale-103 transition-transform duration-300">
                  <div className='bg-gray-200 group-hover:bg-blue-500 text-black group-hover:text-white w-16 h-16 rounded-full flex items-center justify-center font-bold transition-colors duration-500'>
                    {student.name?.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className='text-black text-lg font-semibold'>{student.name}</div>
                  <p className="text-blue-600 font-semibold text-sm mt-1">{student.company}</p>
                  <p className="text-muted-foreground text-xs mt-1">{student.department} • ₹{student.package} LPA</p>
                </div>
              ))}
            </div>
          )}

          <Link to="/placements" className='p-4 flex items-center gap-2 justify-center m-10 hover:text-blue-600 group'>
            View all Placements <ArrowRight size={20} className='group-hover:translate-x-1 transition-all duration-300' />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home