const mongoose = require('mongoose');

const yearlyPlacementsSchema = new mongoose.Schema({
    year: {
        type: Number,
        required: true,
        unique: true
    },
    totalPlaced: {
        type: Number,
        required: true,
        default: 0
    },
    totalCompanies: {
        type: Number,
        default: 0
    },
    highestPackage: {
        type: Number,
        default: 0
    },
    averagePackage: { 
        type: Number,
        default: 0
    },
    totalStudents: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('YearlyPlacements', yearlyPlacementsSchema);