const mongoose = require("mongoose");
const Joi = require("joi");

const passengerInformationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  Gender: {
    type: String,
    required: true,
    enum: ["Male", "Female"],
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
});

const mealPreferencesSchema = new mongoose.Schema({
  dietaryRestrictions: [
    {
      type: String,
    },
  ],
  preferredCuisine: [
    {
      type: String,
    },
  ],
  diningTableSize: {
    type: Number,
    required: true,
  },
  beveragePreferences: [
    {
      type: String,
    },
  ],
  allergies: [
    {
      type: String,
    },
  ],
});

const cabinPreferencesSchema = new mongoose.Schema({
  deckNumber: {
    type: Number,
    required: true,
  },
  cabinType: {
    type: String,
    required: true,
  },
  cabinNumber: {
    type: Number,
    required: true,
  },
  mealPreferences: {
    type: mealPreferencesSchema,
    required: true,
  },
});

const cruiseDetailsSchema = new mongoose.Schema({
  cruiseId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  shipId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  departureDate: {
    type: Date,
    required: true,
  },
  arrivalDate: {
    type: Date,
    required: true,
  },
  cabinPreferences: {
    type: cabinPreferencesSchema,
    required: true,
  },
});

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  paymentInfo: {
    totalAmount: {
      type: Number,
      required: true,
    },
    subTotalAmount: {
      type: Number,
      required: true,
    },
    taxFare: {
      type: Number,
      required: true,
    },
  },
  passengerInformation: {
    type: [passengerInformationSchema],
    required: true,
  },
  cruiseDetails: {
    type: [cruiseDetailsSchema],
    required: true,
  },
  orderStatus: {
    type: String,
    required: true,
    enum: ["confirmed", "pending", "cancelled"],
  },
});

const Order = mongoose.model("Order", orderSchema);

function validateOrder(data) {
  const schema = Joi.object({
    paymentInfo: Joi.object({
      totalAmount: Joi.number().required(),
      subTotalAmount: Joi.number().required(),
      taxFare: Joi.number().required(),
    }),
    passengerInformation: Joi.array().items(
      Joi.object({
        title: Joi.string().required(),
        Gender: Joi.string().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.string().regex(/^\d{10}$/),
      })
    ),
    cruiseDetails: Joi.array().items(
      Joi.object({
        cruiseId: Joi.objectId().required(),
        shipId: Joi.objectId().required(),
        departureDate: Joi.date().iso().required(),
        arrivalDate: Joi.date().iso().required(),
        cabinPreferences: Joi.object({
          deckNumber: Joi.number().required(),
          cabinType: Joi.string().required(),
          cabinNumber: Joi.number().required(),
          mealPreferences: Joi.object({
            dietaryRestrictions: Joi.array().items(Joi.string()),
            preferredCuisine: Joi.array().items(Joi.string()),
            diningTableSize: Joi.number(),
            beveragePreferences: Joi.array().items(Joi.string()),
            allergies: Joi.array().items(Joi.string()),
          }),
        }),
      })
    ),
    orderStatus: Joi.string(),
  });

  return schema.validate(data);
}

module.exports = {
  Order: Order,
  validateOrder: validateOrder,
};
