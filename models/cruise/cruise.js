const mongoose = require("mongoose");
const Joi = require("joi");

const bonusDetailsSchema = new mongoose.Schema({
  visaGiftCard: Number,
  depositNonRefundable: Boolean,
});

const cruiseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  provider: {
    type: String,
    required: true,
  },
  cruiseImg: String,
  cruiseLineImg: String,
  depatureDestination: {
    type: String,
    required: true,
  },
  arivalDestination: {
    type: String,
    required: true,
  },
  depatureDate: {
    type: Date,
    required: true,
  },
  arrivalDate: {
    type: Date,
    required: true,
  },
  Duration: {
    type: Number,
    required: true,
  },
  ratings: {
    type: Number,
    min: 0,
    max: 5,
  },
  shipId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  portOfCall: [String],
  bestFor: [
    {
      type: String,
    },
  ],
  baseFare: {
    type: Number,
    required: true,
  },
  baseTax: {
    type: Number,
    required: true,
  },
  bonusDetails: bonusDetailsSchema,
});

const Cruise = mongoose.model("Cruise", cruiseSchema);

function validateCruise(data) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(255).required(),
    provider: Joi.string().min(5).max(255).required(),
    cruiseImg: Joi.string(),
    cruiseLineImg: Joi.string(),
    depatureDestination: Joi.string().required(),
    arivalDestination: Joi.string().required(),
    depatureDate: Joi.date().iso().required(),
    arrivalDate: Joi.date().iso().required(),
    Duration: Joi.number().required(),
    ratings: Joi.number().required(),
    shipId: Joi.objectId().required(),
    portOfCall: Joi.array().items(Joi.string()),
    bestFor: Joi.array().items(Joi.string()),
    baseFare: Joi.number().required(),
    baseTax: Joi.number().required(),
    bonusDetails: Joi.object({
      visaGiftCard: Joi.number(),
      depositNonRefundable: Joi.boolean(),
    }),
  });

  return schema.validate(data);
}

module.exports = {
  Cruise: Cruise,
  validateCruise: validateCruise,
};
