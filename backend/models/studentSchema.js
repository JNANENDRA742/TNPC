const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
      unique: true,
    },
    studentId: {
      type: String,
      unique: true,
      sparse: true, // Allows null/undefined values
      trim: true,
      // No required: true - student sets this after login
    },
    year: {
      type: String,
      default: "",
    },
    eligible_drives: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CompanyDrives",
      },
    ],
    applied_drives: {
      type: [
        {
          drive: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CompanyDrives",
          },
          appliedAt: {
            type: Date,
            default: Date.now,
          },
          status: {
            type: String,
            enum: ["pending", "reviewed", "rejected", "shortlisted"],
            default: "pending",
          },
        },
      ],
      default: [],
    },
    shortlisted_drives: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CompanyDrives",
      },
    ],
    profile: {
      cgpa: {
        type: Number,
        default: 0,
        min: 0,
        max: 10,
      },
      skills: {
        type: [String],
        default: [],
      },
      gender:{
        type: String,
        default: "",
        enum: ["", "Male", "Female", "Other"],
      },
      projects: {
        type: [String],
        default: [],
      },
      phone: {
        type: String,
        default: "",
      },
      department: {
        type: String,
        default: "",
      },
      bio: {
        type: String,
        default: "",
      },
      linkedin: {
        type: String,
        default: "",
      },
      github: {
        type: String,
        default: "",
      },
      portfolio: {
        type: String,
        default: "",
      },
      address: {
        type: String,
        default: "",
      },
      dateOfBirth: {
        type: String,
        default: "",
      },
      gender: {
        type: String,
        default: "",
        enum: ["", "Male", "Female", "Other"],
      },
      bloodGroup: {
        type: String,
        default: "",
        enum: ["", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      },
      profilePicture: {
        type: String,
        default: "",
      },
      profilePictureFileType: {
        type: String,
        default: "",
      },
      resume: {
        type: String,
        default: "",
      },
      resumeFileType: {
        type: String,
        default: "",
      },
      resumeFileName: {
        type: String,
        default: "",
      },
    },
  },
  { timestamps: true }
);



module.exports = mongoose.model("StudentProfile", studentProfileSchema);