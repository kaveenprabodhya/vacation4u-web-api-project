const mongoose = require("mongoose");
const Joi = require("joi");

const cruiseReservationSchema = new mongoose.Schema({
  cruiseId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  shipId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  cabinType: {
    type: String,
    required: true,
  },
  cabinId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  deckNo: {
    type: Number,
    required: true,
  },
  departureDate: {
    type: Date,
    required: true,
  },
});

const cartItemSchema = new mongoose.Schema(
  {
    noOfPassengers: {
      type: Number,
      required: true,
    },
    cruiseReservation: cruiseReservationSchema,
    total: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  items: [cartItemSchema],
  subTotal: Number,
  totalTaxFare: Number,
  totalAmount: Number,
});

const CruiseCart = mongoose.model("CruiseCart", cartSchema);

function validateCart(data) {
  const schema = Joi.object({
    noOfPassengers: Joi.number().min(1).max(8).required(),
    cruiseReservation: Joi.object({
      cruiseId: Joi.objectId().required(),
      shipId: Joi.objectId().required(),
      cabinType: Joi.string().required(),
      deckNo: Joi.number().required(),
      departureDate: Joi.date().iso().required(),
    }),
  });

  return schema.validate(data);
}

module.exports = {
  Cart: CruiseCart,
  validateCart: validateCart,
};
