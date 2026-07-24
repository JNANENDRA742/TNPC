const mongoose = require("mongoose")

const yearlyPlacementsSchema = new mongoose.Schema({
    year : Number,
    totalPlaced : Number,
    totalStudents : Number,
    avgPackage : Number,
    highestPackage : Number
})

module.exports = mongoose.model("YearlyPlacements", yearlyPlacementsSchema)