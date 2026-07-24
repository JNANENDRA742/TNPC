import React, { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, Legend, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Search, Filter, Rocket, Building2, Users, TrendingUp, Award, Briefcase, GraduationCap, Calendar, ChevronRight } from "lucide-react";
import axios from 'axios';
import { useAlert } from '../components/Alert';
import { LuGraduationCap } from 'react-icons/lu';
import LoadingAnimation from '../components/LoadingAnimation';

const Placements = () => {
  const { showAlert, AlertComponent } = useAlert();

  const [yearlyPlacements, setYearlyPlacements] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [placedStudents, setPlacedStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [campusStats, setCampusStats] = useState({ onCampus: {}, offCampus: {} });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedYear, setSelectedYear] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/placements`);

        const {
          yearlyPlacements,
          companies,
          placedStudents,
          departments,
          campusStats
        } = res.data;

        setYearlyPlacements(yearlyPlacements);
        setCompanies(companies);
        setPlacedStudents(placedStudents);
        setDepartments(departments);
        setCampusStats(campusStats[0]);
        setLoading(false);

        showAlert(
          <div className='flex items-center gap-2'>
            Welcome to our Placements Page! <LuGraduationCap className="w-4 h-4" />
          </div>,
          "success",
          4000
        );
      } catch (err) {
        console.log("Error:", err);
        setLoading(false);
        showAlert('Failed to load placement data', 'error', 4000);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Rocket className="w-8 h-8 text-blue-600 animate-pulse" />
            </div>
          </div>
          <p className="mt-6 text-lg font-semibold text-gray-700">Loading Placements Page ...</p>
          <p className="text-sm text-gray-400 mt-1">Please wait a moment . . .</p>
        </div>
      </div>
    );
  }

  const COLORS = ["#1a365d", "#d69e2e"];

  const pieData = campusStats?.onCampus
    ? [
      { name: "On Campus", value: campusStats.onCampus.total },
      { name: "Off Campus", value: campusStats.offCampus.total },
    ]
    : [];

  const filteredStudents = placedStudents.filter(student => {
    const matchedYear = selectedYear === "All" || student.year.toString() === selectedYear;
    const matchedSearch = student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.company.toLowerCase().includes(search.toLowerCase()) ||
      student.department.toLowerCase().includes(search.toLowerCase());
    return matchedYear && matchedSearch;
  })

  const topPlacers = [...filteredStudents]
    .sort((a, b) => b.package - a.package)
    .slice(0, 5);

  // Calculate summary stats
  const totalStudents = placedStudents.length;
  const totalCompanies = companies.length;
  const avgPackage = totalStudents > 0 
    ? (placedStudents.reduce((sum, s) => sum + parseFloat(s.package), 0) / totalStudents).toFixed(1)
    : 0;
  const highestPackage = totalStudents > 0 
    ? Math.max(...placedStudents.map(s => parseFloat(s.package)))
    : 0;

  
  return (
    <section className='min-h-screen bg-gray-50 py-8 px-4 md:px-6'>
      {AlertComponent}
      
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='bg-white rounded-2xl shadow-sm border border-gray-100 px-6 md:px-10 py-10 md:py-12 mb-8'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
            <div>
              <h1 className='text-3xl md:text-4xl font-bold text-gray-900 tracking-tight'>
                Placement Records
              </h1>
              <p className='text-gray-500 mt-2'>
                Year-wise and company-wise placement statistics from 2019 to 2025
              </p>
            </div>
            <div className='flex items-center gap-2 text-sm text-gray-400'>
              <span className='w-2 h-2 rounded-full bg-emerald-400 animate-pulse'></span>
              Live Data
            </div>
          </div>
        </div>

        

        {/* Charts */}
        <div className='grid lg:grid-cols-2 gap-6 mb-8'>
          {/* Pie Chart */}
          <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-lg font-semibold text-gray-900'>
                Placement Distribution
              </h2>
              <span className='text-xs text-gray-400'>On/Off Campus</span>
            </div>

            {pieData.length === 0 ? (
              <div className="flex items-center justify-center h-[280px]">
                <p className="text-gray-400 text-sm">No placement data available</p>
              </div>
            ) : (
              <div className='w-full'>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={95}
                      paddingAngle={3}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      labelLine={false}
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: 8, 
                        fontSize: 12, 
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }} 
                    />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Bar Chart */}
          <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-lg font-semibold text-gray-900'>
                Yearly Placements
              </h2>
              <span className='text-xs text-gray-400'>Students placed</span>
            </div>

            {yearlyPlacements.length === 0 ? (
              <div className="flex items-center justify-center h-[280px]">
                <p className="text-gray-400 text-sm">No yearly data available</p>
              </div>
            ) : (
              <div className='w-full'>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={yearlyPlacements}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis 
                      dataKey="year" 
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 8,
                        border: 'none',
                        backgroundColor: '#fff',
                        padding: '10px 14px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                      formatter={(value) => [`${value} students`, 'Placed']}
                    />
                    <Bar
                      dataKey="totalPlaced"
                      fill="#1a365d"
                      radius={[4, 4, 0, 0]}
                      barSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* Companies Section */}
        <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8'>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h2 className='text-lg font-semibold text-gray-900'>
                Recruiting Companies
              </h2>
              <p className='text-sm text-gray-400 mt-1'>
                Top companies hiring from our campus
              </p>
            </div>
            <div className='text-sm text-gray-400'>
              {companies.length} companies
            </div>
          </div>

          {companies.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 text-sm">No company data available</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {companies.map((company, index) => (
                <div 
                  key={index} 
                  className="group bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200 border border-transparent hover:border-gray-200"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{company.logo || '🏢'}</span>
                    <h3 className="font-medium text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
                      {company.name}
                    </h3>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">
                      <span className="font-medium text-gray-700">{company.studentsPlaced}</span> placed
                    </p>
                    <p className="text-xs text-gray-500">
                      Avg: <span className="font-medium text-gray-700">{company.avgPackage}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Students Table */}
        <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6'>
            <div>
              <h2 className='text-lg font-semibold text-gray-900'>
                Top 5 Placed Students
              </h2>
              <p className='text-sm text-gray-400 mt-1'>
                Find details of students placed in various companies
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, company or department..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50 transition-all"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-400" />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-4 py-2.5 pr-8 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236B7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px] bg-no-repeat bg-[right_1rem_center]"
              >
                <option value="All">All Years</option>
                {[2019, 2020, 2021, 2022, 2023, 2024, 2025].map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className='border-b border-gray-200'>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Department</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Year</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topPlacers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-400 text-sm">
                      No students found matching your search criteria
                    </td>
                  </tr>
                ) : (
                  topPlacers.map((student, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className='w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600'>
                            {student.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                          </span>
                          <span className="text-sm font-medium text-gray-900">{student.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-blue-600">{student.company}</span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-sm text-gray-600">{student.department}</span>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-sm text-gray-500">{student.year}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-semibold text-gray-900">₹{student.package} LPA</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Placements;