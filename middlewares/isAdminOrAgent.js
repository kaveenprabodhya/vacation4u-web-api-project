module.exports = function (req, res, next) {
  if (req.user.isAgent || req.user.isAdmin) {
    next();
  } else {
    return res
      .status(403)
      .send({ message: "Access Denied. you can't access this route." });
  }
};
