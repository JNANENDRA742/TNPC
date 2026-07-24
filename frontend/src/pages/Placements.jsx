import React, { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, Legend, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Search, Filter, Rocket } from "lucide-react";
import axios from 'axios';
import { useAlert } from '../components/Alert';
import { LuGraduationCap } from 'react-icons/lu';
import LoadingAnimation from '../components/LoadingAnimation';

const Placements = () => {
  // ALL HOOKS MUST BE DECLARED FIRST - BEFORE ANY CONDITIONAL RETURNS
  const { showAlert, AlertComponent } = useAlert();

  const [yearlyPlacements, setYearlyPlacements] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [placedStudents, setPlacedStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [campusStats, setCampusStats] = useState({ onCampus: {}, offCampus: {} });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedYear, setSelectedYear] = useState("All");

  // useEffect must also be declared before conditional returns
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
  }, []); // Empty dependency array means this runs once on mount

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-[400px]">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
  //         <p className="mt-4 text-gray-500">Loading placements page please wait...</p>
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
                <Rocket className="w-8 h-8 text-blue-600 animate-pulse" />
              </div>
            </div>
            <p className="mt-6 text-lg font-semibold text-gray-700">Loading Placements Page ...</p>
            <p className="text-sm text-gray-400 mt-1">Please wait a moment . . .</p>
          </div>
        </div>
      );
    }
  // Rest of your component logic (this runs only when loading is false)
  const COLORS = ["hsl(215, 65%, 18%)", "hsl(45, 70%, 52%)"];

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

  return (
    <section className='min-h-screen w-full py-10 px-5'>
      {AlertComponent}
      {/* Rest of your JSX */}
      <div className='container mx-auto section-padding bg-[#024a70] px-10 py-16 rounded-xl mb-10'>
        <h1 className='text-3xl text-white sm:text-2xl font-bold'>Placements Record</h1>
        <p className='text-md text-white'>Year-wise and company-wise placement statistics from 2019 to 2025.</p>
      </div>

      <div className='grid sm:grid-cols-1 md:grid-cols-2 gap-6 p-6'>
        {/* Pie Chart Card */}
        <div className='bg-gray-100 rounded-xl shadow-md shadow-gray-300 p-6 flex flex-col justify-between'>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Placement Distribution
          </h2>

          {pieData.length === 0 ? (
            <div className="flex items-center justify-center h-[280px]">
              <p className="text-gray-500">No placement data available</p>
            </div>
          ) : (
            <div className='w-full flex-1 flex items-center justify-center'>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={pieData}
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 13 }} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Bar Chart Card */}
        <div className='bg-gray-100 rounded-xl shadow-md shadow-gray-300 p-6 flex flex-col justify-between'>
          <h2 className="text-2xl font-bold mb-2 text-gray-800">
            Students Placed Per Year
          </h2>

          <p className="text-sm text-gray-600 mb-4">
            Placement data for each academic year.
          </p>

          {yearlyPlacements.length === 0 ? (
            <div className="flex items-center justify-center h-[280px]">
              <p className="text-gray-500">No yearly data available</p>
            </div>
          ) : (
            <div className='w-full flex-1'>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={yearlyPlacements}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" tick={{ fontSize: 13 }} />
                  <YAxis tick={{ fontSize: 13 }} />

                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid #ccc",
                      backgroundColor: "#fff",
                      padding: "10px"
                    }}
                    formatter={(value, name) => [
                      `${value} students`,
                      name === "totalPlaced" ? "Placed" : "Total"
                    ]}
                  />

                  <Bar
                    dataKey="totalPlaced"
                    fill="hsl(215, 65%, 18%)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* company cards List */}
      <div className='pt-14 container mx-auto section-padding'>
        <h2 className="text-2xl font-display font-bold text-foreground mb-6 py-4 px-2">Top Recruiting Companies</h2>
        {companies.length === 0 ? (
          <div className="text-center py-8 bg-gray-100 rounded-xl">
            <p className="text-gray-500">No company data available</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {companies.map((company, index) => (
              <div key={index} className="bg-gray-100 hover:bg-blue-100 mb-10 flex flex-col items-center justify-center flex-wrap rounded-xl p-6 shadow-md border-l-4 border-l-blue-400 border-b-4 border-b-blue-900 shadow-gray-300 hover:scale-105 transition-all duration-500">
                <p className="text-2xl mb-2">{company.logo}</p>
                <h3 className="text-lg font-semibold text-foreground mb-2">{company.name}</h3>
                <p className="text-sm text-muted-foreground mb-1">Students Placed: {company.studentsPlaced}</p>
                <p className="text-sm text-muted-foreground">Average Salary: {company.avgPackage}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Marquee Section */}
      <div className="py-4 md:py-6 container mx-auto section-padding mb-8 md:mb-10 overflow-hidden">
        <div className="relative w-full">
          <div className="absolute left-0 top-0 bottom-0 w-8 md:w-12 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-8 md:w-12 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>

          {companies.length > 0 ? (
            <marquee
              className="text-xs sm:text-sm text-muted-foreground"
              behavior="scroll"
              direction="left"
              scrollamount="10"
              onMouseEnter={(e) => e.target.stop()}
              onMouseLeave={(e) => e.target.start()}
              loop={true}
            >
              <div className='flex items-center gap-4 sm:gap-6 md:gap-18 py-2'>
                {companies.map((company, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center gap-1 sm:gap-2 flex-shrink-0"
                  >
                    <span className="sm:text-xs md:text-lg font-bold whitespace-nowrap">
                      {company.name}
                    </span>
                  </div>
                ))}
              </div>
            </marquee>
          ) : (
            <p className="text-center text-gray-500 py-2">No companies to display</p>
          )}
        </div>
      </div>

      {/* searching placed students */}
      <section className='py-14 container mx-auto section-padding'>
        <h2 className="text-2xl font-display font-bold text-foreground mb-6">Search top 5 Placed Students</h2>
        <p className="text-md text-gray-700 mb-4">Find details of students placed in various companies.</p>
        <div className="bg-card rounded-xl p-6 shadow-lg shadow-gray-300">

          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 items-center">
              <Search size={30} className="absolute left-3 top-1 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, company or department. . . ."
                className="w-full text-left mb-4 px-14 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <Filter size={30} className="text-muted-foreground" />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="cursor-pointer ml-2 px-3 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="All">All Years</option>
                {[2019, 2020, 2021, 2022, 2023, 2024, 2025].map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="rounded-xl border border-border/50 overflow-hidden shadow-sm">
            <div className='overflow-x-auto'>
              <table className="w-full table-auto">
                <thead>
                  <tr className='bg-gray-200'>
                    <th className="px-4 py-4 text-left text-sm font-medium text-muted-foreground border-b border-gray-400">Name</th>
                    <th className="px-4 py-4 text-left text-sm font-medium text-muted-foreground border-b border-gray-400">Company</th>
                    <th className="px-4 py-4 text-left text-sm font-medium text-muted-foreground border-b border-gray-400">Department</th>
                    <th className="px-4 py-4 text-left text-sm font-medium text-muted-foreground border-b border-gray-400">Year</th>
                    <th className="px-4 py-4 text-left text-sm font-medium text-muted-foreground border-b border-gray-400">Package (LPA)</th>
                  </tr>
                </thead>
                <tbody>
                  {topPlacers.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-8 text-gray-500">
                        No students found matching your search criteria
                      </td>
                    </tr>
                  ) : (
                    topPlacers.map((student, index) => (
                      <tr key={index} className="group hover:bg-gray-100 transition-colors duration-300">
                        <td className="px-4 py-4 border-t border-gray-200 flex gap-2 items-center">
                          <span className='w-10 h-10 rounded-full bg-gray-300 p-2 flex items-center justify-center group-hover:bg-blue-400 group-hover:text-white transition-all duration-300'>
                            {student.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                          </span>
                          {student.name}
                        </td>
                        <td className="px-4 py-4 border-t border-gray-200 text-blue-500">{student.company}</td>
                        <td className="px-4 py-4 border-t border-gray-200">{student.department}</td>
                        <td className="px-4 py-4 border-t border-gray-200">{student.year}</td>
                        <td className="px-4 py-4 border-t border-gray-200 font-semibold">₹ {student.package}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </section>
  )
}

export default Placements;