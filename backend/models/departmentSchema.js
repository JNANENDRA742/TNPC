const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
    name : String,
    code : String,
    totalStudents : Number,
    placed : Number,
    avgPackage : Number,
    highestPackage : Number,
    topRecruiters : [String],
    yearWise : [
        {
            year : Number,
            placed : Number,
            total : Number
        }
    ]
})

module.exports = mongoose.model("departmentSchema", departmentSchema);