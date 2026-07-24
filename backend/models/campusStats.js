const mongoose = require('mongoose');

const campusStatsSchema = new mongoose.Schema({
  onCampus: {
    total: Number,
    percentage: Number
  },
  offCampus: {
    total: Number,
    percentage: Number
  },
  yearWise: [
    {
      year: Number,
      onCampus: Number,
      offCampus: Number,
    }
  ]
});

module.exports = mongoose.model("CampusStats", campusStatsSchema);