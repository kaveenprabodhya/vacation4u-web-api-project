const { default: mongoose } = require("mongoose");
const { Ship, validateShip } = require("../../models/cruise/ship");

// ship
exports.getAllShips = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 9;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const results = {};
  // Check if there's a next page
  if (endIndex < (await Ship.countDocuments().exec())) {
    results.next = {
      page: page + 1,
      limit: limit,
    };
  }
  // Check if there's a previous page
  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit,
    };
  }
  results.current = await Ship.find().limit(limit).skip(startIndex).exec();

  res.send(results);
};

exports.getShipByID = async (req, res, next) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res
      .status(400)
      .send({ message: `Cannot get Ship with path id=${id}!` });
  await Ship.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found Ship with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Ship with id=" + id,
      });
    });
};

exports.createShip = async (req, res, next) => {
  const { error } = validateShip(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const ship = new Ship({
    name: req.body.name,
    img: req.body.img,
    overview: req.body.overview,
    review: req.body.review,
    gallery: req.body.gallery,
    deckAndCabin: req.body.deckAndCabin,
    mealPreference: req.body.mealPreference,
  });

  try {
    await ship.save();
    res.status(201).send(ship);
  } catch (ex) {
    console.log(ex.message);
  }
};

exports.getShipByName = async (req, res, next) => {
  const name = req.query.name;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 9;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const results = {};

  if (endIndex < (await Ship.countDocuments().exec())) {
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

  results.current = await Ship.find({ name })
    .limit(limit)
    .skip(startIndex)
    .exec();

  res.send(results);
};

exports.updateShipByID = async (req, res, next) => {
  const { error } = validateShip(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res
      .status(400)
      .send({ message: `Cannot update Ship with path id=${id}!` });

  await Ship.findByIdAndUpdate(id, req.body, {
    useFindAndModify: false,
    new: true,
  })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Ship with id=${id}!`,
        });
      } else res.send({ message: "Ship was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Ship with id=" + id,
      });
      console.log(err);
    });
};

exports.deleteShipByID = async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res
      .status(400)
      .send({ message: `Cannot delete Ship with path id=${req.params.id}!` });

  await Ship.findByIdAndDelete(req.params.id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Ship with id=${req.params.id}.`,
        });
      } else res.send({ message: "Ship was deleted successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error deleting Ship with id=" + req.params.id,
      });
    });
};

exports.deleteAllShips = async (req, res, next) => {
  await Ship.deleteMany()
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Ships. No content found.`,
        });
      } else res.send({ message: "Ships deleted successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error deleting Ships",
      });
    });
};

// get booked cabins
exports.getAllBookedCabins = async (req, res, next) => {
  await Ship.findById(req.params.id).then((data) => {
    if (!data) {
      res.status(404).send({
        message: `Cannot find Ship with id = ${req.params.id}.`,
      });
    } else {
      const bookedCabins = [];
      data.deckAndCabin.deck.forEach((deck) => {
        // Filter out the booked cabins from each deck
        const bookedCabinsOnDeck = deck.cabin.filter((cabin) => cabin.booked);
        const bookedCabinByDeck = {
          deckNo: deck.deckNumber,
          bookedCabins: bookedCabinsOnDeck,
        };
        bookedCabins.push(bookedCabinByDeck);
      });
      return res.send(bookedCabins);
    }
  });
};

exports.getAllCabinTypes = async (req, res, next) => {
  await Ship.findById(req.params.id).then((data) => {
    if (!data) {
      res.status(404).send({
        message: `Cannot find Ship with id = ${req.params.id}.`,
      });
    } else {
      return res.send(data.deckAndCabin.allCabinTypes);
    }
  });
};

exports.getMealPreferencesByCabinType = async (req, res, next) => {
  await Ship.findById(req.params.id).then((data) => {
    if (!data) {
      res.status(404).send({
        message: `Cannot find Ship with id = ${req.params.id}.`,
      });
    } else {
      console.log(data);
      return res.send(data.mealPreference);
    }
  });
};
