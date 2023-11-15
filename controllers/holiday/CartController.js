const asyncHandler = require("express-async-handler");
const Book = require("../../models/booking/Booking");
const Cart = require("../../models/cart/Cart");

//Add Cart Item
const addItem = asyncHandler(async (req, res) => {
  //create Cart Item
  const item = new Cart(req.body);

  //save Cart Item
  await item.save();

  if (item) {
    res.status(201).json({
      success: true,
      data: item,
    });
  } else {
    res.status(500).json({
      success: false,
      message: "Item not added",
    });
    throw new Error("Item not added");
  }
});

//Retrieve all the Cart Items
const getCart = asyncHandler(async (req, res) => {
  const ct = await Cart.find({ agent: req.params.id });

  if (ct) {
    res.status(200).json({
      success: true,
      data: ct,
    });
  } else {
    res.status(404).json({
      success: false,
      message: "No Item found",
    });
    throw new Error("No Item found");
  }
});

//Delete Item by Id
const deleteCart = asyncHandler(async (req, res) => {
  const item = await Cart.findById(req.params.id);

  if (!item) {
    return res.status(400).json({
      success: false,
      message: "No data found",
    });
  } else {
    try {
      await Cart.deleteOne({ _id: req.params.id });
    } catch (error) {
      res.status(500).json({ error: err.message });
    }

    res.status(200).json({
      success: true,
      message: "Deleted successfully",
    });
  }
});

//Add Booking Item
const addBooking = asyncHandler(async (req, res) => {
  //create Cart Item
  const item = new Book(req.body);

  //save Cart Item
  await item.save();

  if (item) {
    res.status(201).json({
      success: true,
      data: item,
    });
  } else {
    res.status(500).json({
      success: false,
      message: "Item not added",
    });
    throw new Error("Item not added");
  }
});

//Retrieve all the Booking Items
const getBooking = asyncHandler(async (req, res) => {
  const ct = await Book.find({ agent: req.params.id });

  if (ct) {
    res.status(200).json({
      success: true,
      data: ct,
    });
  } else {
    res.status(404).json({
      success: false,
      message: "No Item found",
    });
    throw new Error("No Item found");
  }
});

module.exports = {
  addItem,
  getCart,
  deleteCart,
  addBooking,
  getBooking,
};
