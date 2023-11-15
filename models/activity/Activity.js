const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  destination: {
    type: String,
    required: true,
  },

  date: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    required: true,
  },

  rating: {
    type: Number,
    default: 0,
  },

  price: {
    type: Number,
    required: true,
  },
  ageRestriction: {
    type: Number,
    required: true,
  },

  image: {
    type:String
  }
});

const Activity = mongoose.model("Activity", ActivitySchema);

module.exports = Activity;
