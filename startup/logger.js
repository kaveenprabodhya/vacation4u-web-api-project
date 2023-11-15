const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const timezone = () => {
  return new Date().toLocaleString("en-GB", { timeZone: "Asia/Colombo" });
};

const logger = createLogger({
  format: combine(
    format.colorize({
      colors: { info: "blue", error: "red", warn: "yellow" },
      all: true,
    }),
    timestamp({
      format: timezone,
    }),
    format.prettyPrint(),
    myFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "log/logfile.log" }),
  ],
  exceptionHandlers: [
    new transports.Console(),
    new transports.File({ filename: "log/exceptions.log" }),
  ],
});

module.exports = { logger };
