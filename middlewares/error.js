const { logger } = require("../startup/logger");

module.exports = function (err, req, res, next) {
  res.status(500).send("Something went wrong. Please try again later.");
  logger.error(
    `${err.status || 500} - ${res.statusMessage} - ${err.message} - ${
      req.originalUrl
    } - ${req.method} - ${req.ip}`
  );
};
