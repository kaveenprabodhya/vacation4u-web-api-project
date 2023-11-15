const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  age: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  account: {
    type: String,
  },
});

const Employee = mongoose.model("Employee", EmployeeSchema);

module.exports = Employee;
