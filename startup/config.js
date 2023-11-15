const config = require("config");

module.exports = function () {
  if (!config.get("jwtPrivateKey")) {
    // console.error("FATAL ERROR: jwtPrivateKey is not defiend.");
    // process.exit(1);
    throw new Error("FATAL ERROR: jwtPrivateKey is not defiend.");
  }
};
