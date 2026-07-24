const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    studentsPlaced : {
        type : Number,
        required : true
    },
    avgPackage : {
        type : Number,
        required : true
    },
})

const Company = mongoose.model("Company", companySchema);

module.exports = Company;