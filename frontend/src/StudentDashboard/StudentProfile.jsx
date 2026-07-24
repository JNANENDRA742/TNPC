import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import campus from "../assets/campus.webp"
import axios from 'axios';
import {
  User, Mail, Phone, BookOpen, Code, Award, Calendar, CheckCircle,
  Clock, TrendingUp, Briefcase, FileText, Download, Edit,
  Save, X, Plus, Trash2, Upload, Camera, MapPin, Linkedin,
  Github, Twitter, Globe, Shield, Star, Zap, Target, Heart,
  GraduationCap, Building, Calendar as CalendarIcon, Mail as MailIcon,
  Phone as PhoneIcon, Map as MapIcon, Trophy, Medal, Sparkles,
  Users, Coffee, Smile, ThumbsUp, Eye, Lock, Bell, Moon, Sun, Share2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAlert } from '../components/Alert';
import LoadingAnimation from '../components/LoadingAnimation';
import StudentProfileSkeleton from './components/StudentProfileSkeleton';

const StudentProfile = ({ user }) => {
  const { id } = useParams();
  const { showAlert, AlertComponent } = useAlert();

  console.log("StudentProfile - URL param id:", id);
  console.log("StudentProfile - user prop:", user);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showSkillInput, setShowSkillInput] = useState(false);
  const [showProjectInput, setShowProjectInput] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newProject, setNewProject] = useState('');
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);
  const [resumeUrl, setResumeUrl] = useState(null);
  const [year, setYear] = useState(null);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    studentId: '',
    profile: {
      phone: '',
      department: '',
      cgpa: 0,
      skills: [],
      projects: [],
      resume: '',
      resumeFileType: '',
      resumeFileName: '',
      bio: '',
      linkedin: '',
      github: '',
      portfolio: '',
      address: '',
      dateOfBirth: '',
      gender: '',
      bloodGroup: '',
      profilePicture: '',
      profilePictureFileType: ''
    }
  });
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchProfile();
  }, [id]);

  useEffect(() => {
    showAlert("You can Edit your profile here", "info", 4000);
  }, [])

  useEffect(() => {
    if (!profileData.year) {
      findYear();
    }
  }, [profileData.year]);

  const findYear = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/studentyear/${id}`);
      setYear(res.data.year);
      console.log("Student year fetched:", res.data.year);
    } catch (error) {
      console.error('Error fetching student year:', error);
      showAlert("Error fetching student year ❌: " + (error.response?.data?.message || error.message), "error", 5000);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/studentprofile/${id}`);
      const data = response.data;

      console.log("Fetched profile data:", data);

      // Set profile picture URL if exists
      if (data.profile?.profilePicture) {
        setProfilePictureUrl(`${import.meta.env.VITE_BACKEND_URL}/getProfilePicture/${id}`);
      }

      // Set resume URL if exists
      if (data.profile?.resume) {
        setResumeUrl(`${import.meta.env.VITE_BACKEND_URL}/getResume/${id}`);
      }

      setProfileData(data);
      setFormData(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      showAlert('Failed to load profile data. Please refresh the page.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setFormData(profileData);
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData(profileData);
    setShowSkillInput(false);
    setShowProjectInput(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Make sure formData has the latest profile picture and resume info
      const dataToSave = {
        ...formData,
        profile: {
          ...formData.profile,
          profilePicture: formData.profile?.profilePicture || profileData.profile?.profilePicture,
          profilePictureFileType: formData.profile?.profilePictureFileType || profileData.profile?.profilePictureFileType,
          resume: formData.profile?.resume || profileData.profile?.resume,
          resumeFileType: formData.profile?.resumeFileType || profileData.profile?.resumeFileType,
          resumeFileName: formData.profile?.resumeFileName || profileData.profile?.resumeFileName
        }
      };

      const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/studentprofile/${id}`, dataToSave);
      console.log("Save response:", response.data);

      setProfileData(dataToSave);
      setEditing(false);
      showAlert('✅ Profile updated successfully!', 'success', 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      showAlert(error.response?.data?.message || 'Failed to update profile', 'error', 4000);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e, section, field) => {
    if (section) {
      // For profile fields
      setFormData({
        ...formData,
        profile: {
          ...formData.profile,
          [field]: e.target.value
        }
      });
    } else {
      // For root level fields like name, email, year
      setFormData({
        ...formData,
        [field]: e.target.value
      });
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.profile.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        profile: {
          ...formData.profile,
          skills: [...formData.profile.skills, newSkill.trim()]
        }
      });
      setNewSkill('');
      setShowSkillInput(false);
      showAlert('✅ Skill added successfully!', 'success', 2000);
    } else if (newSkill.trim() && formData.profile.skills.includes(newSkill.trim())) {
      showAlert('⚠️ Skill already exists!', 'warning', 2000);
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      profile: {
        ...formData.profile,
        skills: formData.profile.skills.filter(skill => skill !== skillToRemove)
      }
    });
    showAlert('🗑️ Skill removed', 'info', 1500);
  };

  const addProject = () => {
    if (newProject.trim() && !formData.profile.projects.includes(newProject.trim())) {
      setFormData({
        ...formData,
        profile: {
          ...formData.profile,
          projects: [...formData.profile.projects, newProject.trim()]
        }
      });
      setNewProject('');
      setShowProjectInput(false);
      showAlert('✅ Project added successfully!', 'success', 2000);
    } else if (newProject.trim() && formData.profile.projects.includes(newProject.trim())) {
      showAlert('⚠️ Project already exists!', 'warning', 2000);
    }
  };

  const removeProject = (projectToRemove) => {
    setFormData({
      ...formData,
      profile: {
        ...formData.profile,
        projects: formData.profile.projects.filter(project => project !== projectToRemove)
      }
    });
    showAlert('🗑️ Project removed', 'info', 1500);
  };

  // Handle profile picture upload to MongoDB
  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // File validation
    if (!file.type.startsWith('image/')) {
      showAlert('❌ Please upload an image file', 'error', 3000);
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      showAlert('❌ File size should be less than 10MB', 'error', 3000);
      return;
    }

    const uploadFormData = new FormData();
    uploadFormData.append("profilePicture", file);

    try {
      console.log("Uploading profile picture for user:", id);

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/uploadProfilePicture/${id}`,
        uploadFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Upload response:", response.data);

      // Update profile picture URL with cache busting
      setProfilePictureUrl(`${import.meta.env.VITE_BACKEND_URL}/getProfilePicture/${id}?t=${Date.now()}`);

      // Update BOTH profileData AND formData
      const updatedProfileData = {
        ...profileData,
        profile: {
          ...profileData.profile,
          profilePicture: response.data.profilePicture,
          profilePictureFileType: response.data.fileType || file.type
        },
      };

      const updatedFormData = {
        ...formData,
        profile: {
          ...formData.profile,
          profilePicture: response.data.profilePicture,
          profilePictureFileType: response.data.fileType || file.type
        },
      };

      setProfileData(updatedProfileData);
      setFormData(updatedFormData);

      showAlert('✅ Profile picture uploaded successfully!', 'success', 3000);

    } catch (error) {
      console.error("Upload error:", error);
      showAlert(error.response?.data?.message || "Upload failed. Please try again.", 'error', 4000);
    }
  };

  // Handle resume upload to MongoDB
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // File validation
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      showAlert('❌ Please upload a PDF, DOC, or DOCX file', 'error', 3000);
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      showAlert('❌ File size should be less than 5MB', 'error', 3000);
      return;
    }

    const uploadFormData = new FormData();
    uploadFormData.append("resume", file);

    try {
      console.log("Uploading resume for user:", id);

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/uploadResume/${id}`,
        uploadFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Upload response:", response.data);

      // Update resume URL with cache busting
      setResumeUrl(`${import.meta.env.VITE_BACKEND_URL}/getResume/${id}?t=${Date.now()}`);

      // Update BOTH profileData AND formData
      const updatedProfileData = {
        ...profileData,
        profile: {
          ...profileData.profile,
          resume: response.data.resume,
          resumeFileType: response.data.fileType || file.type,
          resumeFileName: response.data.fileName || file.name
        },
      };

      const updatedFormData = {
        ...formData,
        profile: {
          ...formData.profile,
          resume: response.data.resume,
          resumeFileType: response.data.fileType || file.type,
          resumeFileName: response.data.fileName || file.name
        },
      };

      setProfileData(updatedProfileData);
      setFormData(updatedFormData);

      showAlert('✅ Resume uploaded successfully!', 'success', 3000);

    } catch (error) {
      console.error("Upload error:", error);
      showAlert(error.response?.data?.message || "Upload failed. Please try again.", 'error', 4000);
    }
  };

  if (loading) {
    return (
      // <LoadingAnimation variant='premium' message="Loading Your profile details..."
      //   subMessage="Preparing your data"
      //   type="students"
      // />
      <StudentProfileSkeleton />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Alert Component */}
      {AlertComponent}

      {/* Hero Section with Cover Photo */}
      <div className="relative h-40 md:h-56 rounded-b-3xl rounded-t-lg flex items-center justify-center overflow-hidden">
        <img src={campus} alt="Campus" className="w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="relative px-6 py-8 md:p-8">
            {/* Avatar Section */}
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
              <div className="relative">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-xl">
                  {profilePictureUrl ? (
                    <img
                      src={profilePictureUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '';
                        e.target.parentElement.innerHTML = `
                          <div class="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                            <span class="text-5xl text-white font-bold">${profileData.name?.charAt(0) || '?'}</span>
                          </div>
                        `;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                      <span className="text-5xl text-white font-bold">
                        {profileData.name?.charAt(0) || '?'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Upload button always visible for profile picture */}
                <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow-lg hover:bg-blue-700 transition">
                  <Camera className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePictureUpload}
                  />
                </label>
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{profileData.name}</h1>
                    <p className="text-gray-500 mt-1 flex items-center justify-center md:justify-start gap-2">
                      <GraduationCap className="w-4 h-4" />
                      {profileData.profile?.department} • {profileData.studentId}
                    </p>
                  </div>

                  {!editing ? (
                    <button
                      onClick={handleEdit}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 shadow-md"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        onClick={handleCancel}
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition flex items-center gap-2"
                        disabled={saving}
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                        disabled={saving}
                      >
                        {saving ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:my-6 sm:m-6 sm:p-6">
          {/* Left Column - Personal Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Personal Information Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Personal Information
              </h2>

              <div className="space-y-4">
                {/* Email - Read Only */}
                <div className="flex items-start gap-3">
                  <MailIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="text-gray-900 font-medium">{profileData.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <PhoneIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Phone Number</p>
                    {editing ? (
                      <input
                        type="tel"
                        value={formData.profile?.phone || ''}
                        onChange={(e) => handleChange(e, true, 'phone')}
                        className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{profileData.profile?.phone || 'Not added'}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CalendarIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Date of Birth</p>
                    {editing ? (
                      <input
                        type="date"
                        value={formData.profile?.dateOfBirth || ''}
                        onChange={(e) => handleChange(e, true, 'dateOfBirth')}
                        className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{profileData.profile?.dateOfBirth || 'Not added'}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Address</p>
                    {editing ? (
                      <textarea
                        value={formData.profile?.address || ''}
                        onChange={(e) => handleChange(e, true, 'address')}
                        rows="2"
                        className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{profileData.profile?.address || 'Not added'}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Academic Information Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-green-600" />
                Academic Details
              </h2>

              <div className="space-y-4">
                {/* CGPA - Editable */}
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 text-gray-400 mt-0.5 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Current CGPA</p>
                    {editing ? (
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="10"
                        value={formData.profile?.cgpa || 0}
                        onChange={(e) => handleChange(e, true, 'cgpa')}
                        className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-2xl font-bold text-blue-600">{profileData.profile?.cgpa || '0.00'}</span>
                        <span className="text-sm text-gray-400">/ 10</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Department - Read Only */}
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 text-gray-400 mt-0.5 flex items-center justify-center">
                    <Building className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="text-gray-900 font-medium mt-1">{profileData.profile?.department || 'Not specified'}</p>
                  </div>
                </div>

                {/* Year - Read Only */}
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 text-gray-400 mt-0.5 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Year of Study</p>
                    <p className="text-gray-900 font-medium mt-1">{year || 'Not mentioned'}</p>
                  </div>
                </div>

                {/* Student ID - Read Only */}
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 text-gray-400 mt-0.5 flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Student ID</p>
                    <p className="text-gray-900 font-medium mt-1">{profileData.studentId || 'Not assigned'}</p>
                  </div>
                </div>

                {/* CGPA Progress Bar */}
                <div className="bg-green-50 rounded-xl p-3 border border-green-200/50">
                  <p className="text-xs text-gray-500 font-medium">CGPA Status</p>
                  <p className={`text-sm font-bold mt-0.5 ${(profileData.profile?.cgpa || 0) >= 8 ? 'text-green-600' : (profileData.profile?.cgpa || 0) >= 6 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {(profileData.profile?.cgpa || 0) >= 8 ? '🌟 Excellent' :
                      (profileData.profile?.cgpa || 0) >= 6 ? '📈 Good' :
                        (profileData.profile?.cgpa || 0) >= 4 ? '📚 Average' : '⚠️ Needs Improvement'}
                  </p>
                </div>
              </div>
            </div>

            {/* Social Links Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-10">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Share2 className="w-5 h-5 text-purple-600" />
                Social Profiles
              </h2>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Linkedin className="w-5 h-5 text-blue-700" />
                  {editing ? (
                    <input
                      type="url"
                      placeholder="LinkedIn URL"
                      value={formData.profile?.linkedin || ''}
                      onChange={(e) => handleChange(e, true, 'linkedin')}
                      className="flex-1 px-3 py-2 border rounded-lg"
                    />
                  ) : (
                    profileData.profile?.linkedin ? (
                      <a href={profileData.profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">LinkedIn Profile</a>
                    ) : (
                      <span className="text-gray-400">Not added</span>
                    )
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Github className="w-5 h-5 text-gray-800" />
                  {editing ? (
                    <input
                      type="url"
                      placeholder="GitHub URL"
                      value={formData.profile?.github || ''}
                      onChange={(e) => handleChange(e, true, 'github')}
                      className="flex-1 px-3 py-2 border rounded-lg"
                    />
                  ) : (
                    profileData.profile?.github ? (
                      <a href={profileData.profile.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">GitHub Profile</a>
                    ) : (
                      <span className="text-gray-500">Not added</span>
                    )
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-green-600" />
                  {editing ? (
                    <input
                      type="url"
                      placeholder="Portfolio Website"
                      value={formData.profile?.portfolio || ''}
                      onChange={(e) => handleChange(e, true, 'portfolio')}
                      className="flex-1 px-3 py-2 border rounded-lg"
                    />
                  ) : (
                    profileData.profile?.portfolio ? (
                      <a href={profileData.profile.portfolio} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Portfolio</a>
                    ) : (
                      <span className="text-gray-400">Not added</span>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Skills, Projects, Bio */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Smile className="w-5 h-5 text-orange-600" />
                About Me
              </h2>
              {editing ? (
                <textarea
                  value={formData.profile?.bio || ''}
                  onChange={(e) => handleChange(e, true, 'bio')}
                  rows="4"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell us about yourself, your interests, and career goals..."
                />
              ) : (
                <p className="text-gray-700 leading-relaxed">
                  {profileData.profile?.bio || 'No bio added yet. Click edit to add your personal introduction.'}
                </p>
              )}
            </div>

            {/* Skills Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Code className="w-5 h-5 text-purple-600" />
                  Technical Skills
                </h2>
                {editing && !showSkillInput && (
                  <button
                    onClick={() => setShowSkillInput(true)}
                    className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add Skill
                  </button>
                )}
              </div>

              {showSkillInput && editing && (
                <div className="mb-4 flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Enter skill name"
                    className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  />
                  <button onClick={addSkill} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Add</button>
                  <button onClick={() => setShowSkillInput(false)} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {(editing ? formData.profile?.skills : profileData.profile?.skills)?.map((skill, index) => (
                  <motion.span
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="group relative px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-300 rounded-full text-sm flex items-center gap-2 shadow-md"
                  >
                    {skill}
                    {editing && (
                      <button
                        onClick={() => removeSkill(skill)}
                        className="hover:bg-white/20 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </motion.span>
                ))}
                {(!editing && (!profileData.profile?.skills || profileData.profile.skills.length === 0)) && (
                  <p className="text-gray-400">No skills added yet</p>
                )}
              </div>
            </div>

            {/* Projects Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-600" />
                  Projects
                </h2>
                {editing && !showProjectInput && (
                  <button
                    onClick={() => setShowProjectInput(true)}
                    className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add Project
                  </button>
                )}
              </div>

              {showProjectInput && editing && (
                <div className="mb-4 flex gap-2">
                  <input
                    type="text"
                    value={newProject}
                    onChange={(e) => setNewProject(e.target.value)}
                    placeholder="Enter project name"
                    className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && addProject()}
                  />
                  <button onClick={addProject} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Add</button>
                  <button onClick={() => setShowProjectInput(false)} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(editing ? formData.profile?.projects : profileData.profile?.projects)?.map((project, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-r from-gray-100 to-gray-300 rounded-lg p-4 relative group hover:shadow-md transition overflow-hidden"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Target className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{project}</h3>
                        </div>
                      </div>
                      {editing && (
                        <button
                          onClick={() => removeProject(project)}
                          className="opacity-0 group-hover:opacity-100 transition text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className='absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700'></div>
                  </motion.div>
                ))}
              </div>
              {(!editing && (!profileData.profile?.projects || profileData.profile.projects.length === 0)) && (
                <p className="text-gray-400 text-center py-4">No projects added yet</p>
              )}
            </div>

            {/* Resume Card - Updated for MongoDB */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-red-600" />
                Resume / CV
              </h2>

              {resumeUrl ? (
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-10 h-10 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">Resume Uploaded</p>
                      <p className="text-sm text-gray-500">
                        {profileData.profile?.resumeFileName || 'Resume file'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a href={resumeUrl}
                      download={profileData.profile?.resumeFileName || 'resume'}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center p-8 bg-gray-50 rounded-lg">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No resume uploaded yet</p>
                </div>
              )}

              {/* Upload button always visible */}
              <div className="mt-4">
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer">
                  <Upload className="w-4 h-4" />
                  {resumeUrl ? 'Update Resume' : 'Upload Resume'}
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeUpload}
                  />
                </label>
                <p className="text-xs text-gray-400 mt-2">PDF, DOC, or DOCX</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default StudentProfile;