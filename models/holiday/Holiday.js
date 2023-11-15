const mongoose = require("mongoose");

const HolidaySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  destination: {
    type: String,
    required: true,
  },

  duration: {
    type:Number,
    required: true,
  },
  participants: {
    type: Number,
    required: true,
  },
  specialty: {
    type: String,
  },

  price: {
    type: Number,
    required: true,
  },

  rating: {
    type: Number,
    required: true,
    default: 0,
  },
  image: {
    type: String,
  },
});

const Holiday = mongoose.model("Holiday", HolidaySchema);

module.exports = Holiday;
