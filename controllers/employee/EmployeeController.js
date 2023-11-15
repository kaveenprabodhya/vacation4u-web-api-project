const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const Employee = require("../../models/employee/Employee");
const { User } = require("../../models/user");

//Add Employee
const addEmployee = asyncHandler(async (req, res) => {
  const { name, number, address, age, position, email } = req.body;

  //Validations
  if (!name || !number || !address || !age || !position || !email) {
    return res.status(400).json({
      success: false,
      message: "Please enter all fields",
    });
  }

  //check if Employee already exists
  const employee = await Employee.findOne({ email: email });

  //if Employee exists
  if (employee) {
    return res.status(400).json({
      success: false,
      message: "This Employee already exists",
    });
  }
  let password = "12341234";
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const role = {};
  if (position === "admin") {
    role.isAdmin = true;
  } else if (position === "staff") {
    role.isStaff = true;
  } else if (position === "agent") {
    role.isAgent = true;
  }

  //create user login
  const user = new User({
    name: name,
    email: email,
    password: hashedPassword,
    role,
  });

  console.log(user);

  await user.save();

  const id = user._id;
  //create Employee
  const newEmployee = new Employee({
    name,
    number,
    address,
    age,
    position,
    email,
    account: id,
  });

  //save Employee
  await newEmployee.save();

  if (newEmployee) {
    res.status(201).json({
      success: true,
      data: newEmployee,
    });
  } else {
    res.status(500).json({
      success: false,
      message: "Employee not added",
    });
    throw new Error("Employee not added");
  }
});

//Get Employee by Id
const getEmployeeById = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id);

  if (employee) {
    res.status(200).json({
      success: true,
      data: employee,
    });
  } else {
    res.status(404).json({
      success: false,
      message: "Employee not found",
    });
  }
});

//Get Employee by Search
const getEmployeeByKey = asyncHandler(async (req, res) => {
  const employee = await Employee.find({ name: req.params.key });

  if (employee) {
    res.status(200).json({
      success: true,
      data: employee,
    });
  } else {
    res.status(404).json({
      success: false,
      message: "Employee not found",
    });
  }
});

//Retrieve all the Employees
const getEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.find();

  if (employee) {
    res.status(200).json({
      success: true,
      data: employee,
    });
  } else {
    res.status(404).json({
      success: false,
      message: "No Employees found",
    });
    throw new Error("No Employees found");
  }
});

//Update Employee
const editEmployee = asyncHandler(async (req, res) => {
  try {
    const { name, number, address, age, position, email, account } = req.body;

    if (
      !name ||
      !number ||
      !address ||
      !age ||
      !position ||
      !email ||
      !account
    ) {
      return res.status(400).json({
        success: false,
        message: "Data Missing",
      });
    }

    const emp = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!emp) {
      return res.status(400).json({ error: "Not Updated" });
    }
    res.status(200).json({
      success: true,
      data: emp,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Delete Employee by Id
const deleteEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id);

  if (!employee) {
    return res.status(400).json({
      success: false,
      message: "No data found",
    });
  } else {
    const account = employee.account;

    try {
      await Employee.deleteOne({ _id: req.params.id });
      await User.deleteOne({ _id: account });
    } catch (error) {
      res.status(500).json({ error: err.message });
    }

    res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  }
});

const passwordChange = asyncHandler(async (req, res) => {
  const employee = await User.findById(req.params.id);

  if (!employee) {
    return res.status(404).json({
      success: false,
      message: "No data found",
    });
  } else {
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      employee.password
    );
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ error: "Invalid credentials. Incorrect password." });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.new, saltRounds);

    try {
      const up = await User.findByIdAndUpdate(
        req.params.id,
        { password: hashedPassword },
        {
          new: true,
        }
      );

      if (!up) {
        return res.status(500).json({ error: "Not Updated" });
      }
    } catch (error) {
      res.status(500).json({ error: err.message });
    }

    res.status(200).json({
      success: true,
      message: "Employee Password Updated successfully",
    });
  }
});

module.exports = {
  addEmployee,
  getEmployeeById,
  getEmployee,
  editEmployee,
  deleteEmployee,
  getEmployeeByKey,
  passwordChange,
};
