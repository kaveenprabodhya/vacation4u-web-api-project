const express = require("express");
const cruise = require("../routes/cruise/cruises");
const cruiseBooking = require("../routes/cruise/cruiseBookings");
const users = require("../routes/authection/users");
const auth = require("../routes/authection/auth");
const error = require("../middlewares/error");
const cors = require("cors");

module.exports = function (app) {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  // app.use("/api/cruise", cruise);
  // app.use("/api/cruisebooking", cruiseBooking);
  // app.use("/api/users", users);
  // app.use("/api/auth", auth);
  app.use(error);
};
