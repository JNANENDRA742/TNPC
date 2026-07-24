import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Placements from "./pages/Placements";
import 'leaflet/dist/leaflet.css';
import Departments from "./pages/Departments";
import Drives from "./pages/Drives";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import { useState } from "react";
import Dashboard from "./StudentDashboard/Dashboard";
import AdminDashboard from "./AdminDashboard/AdminDashboard";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [user, setUser] = useState({
    isLogin: false,
    role: "",
    name: "",
    id: ""
  });
  

  
  return (
    <>
      {!user.isLogin && (
        <Navbar user={user} setUser={setUser} />
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/placements" element={<Placements />} />
        <Route path="/departments" element={<Departments />} />
        <Route path="/drives" element={<Drives />} />
        <Route
          path="/login"
          element={<Login user={user} setUser={setUser} />}
        />
        <Route
          path="/signup"
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
              <Signup />
            </div>
          }
        />
        <Route
          path="/studentprofile/*"
          element={<Dashboard user={user} setUser={setUser} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}
        />
        <Route path="/admin/*" element={<AdminDashboard user={user} setUser={setUser} />} />
      </Routes>

      {!user.isLogin && <Footer />}
    </>
  );
}

export default App;