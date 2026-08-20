const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        enum: ['suggestion', 'bug', 'feature', 'improvement', 'complaint', 'other'],
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    message: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
        maxlength: 1000
    },
    improvements: {
        type: String,
        trim: true
    },
    experience: {
        type: String,
        enum: ['positive', 'neutral', 'negative']
    },
    userAgent: {
        type: String
    },
    ipAddress: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'resolved'],
        default: 'pending'
    },
    adminResponse: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Add index for faster queries
feedbackSchema.index({ createdAt: -1 });
feedbackSchema.index({ status: 1 });
feedbackSchema.index({ category: 1 });

module.exports = mongoose.model("Feedback", feedbackSchema);