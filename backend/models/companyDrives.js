const mongoose = require('mongoose');

const companyDrivesSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: [true, 'Company name is required'],
        trim: true
    },
    roles: {
        type: String,
        required: [true, 'Roles are required'],
        trim: true
    },
    package: {
        type: String,
        default: 'Not Disclosed'
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true
    },
    date: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ['upcoming', 'ongoing', 'completed'],
        default: 'upcoming'
    },
    description: {
        type: String,
        default: ''
    },
    eligibility: {
        type: String,
        default: ''
    },
    googleFormLink:{
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: 'On-Campus'
    },
    studentsSelected: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true // This automatically adds createdAt and updatedAt
});

// If you need pre-save middleware, use this pattern:
companyDrivesSchema.pre('save', function(next) {
    // Only run if next is a function
    if (next && typeof next === 'function') {
        next();
    }
    // If next is not a function, just continue
});

// OR - completely remove the pre-save middleware since timestamps handles it

const CompanyDrives = mongoose.model('CompanyDrives', companyDrivesSchema);

module.exports = CompanyDrives;