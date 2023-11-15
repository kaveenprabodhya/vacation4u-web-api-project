const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  name: {
    type: String,
  },

  email: {
    type: String,
  },

  address: {
    type: String,
  },

  total: {
    type: Number,
    required: true,
  },

  agent: {
    type: String,
    required: true,
  },

  package: {
    type: String,
    required: true,
  },

  cabin: {
    type: String,
  },

  meal: {
    type: String,
  },

  participants: {
    type: Number,
  },
});

const Book = mongoose.model("Book", BookSchema);

module.exports = Book;
