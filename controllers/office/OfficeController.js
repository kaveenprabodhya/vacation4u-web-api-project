const asyncHandler = require("express-async-handler");
const Activity = require("../../models/activity/Activity");
const Holiday = require("../../models/holiday/Holiday");

//Get Activity by Id
const getActivityById = asyncHandler(async (req, res) => {
  const activity = await Activity.findById(req.params.id);

  if (activity) {
    res.status(200).json({
      success: true,
      data: activity,
    });
  } else {
    res.status(404).json({
      success: false,
      message: "Activity not found",
    });
  }
});

//Get Activity  by Search
const getActivityByKey = asyncHandler(async (req, res) => {
  const activity = await Activity.find({ name: req.params.key });

  if (activity) {
    res.status(200).json({
      success: true,
      data: activity,
    });
  } else {
    res.status(404).json({
      success: false,
      message: "Activity not found",
    });
  }
});

//Retrieve all the Activities
const getActivity = asyncHandler(async (req, res) => {
  const activity = await Activity.find();

  if (activity) {
    res.status(200).json({
      success: true,
      data: activity,
    });
  } else {
    res.status(404).json({
      success: false,
      message: "No Activity found",
    });
    throw new Error("No Activity found");
  }
});

//Update Activity
const editActivity = asyncHandler(async (req, res) => {
  try {
    const { name, destination, date, type, rating, price, ageRestriction } =
      req.body;

    if (
      !name ||
      !destination ||
      !date ||
      !type ||
      !rating ||
      !price ||
      !ageRestriction
    ) {
      return res.status(400).json({
        success: false,
        message: "Data Missing",
      });
    }

    const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!activity) {
      return res.status(400).json({ error: "Not Updated" });
    }
    res.status(200).json({
      success: true,
      data: activity,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Delete Activity  by Id
const deleteActivity = asyncHandler(async (req, res) => {
  const activity = await Activity.findById(req.params.id);

  if (!activity) {
    return res.status(400).json({
      success: false,
      message: "No data found",
    });
  } else {
    try {
      await Activity.deleteOne({ _id: req.params.id });
    } catch (error) {
      res.status(500).json({ error: err.message });
    }

    res.status(200).json({
      success: true,
      message: "Activity deleted successfully",
    });
  }
});

//Get Holiday by Id
const getHolidayById = asyncHandler(async (req, res) => {
  const holiday = await Holiday.findById(req.params.id);

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
const getHolidayByKey = asyncHandler(async (req, res) => {
  const holiday = await Holiday.find({ name: req.params.key });

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

//Update Holiday
const editHoliday = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      destination,
      duration,
      participants,
      specialty,
      price,
      rating,
    } = req.body;

    if (
      !name ||
      !destination ||
      !duration ||
      !participants ||
      !specialty ||
      !price ||
      !rating
    ) {
      return res.status(400).json({
        success: false,
        message: "Data Missing",
      });
    }

    const holiday = await Holiday.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!holiday) {
      return res.status(400).json({ error: "Not Updated" });
    }
    res.status(200).json({
      success: true,
      data: holiday,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Delete Holiday  by Id
const deleteHoliday = asyncHandler(async (req, res) => {
  const holiday = await Holiday.findById(req.params.id);

  if (!holiday) {
    return res.status(400).json({
      success: false,
      message: "No data found",
    });
  } else {
    try {
      await Holiday.deleteOne({ _id: req.params.id });
    } catch (error) {
      res.status(500).json({ error: err.message });
    }

    res.status(200).json({
      success: true,
      message: "Holiday deleted successfully",
    });
  }
});

module.exports = {
  getActivityById,
  getActivity,
  editActivity,
  deleteActivity,
  getActivityByKey,

  getHolidayById,
  getHoliday,
  editHoliday,
  deleteHoliday,
  getHolidayByKey,
};
