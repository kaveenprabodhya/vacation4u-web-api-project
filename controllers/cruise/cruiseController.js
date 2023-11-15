const { default: mongoose } = require("mongoose");
const {
  validateCruise,
  Cruise,
  validateSearchQuery,
} = require("../../models/cruise/cruise");
const { Ship } = require("../../models/cruise/ship");
const csv = require("csv-parser");
const streamifier = require("streamifier");

exports.getAllCruises = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const results = {};

  if (endIndex < (await Cruise.countDocuments().exec())) {
    results.next = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit,
    };
  }
  results.current = await Cruise.find().limit(limit).skip(startIndex).exec();
  res.send(results);
};

// cruise
exports.createCruise = async (req, res, next) => {
  const { error } = validateCruise(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const ship = await Ship.findById(req.body.shipId).catch((err) =>
    res.status(500).send({
      message: `Error finding ship with id: ${req.body.shipId}`,
    })
  );

  if (!ship)
    return res.status(400).send({
      message: `Cannot find ship with given id= ${req.body.shipId}`,
    });

  const cruise = new Cruise({
    ...req.body,
  });

  try {
    await cruise.save();
    res.status(201).send(cruise);
  } catch (ex) {
    console.log(ex.message);
  }
};

exports.updateCruiseByID = async (req, res, next) => {
  const { error } = validateCruise(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res
      .status(400)
      .send({ message: `Cannot update Cruise with path id=${id}!` });

  const ship = await Ship.findById(req.body.shipId).catch((err) =>
    res.status(500).send({
      message: `Error finding ship with id: ${req.body.shipId}`,
    })
  );

  if (!ship)
    return res.status(400).send({
      message: `Cannot find ship with given id= ${req.body.shipId}`,
    });

  await Cruise.findByIdAndUpdate(id, req.body, {
    useFindAndModify: false,
    new: true,
  })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Cruise with id=${id}!`,
        });
      } else res.send({ message: "Cruise was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Cruise with id=" + id,
      });
      console.log(err);
    });
};

exports.deleteCruiseByID = async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res
      .status(400)
      .send({ message: `Cannot delete Cruise with path id=${req.params.id}!` });

  await Cruise.findByIdAndDelete(req.params.id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Cruise with id=${req.params.id}.`,
        });
      } else res.send({ message: "Cruise was deleted successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error deleting Cruise with id=" + req.params.id,
      });
    });
};

exports.deleteAllCruises = async (req, res, next) => {
  await Cruise.deleteMany()
    .then((data) => {
      if (!data) {
        return res.status(404).send({
          message: `Cannot delete Cruise. No content found.`,
        });
      } else res.send({ message: "Cruise deleted successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error deleting Cruise",
      });
    });
};

exports.createCruiseWithCSV = async (req, res, next) => {
  // Check if a file is provided
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const bufferStream = new streamifier.createReadStream(req.file.buffer);
  bufferStream
    .pipe(csv())
    .on("data", (row) => {
      const {
        name,
        provider,
        cruiseImg,
        cruiseLineImg,
        depatureDestination,
        arivalDestination,
        depatureDate,
        arrivalDate,
        Duration,
        ratings,
        shipId,
        portOfCall,
        bestFor,
        baseFare,
        baseTax,
      } = row;
      const cruiseObj = {
        name,
        provider,
        cruiseImg,
        cruiseLineImg,
        depatureDestination,
        arivalDestination,
        depatureDate,
        arrivalDate,
        Duration,
        ratings,
        shipId,
        portOfCall,
        bestFor,
        baseFare,
        baseTax,
        bonusDetails: {
          visaGiftCard: row.visaGiftCard,
          depositNonRefundable: row.depositNonRefundable,
        },
      };

      console.log(cruiseObj);

      const { error } = Cruise.validate(cruiseObj);
      if (error) {
        return res.status(400).send(error.details[0].message);
      } else {
        const cruise = new Cruise(cruiseObj);
        cruise
          .save()
          .then((doc) => console.log("Document inserted", doc))
          .catch((err) => console.error("Error inserting document", err));
      }
    })
    .on("end", () => {
      res.send("File processed successfully");
    });
};

// essential functions
exports.searchCruise = async (req, res, next) => {
  const { pageNo, limitNo, deckNo, cabinClass, ...search } = req.query;
  const page = parseInt(pageNo) || 1;
  const limit = parseInt(limitNo) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const results = {};

  if (endIndex < (await Cruise.countDocuments().exec())) {
    results.next = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit,
    };
  }

  const { error } = validateSearchQuery(search);
  if (error) return res.status(400).send(error.details[0].message);

  results.current = await Cruise.find(search)
    .limit(limit)
    .skip(startIndex)
    .exec();

  res.send(results);
};

exports.sortCruise = async (req, res, next) => {
  const sortField = req.query.sortField;
  const sortOrder = req.query.sortOrder || "asc";

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const results = {};

  if (endIndex < (await Cruise.countDocuments().exec())) {
    results.next = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit,
    };
  }

  results.current = await Cruise.find()
    .sort({ [sortField]: sortOrder })
    .limit(limit)
    .skip(startIndex)
    .exec();

  res.send(results);
};

exports.filterCruise = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const results = {};

  if (endIndex < (await Cruise.countDocuments().exec())) {
    results.next = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit,
    };
  }

  results.current = await Cruise.find(req.body)
    .limit(limit)
    .skip(startIndex)
    .exec();

  res.send(results);
};
