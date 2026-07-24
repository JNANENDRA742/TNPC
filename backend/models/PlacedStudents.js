// models/PlacedStudents.js
const mongoose = require('mongoose');

const placedStudentsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    company: {
        type: String,
        required: true,
        trim: true
    },
    package: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true,
        trim: true
    },
    year: {
        type: Number,
        required: true,
        default: () => new Date().getFullYear()
    }
}, {
    timestamps: true // This adds createdAt and updatedAt
});

const PlacedStudents = mongoose.model('PlacedStudents', placedStudentsSchema);
module.exports = PlacedStudents;