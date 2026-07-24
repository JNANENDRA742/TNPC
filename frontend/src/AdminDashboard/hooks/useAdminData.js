// src/AdminDashboard/hooks/useAdminData.js

import { useState, useEffect } from "react";
import axios from "axios";

export const useAdminData = () => {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [drives, setDrives] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalDrives: 0,
    totalPlacements: 0,
    activeDrives: 0,
    placementRate: 0,
    avgPackage: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [studentsRes, drivesRes, placementsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/students`),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/companydrives`),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/placedStudents`),
      ]);

      setStudents(studentsRes.data);
      setDrives(drivesRes.data);
      console.log("📊 Drives response:", drivesRes.data);

      // Sort placements by package
      const sortedPlacements = placementsRes.data.sort(
        (a, b) => (parseFloat(b.package) || 0) - (parseFloat(a.package) || 0),
      );
      setPlacements(sortedPlacements);

      const activeDrives = drivesRes.data.filter(
        (d) => d.status === "upcoming" || d.status === "ongoing",
      ).length;
      const totalPlacements = placementsRes.data.length;
      const avgPackage =
        totalPlacements > 0
          ? placementsRes.data.reduce(
              (acc, p) => acc + (parseFloat(p.package) || 0),
              0,
            ) / totalPlacements
          : 0;
      const totalStudents = studentsRes.data.length;

      setStats({
        totalStudents: totalStudents,
        totalDrives: drivesRes.data.length,
        totalPlacements: totalPlacements,
        activeDrives: activeDrives,
        placementRate:
          totalStudents > 0
            ? ((totalPlacements / totalStudents) * 100).toFixed(1)
            : "0",
        avgPackage: avgPackage.toFixed(1),
      });

      // Fetch recent activities with the data
      await fetchRecentActivities(
        studentsRes.data,
        placementsRes.data,
        drivesRes.data,
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // NEW: Refresh activities using current data
  const refreshActivities = async () => {
    try {
      console.log("🔄 Refreshing activities...");
      
      // Fetch fresh data
      const [studentsRes, drivesRes, placementsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/students`),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/companydrives`),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/placedStudents`),
      ]);

      // Update state with fresh data
      setStudents(studentsRes.data);
      setDrives(drivesRes.data);
      
      const sortedPlacements = placementsRes.data.sort(
        (a, b) => (parseFloat(b.package) || 0) - (parseFloat(a.package) || 0),
      );
      setPlacements(sortedPlacements);

      // Generate activities from fresh data
      await fetchRecentActivities(
        studentsRes.data,
        placementsRes.data,
        drivesRes.data,
      );
      
      console.log("✅ Activities refreshed successfully");
    } catch (error) {
      console.error("Error refreshing activities:", error);
    }
  };

  const fetchRecentActivities = async (
    studentsData,
    placementsData,
    drivesData,
  ) => {
    try {
      console.log("📊 Fetching activities with data:", {
        students: studentsData?.length,
        placements: placementsData?.length,
        drives: drivesData?.length,
      });

      // Debug: Log the first placement to see what fields are available
      if (placementsData && placementsData.length > 0) {
        console.log(
          "📊 First placement fields:",
          Object.keys(placementsData[0]),
        );
        console.log(
          "📊 First placement createdAt:",
          placementsData[0].createdAt,
        );
        console.log("📊 Full first placement:", placementsData[0]);
      }

      const activities = [];

      // Student registrations with department info
      studentsData?.forEach((student) => {
        const createdAt = student.createdAt || student.student?.createdAt;
        if (createdAt) {
          activities.push({
            id: `student_${student._id}`,
            type: "student_registered",
            title: "New student registered",
            description: `${student.student?.name || student.name || "Student"} joined as a student`,
            department: student.profile?.department || "Not Specified",
            timestamp: new Date(createdAt),
          });
        }
      });

      // Placement additions
      placementsData?.forEach((placement) => {
        let createdAt = placement.createdAt;

        if (!createdAt) {
          createdAt = placement.updatedAt;
        }

        if (!createdAt) {
          console.warn(
            "⚠️ Placement without createdAt:",
            placement._id,
            placement.name,
          );
          if (
            placement._id &&
            placement._id.toString().match(/^[0-9a-fA-F]{24}$/)
          ) {
            const timestamp =
              parseInt(placement._id.toString().substring(0, 8), 16) * 1000;
            createdAt = new Date(timestamp);
            console.log("📊 Using ObjectId timestamp:", createdAt);
          } else {
            createdAt = new Date();
          }
        }

        const timestamp = new Date(createdAt);
        console.log(
          `📊 Placement ${placement.name}: createdAt=${createdAt}, timestamp=${timestamp}`,
        );

        activities.push({
          id: `placement_${placement._id || placement.id}`,
          type: "placement_added",
          title: "New placement recorded",
          description: `${placement.name || "Student"} placed at ${placement.company || "Company"} with ${placement.package || "0"} LPA`,
          department: placement.department || "Not Specified",
          timestamp: timestamp,
        });
      });

      // Drive additions
      drivesData?.forEach((drive) => {
        const createdAt = drive.createdAt;
        if (createdAt) {
          activities.push({
            id: `drive_${drive._id}`,
            type: "drive_added",
            title: "New company drive added",
            description: `${drive.companyName || "Company"} is hiring for ${drive.roles || "various roles"}`,
            department: "",
            timestamp: new Date(createdAt),
          });
        }
      });

      // Sort by timestamp (newest first)
      activities.sort((a, b) => b.timestamp - a.timestamp);
      console.log("📊 Activities generated:", activities.length);

      // Log the first few activities with their timestamps
      if (activities.length > 0) {
        console.log("📊 First 3 activities:");
        activities.slice(0, 3).forEach((a, i) => {
          console.log(`  ${i + 1}. ${a.title}: ${a.timestamp.toISOString()}`);
        });
      }

      setRecentActivities(activities.slice(0, 20000));
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return {
    loading,
    students,
    drives,
    placements,
    stats,
    recentActivities,
    fetchAllData,
    fetchRecentActivities,
    refreshActivities, //  Export refresh function
    setStudents,
    setDrives,
    setPlacements,
    setStats,
  };
};