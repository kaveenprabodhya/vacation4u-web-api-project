const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");
const isAdminOrAgent = require("../../middlewares/isAdminOrAgent");
const cruise = require("../../controllers/cruise/cruiseController");
const ship = require("../../controllers/cruise/shipController");
const multer = require("multer");
const isAdminOrStaff = require("../../middlewares/isAdminOrStaff");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/**
 * Cruise
 * Endpoint - /api/cruise/
 */

// get all cruise
router.get("/", [auth, isAdminOrAgent], cruise.getAllCruises);

// create a cruise
router.post("/", [auth, isAdminOrAgent], cruise.createCruise);

// upload cruise using csv
router.post(
  "/upload",
  [auth, isAdminOrStaff],
  upload.single("file"),
  cruise.createCruiseWithCSV
);

// update cruise details
router.put("/:id", [auth, isAdminOrAgent], cruise.updateCruiseByID);

// delete all cruise
router.delete("/all", cruise.deleteAllCruises);

// delete cruise
router.delete("/:id", [auth, isAdminOrAgent], cruise.deleteCruiseByID);

/**
 * Ship
 * Endpoint - /api/cruise/
 */

// get all ship
router.get("/ship", [auth, isAdminOrAgent], ship.getAllShips);

// get meal preferences based on the cabin type
router.get(
  "/ship/:id/allmealpreferences",
  [auth, isAdminOrAgent],
  ship.getMealPreferencesByCabinType
);

// get cabin types
router.get(
  "/ship/:id/cabintypes",
  [auth, isAdminOrAgent],
  ship.getAllCabinTypes
);

// get all booked cabins
router.get(
  "/ship/:id/bookings",
  [auth, isAdminOrAgent],
  ship.getAllBookedCabins
);

// get ship by destinaion
router.get("/ship/:id", [auth, isAdminOrAgent], ship.getShipByID);

// create a ship
router.post(
  "/ship",
  [auth, isAdminOrAgent],
  upload.single("file"),
  ship.createShip
);

// update ship details
router.put("/ship/:id", [auth, isAdminOrAgent], ship.updateShipByID);

// delete all ship
router.delete("/ship/all", [auth, isAdminOrAgent], ship.deleteAllShips);

// delete ship
router.delete("/ship/:id", [auth, isAdminOrAgent], ship.deleteShipByID);

/**
 * Cruise essential functions
 * Endpoint - /api/cruise/
 */

// search cruise
router.get("/search", [auth, isAdminOrAgent], cruise.searchCruise);

// sort cruise
router.get("/sort", [auth, isAdminOrAgent], cruise.sortCruise);

// filter cruise
router.get("/filter", [auth, isAdminOrAgent], cruise.filterCruise);

module.exports = router;
