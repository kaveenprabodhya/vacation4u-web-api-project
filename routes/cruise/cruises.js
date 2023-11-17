const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");
const isAdminOrAgent = require("../../middlewares/isAdminOrAgent");
const cruise = require("../../controllers/cruise/cruiseController");
const ship = require("../../controllers/cruise/shipController");
const multer = require("multer");
const isAdminOrAgentOrStaff = require("../../middlewares/isAdminOrAgentOrStaff");
const isAdminOrStaff = require("../../middlewares/isAdminOrStaff");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/**
 * Cruise
 * Endpoint - /api/cruise/
 */

// get all cruise
router.get("/", [auth, isAdminOrAgentOrStaff], cruise.getAllCruises);

// create a cruise
router.post("/", [auth, isAdminOrStaff], cruise.createCruise);

// upload cruise using csv
router.post(
  "/upload",
  [auth, isAdminOrStaff],
  upload.single("file"),
  cruise.createCruiseWithCSV
);

// update cruise details
router.put("/:id", [auth, isAdminOrStaff], cruise.updateCruiseByID);

// delete all cruise
router.delete("/all", [auth, isAdminOrStaff], cruise.deleteAllCruises);

// delete cruise
router.delete("/:id", [auth, isAdminOrStaff], cruise.deleteCruiseByID);

/**
 * Ship
 * Endpoint - /api/cruise/
 */

// get all ship
router.get("/ship", [auth, isAdminOrAgentOrStaff], ship.getAllShips);

// get ship by name
router.get("/ship/search", [auth, isAdminOrStaff], ship.getShipByName);

// get meal preferences based on the cabin type
router.get(
  "/ship/:id/allmealpreferences",
  [auth, isAdminOrAgentOrStaff],
  ship.getMealPreferencesByCabinType
);

// get cabin types
router.get(
  "/ship/:id/cabintypes",
  [auth, isAdminOrAgentOrStaff],
  ship.getAllCabinTypes
);

// get all booked cabins
router.get(
  "/ship/:id/bookings",
  [auth, isAdminOrAgentOrStaff],
  ship.getAllBookedCabins
);

// get ship by destinaion
router.get("/ship/:id", [auth, isAdminOrAgentOrStaff], ship.getShipByID);

// create a ship
router.post(
  "/ship",
  [auth, isAdminOrStaff],
  upload.single("file"),
  ship.createShip
);

// update ship details
router.put("/ship/:id", [auth, isAdminOrStaff], ship.updateShipByID);

// delete all ship
router.delete("/ship/all", [auth, isAdminOrStaff], ship.deleteAllShips);

// delete ship
router.delete("/ship/:id", [auth, isAdminOrStaff], ship.deleteShipByID);

/**
 * Cruise essential functions
 * Endpoint - /api/cruise/
 */

// search cruise
router.get("/search", [auth, isAdminOrAgentOrStaff], cruise.searchCruise);

// sort cruise
router.get("/sort", [auth, isAdminOrAgent], cruise.sortCruise);

// filter cruise
router.post("/filter", [auth, isAdminOrAgent], cruise.filterCruise);

module.exports = router;
