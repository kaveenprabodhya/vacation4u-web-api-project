const asyncHandler = require("express-async-handler");
const Activity = require("../models/Activity");

//Get Activity  by Search
const getActivityByDestination = asyncHandler(async (req, res) => {
  const activity = await Activity.find({ destination: req.params.key });

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
const getActivityByDate = asyncHandler(async (req, res) => {
  const activity = await Activity.find({ date: req.params.key });

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
const getActivityByType = asyncHandler(async (req, res) => {
  const activity = await Activity.find({ type: req.params.key });

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
const getActivityByRating = asyncHandler(async (req, res) => {
  const activity = await Activity.find({ rating: parseInt(req.params.key) });

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

module.exports = {
  getActivity,
  getActivityByRating,
  getActivityByType,
  getActivityByDate,
  getActivityByDestination,
};
