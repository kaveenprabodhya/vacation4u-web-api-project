const express = require("express");
const router = express.Router();
const multer = require("multer");
const Activity = require("../../models/activity/Activity");
const Holiday = require("../../models/holiday/Holiday");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//backoffice
const {
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
} = require("../../controllers/office/OfficeController");

router.post("/add/activity", upload.single("file"), async (req, res) => {
  // Check if a file is provided
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const csvData = req.file.buffer.toString("utf8");

  // Validate that the content is a CSV file (you may need more robust validation)
  if (!csvData.startsWith("name,destination,date")) {
    return res
      .status(400)
      .send(
        "Invalid file format. Must be a CSV file with the correct headers."
      );
  }

  // Parse CSV data and save to MongoDB
  const rows = csvData.split("\n").slice(1); // Skip the header row
  for (const row of rows) {
    if (row !== "") {
      const [
        name,
        destination,
        date,
        type,
        rating,
        price,
        ageRestriction,
        image,
      ] = row.split(",");

      try {
        const check = await Activity.findOne({ name: name });

        if (check) {
          continue;
        }

        const activity = new Activity({
          name,
          destination,
          date,
          type,
          rating: parseInt(rating),
          price: parseFloat(price),
          ageRestriction: parseInt(ageRestriction),
          image,
        });

        await activity.save();
      } catch (error) {
        console.error("Error to the database:", error.message);
        return res.status(500).send("Internal Server Error");
      }
    }
  }

  res.status(200).send("CSV data saved to the database.");
});

router.get("/get/activity/:id", getActivityById);
router.get("/search/activity/:key", getActivityByKey);
router.get("/get/activity", getActivity);
router.put("/update/activity/:id", editActivity);
router.delete("/delete/activity/:id", deleteActivity);

router.post("/add/holiday", upload.single("file"), async (req, res) => {
  // Check if a file is provided
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const csvData = req.file.buffer.toString("utf8");

  // Validate that the content is a CSV file (you may need more robust validation)
  if (!csvData.startsWith("name")) {
    return res
      .status(400)
      .send(
        "Invalid file format. Must be a CSV file with the correct headers."
      );
  }

  // Parse CSV data and save to MongoDB
  const rows = csvData.split("\n").slice(1); // Skip the header row
  for (const row of rows) {
    if (row !== "") {
      const [
        name,
        destination,
        duration,
        participants,
        specialty,
        price,
        rating,
        image,
      ] = row.split(",");

      try {
        const check = await Holiday.findOne({ name: name });
        if (check) {
          continue;
        }
        const holiday = new Holiday({
          name,
          destination,
          duration,
          participants: parseInt(participants),
          specialty,
          price: parseFloat(price),
          rating: parseInt(rating),
          image,
        });

        await holiday.save();
      } catch (error) {
        console.error("Error to the database:", error.message);
        return res.status(500).send("Internal Server Error");
      }
    }
  }

  res.status(200).send("CSV data saved to the database.");
});

router.get("/get/holiday/:id", getHolidayById);
router.get("/search/holiday/:key", getHolidayByKey);
router.get("/get/holiday", getHoliday);
router.put("/update/holiday/:id", editHoliday);
router.delete("/delete/holiday/:id", deleteHoliday);

module.exports = router;
