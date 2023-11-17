const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");
const isAdminOrAgent = require("../../middlewares/isAdminOrAgent");
const cruiseBooking = require("../../controllers/cruise/cruiseBookingController");

/**
 * cruise cart
 * Endpoint - /api/cruisebooking/cart/
 */

// get all cart items for a user
router.get(
  "/cart",
  [auth, isAdminOrAgent],
  cruiseBooking.getAllCartItemsForUser
);

// timeout
router.post(
  "/cart/timeout",
  [auth, isAdminOrAgent],
  cruiseBooking.deleteAllLockedCabinsAfterTimeOut
);

// create a item in cart for a user
router.post(
  "/cart",
  [auth, isAdminOrAgent],
  cruiseBooking.createOrUpdateCartItemForUser
);

// get cart item count
router.get(
  "/cart/count",
  [auth, isAdminOrAgent],
  cruiseBooking.getCartItemsCount
);

// reset all cart items for a user
router.delete(
  "/cart",
  [auth, isAdminOrAgent],
  cruiseBooking.deleteAllCartItemsForUser
);

// delete item in cart for a user
router.delete(
  "/cart/:id",
  [auth, isAdminOrAgent],
  cruiseBooking.deleteCartItemForUser
);

/**
 * cruise orders
 * Endpoint - /api/cruisebooking/orders
 */

// get orders
router.get(
  "/orders",
  [auth, isAdminOrAgent],
  cruiseBooking.getAllOrdersForUser
);

// get order details
router.get(
  "/orders/:id",
  [auth, isAdminOrAgent],
  cruiseBooking.getOrderDetailsForUser
);

// get order status
router.get(
  "/orders/:id/status",
  [auth, isAdminOrAgent],
  cruiseBooking.getOrderStatusForUser
);

// cancel an order
router.delete(
  "/orders/cancel",
  [auth, isAdminOrAgent],
  cruiseBooking.cancelOrderForUser
);

/**
 * cruise reservation checkout
 * Endpoint - /api/cruisebooking/checkout
 */

// create an order (reservation) after a successfull checkout
router.post(
  "/orders",
  [auth, isAdminOrAgent],
  cruiseBooking.createOrderForUser
);

module.exports = router;
