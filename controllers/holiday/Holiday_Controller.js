const asyncHandler = require("express-async-handler");
const Holiday = require("../models/Holiday");


//Get Holiday  by Search
const getHolidayByDestination = asyncHandler(async (req, res) => {
  const holiday = await Holiday.find({ destination: req.params.key });

  if (holiday) {
    res.status(200).json({
      success: true,
      data: holiday,
    });
  } else {
    res.status(404).json({
      success: false,
      message: "Holiday not found",
    });
  }
});

//Get Holiday  by Search
const getHolidayByDuration = asyncHandler(async (req, res) => {
  const holiday = await Holiday.find({ duration: parseInt(req.params.key) });

  if (holiday) {
    res.status(200).json({
      success: true,
      data: holiday,
    });
  } else {
    res.status(404).json({
      success: false,
      message: "Holiday not found",
    });
  }
});

//Get Holiday  by Search
const getHolidayByTravelers = asyncHandler(async (req, res) => {
  const holiday = await Holiday.find({ participants:  parseInt(req.params.key) });

  if (holiday) {
    res.status(200).json({
      success: true,
      data: holiday,
    });
  } else {
    res.status(404).json({
      success: false,
      message: "Holiday not found",
    });
  }
});

//Get Holiday  by Search
const getHolidayBySpecialty = asyncHandler(async (req, res) => {
  const holiday = await Holiday.find({ specialty: req.params.key });

  if (holiday) {
    res.status(200).json({
      success: true,
      data: holiday,
    });
  } else {
    res.status(404).json({
      success: false,
      message: "Holiday not found",
    });
  }
});

//Retrieve all the Holiday
const getHoliday = asyncHandler(async (req, res) => {
  const holiday = await Holiday.find();

  if (holiday) {
    res.status(200).json({
      success: true,
      data: holiday,
    });
  } else {
    res.status(404).json({
      success: false,
      message: "No Holiday found",
    });
    throw new Error("No Holiday found");
  }
});



module.exports = {
    getHolidayByDestination,
    getHolidayByDuration,
    getHolidayByTravelers,
    getHolidayBySpecialty,
    getHoliday 
  };
  