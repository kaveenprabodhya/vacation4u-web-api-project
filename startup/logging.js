module.exports = function () {
  process.on("unhandledRejection", (ex) => {
    // console.log("We got an unhandle rejection");
    // logger.error(`${ex.message} - ${ex.stack}`);
    // after setting winston exception handle
    throw ex;
  });
};
