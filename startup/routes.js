const express = require("express");
const cruise = require("../routes/cruise/cruises");
const cruiseBooking = require("../routes/cruise/cruiseBookings");
const users = require("../routes/authection/users");
const auth = require("../routes/authection/auth");
const agent = require("../routes/agent/AgentRoutes");
const employee = require("../routes/employee/EmployeeRoutes");
const office = require("../routes/office/OfficeRoutes");
const cors = require("cors");
const error = require("../middlewares/error");

module.exports = function (app) {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/api/cruise", cruise);
  app.use("/api/cruisebooking", cruiseBooking);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/api/agent", agent);
  app.use("/api/employee", employee);
  app.use("/api/office", office);
  app.use(error);
};
