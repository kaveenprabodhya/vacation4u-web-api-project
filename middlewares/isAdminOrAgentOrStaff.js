module.exports = function (req, res, next) {
  if (req.user.isAgent || req.user.isAdmin || req.user.isStaff) {
    next();
  } else {
    return res
      .status(403)
      .send({ message: "Access Denied. you can't access this route." });
  }
};
