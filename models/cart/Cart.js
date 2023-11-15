const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  act_id: {
    type: String,
    required: true,
  },
  agent: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

const Cart = mongoose.model("Cart", CartSchema);

module.exports = Cart;
