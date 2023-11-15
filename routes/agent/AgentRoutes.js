const express = require("express");
const router = express.Router();

//Agent
const {
  getActivity,
  getActivityByRating,
  getActivityByType,
  getActivityByDate,
  getActivityByDestination,
} = require("../../controllers/activity/Activity_Controller");

const {
  getHolidayByDestination,
  getHolidayByDuration,
  getHolidayByTravelers,
  getHolidayBySpecialty,
  getHoliday,
} = require("../../controllers/holiday/Holiday_Controller");

const {
  addItem,
  getCart,
  deleteCart,
  addBooking,
  getBooking,
} = require("../../controllers/holiday/CartController");

router.get("/search/activity/rating/:key", getActivityByRating);
router.get("/search/activity/type/:key", getActivityByType);
router.get("/search/activity/date/:key", getActivityByDate);
router.get("/search/activity/destination/:key", getActivityByDestination);
router.get("/get/activity", getActivity);

router.get("/search/holiday/destination/:key", getHolidayByDestination);
router.get("/search/holiday/duration/:key", getHolidayByDuration);
router.get("/search/holiday/travlers/:key", getHolidayByTravelers);
router.get("/search/holiday/specialty/:key", getHolidayBySpecialty);
router.get("/get/holiday", getHoliday);

router.post("/cart/add", addItem);
router.get("/cart/get/:id", getCart);
router.delete("/cart/delete/:id", deleteCart);

router.post("/booking/add", addBooking);
router.get("/booking/get/:id", getBooking);

module.exports = router;
