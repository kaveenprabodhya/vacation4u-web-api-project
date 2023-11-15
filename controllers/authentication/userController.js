const { User, validate } = require("../../models/user");
const _ = require("lodash");
const bcrypt = require("bcrypt");

exports.me = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
};

exports.register = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const users = await User.findOne({ email: req.body.email });
  if (users)
    return res.status(400).send({ message: "User already registered!" });

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  try {
    await user.save();
    const token = user.generateAuthToken();
    res
      .header("x-auth-token", token)
      .status(201)
      .send(_.pick(user, ["name", "email"]));
  } catch (ex) {
    console.log(ex.message);
  }
};
