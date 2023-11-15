const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");
const cruiseBooking = require("../../controllers/cruise/cruiseBookingController");

/**
 * cruise cart
 * Endpoint - /api/cruisebooking/cart/
 */

// get all cart items for a user
router.get("/cart", auth, cruiseBooking.getAllCartItemsForUser);

router.post(
  "/cart/timeout",
  auth,
  cruiseBooking.deleteAllLockedCabinsAfterTimeOut
);

// create a item in cart for a user
router.post("/cart", auth, cruiseBooking.createOrUpdateCartItemForUser);

// reset all cart items for a user
router.delete("/cart", auth, cruiseBooking.deleteAllCartItemsForUser);

// delete item in cart for a user
router.delete("/cart/:id", auth, cruiseBooking.deleteCartItemForUser);

/**
 * cruise orders
 * Endpoint - /api/cruisebooking/orders
 */

// get orders
router.get("/orders/", auth, cruiseBooking.getAllOrdersForUser);

// get order details
router.get("/orders/:id", auth, cruiseBooking.getOrderDetailsForUser);

// get order status
router.get("/orders/:id/status", auth, cruiseBooking.getOrderStatusForUser);

// cancel an order
router.delete("/orders/cancel", auth, cruiseBooking.cancelOrderForUser);

/**
 * cruise reservation checkout
 * Endpoint - /api/cruisebooking/checkout
 */

// create an order (reservation) after a successfull checkout
router.post("/orders/", auth, cruiseBooking.createOrderForUser);

module.exports = router;
