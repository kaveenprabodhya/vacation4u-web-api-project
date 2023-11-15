const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  role: {
    isAgent: {
      type: Boolean,
      default: false,
    },
    isStaff: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      isAdmin: this.role.isAdmin,
      isAgent: this.role.isAgent,
      isStaff: this.role.isStaff,
    },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(data) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
    role: Joi.object({
      isAgent: Joi.boolean(),
      isStaff: Joi.boolean(),
      isAdmin: Joi.boolean(),
    })
      .custom((value, helpers) => {
        // Count the number of true values
        const trueCount = ["isAgent", "isStaff", "isAdmin"].filter(
          (key) => value[key]
        ).length;

        // Check if exactly one is true
        if (trueCount !== 1) {
          return helpers.error("any.invalid");
        }

        return value; // Return the validated value
      }, "Exactly one role must be true")
      .message("Exactly one role must be assigned"),
  });

  return schema.validate(data);
}

module.exports = {
  User: User,
  validate: validateUser,
};
