const mongoose = require("mongoose");
const Joi = require("joi");

const diningSchema = new mongoose.Schema({
  type: String,
  description: String,
  img: String,
  attire: String,
});

const barAndLoungeSchema = new mongoose.Schema({
  name: String,
  description: String,
  img: String,
});

const entertainmentSchema = new mongoose.Schema({
  name: String,
  description: String,
  img: String,
});

const onBoardActivitySchema = new mongoose.Schema({
  name: String,
  description: String,
  img: String,
});

const outdoorActivitySchema = new mongoose.Schema({
  name: String,
  description: String,
  img: String,
});

const kidsAndTeensSchema = new mongoose.Schema({
  name: String,
  description: String,
  img: String,
});

const ratingsSchema = new mongoose.Schema({
  one: { type: Number, default: 0 },
  two: { type: Number, default: 0 },
  three: { type: Number, default: 0 },
  four: { type: Number, default: 0 },
  five: { type: Number, default: 0 },
});

const reviewSchema = new mongoose.Schema({
  overallRating: Number,
  ratings: ratingsSchema,
  pros: [String],
  cons: [String],
  bestSuitedFor: [String],
});

const pricePlanSchema = new mongoose.Schema({
  cabinType: String,
  maxGuests: Number,
  price: Number,
  taxFare: Number,
});

const deckOverviewSchema = new mongoose.Schema({
  title: String,
  img: String,
  description: String,
});

const cabinSchema = new mongoose.Schema({
  roomNo: Number,
  type: String,
  img: String,
  description: String,
  maxGuests: Number,
  locked: Boolean,
  booked: Boolean,
});

const deckSchema = new mongoose.Schema({
  deckNumber: Number,
  floorPlan: String,
  deckOverview: [deckOverviewSchema],
  pricePlan: [pricePlanSchema],
  cabin: [cabinSchema],
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

const deckAndCabinSchema = new mongoose.Schema({
  numOfDecks: Number,
  allCabinTypes: [String],
  deck: [deckSchema],
});

const shipOverviewSchema = new mongoose.Schema({
  shipHighlights: [String],
  dining: [diningSchema],
  barAndLaunghes: [barAndLoungeSchema],
  entertainment: [entertainmentSchema],
  onBoardActivites: [onBoardActivitySchema],
  outdoorActivites: [outdoorActivitySchema],
  kidsAndTeens: [kidsAndTeensSchema],
});

const shipSchema = new mongoose.Schema({
  name: { type: String, required: true },
  img: { type: String, required: true },
  overview: shipOverviewSchema,
  review: [reviewSchema],
  gallery: [String],
  deckAndCabin: deckAndCabinSchema,
  mealPreference: mealPreferencesSchema,
});

const Ship = mongoose.model("Ship", shipSchema);

function validateShip(data) {
  const schema = Joi.object({
    name: Joi.string().required(),
    img: Joi.string().required(),
    overview: {
      shipHighlights: Joi.array().items(Joi.string().allow("")),
      dining: Joi.array().items(
        Joi.object({
          type: Joi.string().allow(""),
          description: Joi.string().allow(""),
          img: Joi.string().allow(""),
          attire: Joi.string().allow(""),
        })
      ),
      barAndLaunghes: Joi.array().items(
        Joi.object({
          name: Joi.string().allow(""),
          description: Joi.string().allow(""),
          img: Joi.string().allow(""),
        })
      ),
      entertainment: Joi.array().items(
        Joi.object({
          name: Joi.string().allow(""),
          description: Joi.string().allow(""),
          img: Joi.string().allow(""),
        })
      ),
      onBoardActivites: Joi.array().items(
        Joi.object({
          name: Joi.string().allow(""),
          description: Joi.string().allow(""),
          img: Joi.string().allow(""),
        })
      ),
      outdoorActivites: Joi.array().items(
        Joi.object({
          name: Joi.string().allow(""),
          description: Joi.string().allow(""),
          img: Joi.string().allow(""),
        })
      ),
      kidsAndTeens: Joi.array().items(
        Joi.object({
          name: Joi.string().allow(""),
          description: Joi.string().allow(""),
          img: Joi.string().allow(""),
        })
      ),
    },
    review: Joi.array().items(
      Joi.object({
        overallRating: Joi.number().default(0),
        ratings: {
          one: Joi.number().default(0),
          two: Joi.number().default(0),
          three: Joi.number().default(0),
          four: Joi.number().default(0),
          five: Joi.number().default(0),
        },
        pros: Joi.array().items(Joi.string().allow("")),
        cons: Joi.array().items(Joi.string().allow("")),
        bestSuitedFor: Joi.array().items(Joi.string().allow("")),
      })
    ),
    gallery: Joi.array().items(Joi.string().allow("")),
    deckAndCabin: Joi.object({
      numOfDecks: Joi.number(),
      allCabinTypes: Joi.array().items(Joi.string().allow("")),
      deck: Joi.array().items(
        Joi.object({
          deckNumber: Joi.number(),
          floorPlan: Joi.string().allow(""),
          deckOverview: Joi.array().items(
            Joi.object({
              title: Joi.string().allow(""),
              img: Joi.string().allow(""),
              description: Joi.string().allow(""),
            })
          ),
          pricePlan: Joi.array().items(
            Joi.object({
              cabinType: Joi.string().allow(""),
              maxGuests: Joi.number(),
              price: Joi.number(),
              taxFare: Joi.number(),
            })
          ),
          cabin: Joi.array().items(
            Joi.object({
              roomNo: Joi.number(),
              type: Joi.string().allow(""),
              img: Joi.string().allow(""),
              description: Joi.string().allow(""),
              maxGuests: Joi.number(),
              locked: Joi.boolean(),
              booked: Joi.boolean(),
            })
          ),
        })
      ),
    }),
    mealPreference: Joi.object({
      dietaryRestrictions: Joi.array().items(Joi.string()),
      preferredCuisine: Joi.array().items(Joi.string()),
      diningTableSize: Joi.number(),
      beveragePreferences: Joi.array().items(Joi.string()),
      allergies: Joi.array().items(Joi.string()),
    }),
  });

  return schema.validate(data);
}

module.exports = {
  Ship: Ship,
  validateShip: validateShip,
};
