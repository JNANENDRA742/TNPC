import React, { useEffect, useState } from 'react';
import { Menu, Bell, User } from 'lucide-react';
import axios from 'axios';

const StudentNavbar = ({ user, sidebarOpen, setSidebarOpen }) => {
  const id = user?.id;
  const [details, setDetails] = useState({
    name: "",
    email: "",
    id: "",
    department: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) {
        console.log("No user ID found");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/studentprofile/${id}`);
        const data = res.data;

        setDetails({
          name: data.name || "Student",
          email: data.email || "",
          id: data.studentId || id,
          department: data.profile?.department || "Not Specified",
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <header className="bg-white shadow-sm w-full px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg">
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Placement Portal
          </h1>
        </div>
        <div className="animate-pulse text-gray-400 text-sm">Loading...</div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-30 w-full">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        {/* Left section */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent hidden sm:block">
            Placement Portal
          </h1>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3 sm:gap-4">
          

          {/* User Info */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-800">{details.name}</p>
              <p className="text-xs text-gray-500">{details.department}</p>
            </div>
            <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
              {details.name ? details.name.charAt(0).toUpperCase() : "?"}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default StudentNavbar;