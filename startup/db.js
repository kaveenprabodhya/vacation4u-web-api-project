const mongoose = require("mongoose");
const { logger } = require("./logger");

module.exports = function () {
  mongoose
    .connect("mongodb://127.0.0.1:27017/vacation4u")
    .then(() => {
      logger.info(`Connected to MongoDB - ${new Date()}`);
    })
    .catch((err) => console.log("Could not connect to MongoDB...", err));
};
