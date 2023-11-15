const express = require("express");
const router = express.Router();
const cruise = require("../../controllers/cruise/cruiseController");
const ship = require("../../controllers/cruise/shipController");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/**
 * Cruise
 * Endpoint - /api/cruise/
 */

// get all cruise
router.get("/", cruise.getAllCruises);

// create a cruise
router.post("/", cruise.createCruise);

// upload cruise using csv
router.post("/upload", upload.single("file"), cruise.createCruiseWithCSV);

// update cruise details
router.put("/:id", cruise.updateCruiseByID);

// delete all cruise
router.delete("/all", cruise.deleteAllCruises);

// delete cruise
router.delete("/:id", cruise.deleteCruiseByID);

/**
 * Ship
 * Endpoint - /api/cruise/
 */

// get all ship
router.get("/ship", ship.getAllShips);

// get meal preferences based on the cabin type
router.get("/ship/:id/allmealpreferences", ship.getMealPreferencesByCabinType);

// get cabin types
router.get("/ship/:id/cabintypes", ship.getAllCabinTypes);

// get all booked cabins
router.get("/ship/:id/bookings", ship.getAllBookedCabins);

// get ship by destinaion
router.get("/ship/:id", ship.getShipByID);

// create a ship
router.post("/ship", upload.single("file"), ship.createShip);

// update ship details
router.put("/ship/:id", ship.updateShipByID);

// delete all ship
router.delete("/ship/all", ship.deleteAllShips);

// delete ship
router.delete("/ship/:id", ship.deleteShipByID);

/**
 * Cruise essential functions
 * Endpoint - /api/cruise/
 */

// search cruise
router.get("/search", cruise.searchCruise);

// sort cruise
router.get("/sort", cruise.sortCruise);

// filter cruise
router.get("/filter", cruise.filterCruise);

module.exports = router;
