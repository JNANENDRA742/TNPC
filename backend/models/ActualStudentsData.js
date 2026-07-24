const mongoose = require("mongoose");

const ActualStudentsData = new mongoose.Schema({
    id_no : String ,
    name : String ,
    email : String ,
    year : String ,
    gender : {
        type : String ,
        enum: ["Male", "Female" , "male" , "female" , "m" , "f"]
    },
    department : String,
    section : String,
})
module.exports = mongoose.model("ActualStudentsData", ActualStudentsData);