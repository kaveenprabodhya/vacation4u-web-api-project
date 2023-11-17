const Joi = require("joi");
const { User } = require("../../models/user");
const bcrypt = require("bcrypt");

exports.authenticate = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(400).send({ message: "Invalid email or password!" });

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).send({ message: "Invalid email or password!" });

  const token = user.generateAuthToken();

  let userRole;
  if (user.role.isAdmin === true) {
    userRole = "Admin";
  }
  if (user.role.isStaff === true) {
    userRole = "Office";
  }
  if (user.role.isAgent === true) {
    userRole = "Agent";
  }

  res.send({ token, role: userRole, email: user.email });
};

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(req);
}
