const { Cart, validateCart } = require("../../models/cruise/cart");
const { Cruise } = require("../../models/cruise/cruise");
const { Order, validateOrder } = require("../../models/cruise/order");
const { Ship } = require("../../models/cruise/ship");

// cart
exports.getAllCartItemsForUser = async (req, res, next) => {
  const userId = req.user._id;

  const userCartArray = await Cart.findOne({ userId });

  if (
    !userCartArray ||
    userCartArray.length === 0 ||
    userCartArray.items.length === 0
  ) {
    return res.status(200).send({ message: "No items in the cart." });
  }

  res.send({ userCartArray });
};

exports.deleteAllLockedCabinsAfterTimeOut = async (req, res, next) => {
  const userId = req.user._id;

  const cart = await Cart.findOne({ userId });

  if (!cart) {
    return res.status(404).send({ message: "Cart not found" });
  }

  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
  const itemsToDelete = cart.items.filter(
    (item) => item.updatedAt < fifteenMinutesAgo
  );

  if (!itemsToDelete && itemsToDelete.length === 0) {
    return res.status(404).send({ message: "no cart items found to delete." });
  }

  cart.items.splice(itemIndex, 1);

  await cart.save();
};

exports.getCartItemsCount = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(200).send({ count: 0 });
    }

    const itemCount = cart.items.length;

    res.status(200).send({ count: itemCount });
  } catch (error) {
    res.status(500).send({
      message: "Error retrieving the cart items count: " + error.message,
    });
  }
};

exports.createOrUpdateCartItemForUser = async (req, res, next) => {
  const { error } = validateCart(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let subTotal = 0;
  let totalTaxFare = 0;
  let totalAmount = 0;

  const { noOfPassengers, cruiseReservation } = req.body;
  const userId = req.user._id;

  // set the locked property
  const cabinId = await setLockedPropOfAvailableCabin(
    noOfPassengers,
    cruiseReservation
  );

  if (!cabinId) {
    return res.status(400).send({ message: "No cabins available right now." });
  }
  // console.log(cabinId);
  cruiseReservation.cabinId = cabinId;

  let cart = await Cart.findOne({ userId });

  if (cart) {
    // get fare based on the cabin type and deck
    const { baseFare, baseTax } = await getFareByCabinAndDeck(
      noOfPassengers,
      cruiseReservation
    );

    const newCartItem = {
      noOfPassengers,
      cruiseReservation,
      total: baseFare,
      tax: baseTax,
    };

    cart.items.push(newCartItem);

    const totals = cart.items.reduce(
      (acc, item) => {
        acc.subtotal += item.total;
        acc.totalTaxFare += item.tax;
        return acc;
      },
      { subtotal: 0, totalTaxFare: 0 }
    );

    cart.subTotal = totals.subtotal;
    cart.totalTaxFare = totals.totalTaxFare;
    cart.totalAmount = totals.subtotal + totals.totalTaxFare;
  } else {
    const { baseFare, baseTax } = await getFareByCabinAndDeck(
      noOfPassengers,
      cruiseReservation
    );

    subTotal = baseFare;
    totalTaxFare = baseTax;
    totalAmount = baseFare + baseTax;

    cart = new Cart({
      userId,
      items: [
        {
          noOfPassengers,
          cruiseReservation,
          total: baseFare,
          tax: baseTax,
        },
      ],
      subTotal,
      totalTaxFare,
      totalAmount,
    });
  }

  console.log(cart);

  try {
    await cart.save();
    res.status(201).send(cart);
  } catch (ex) {
    console.log(ex.message);
  }
};

const setLockedPropOfAvailableCabin = async (
  noOfPassengers,
  cruiseReservation
) => {
  const shipId = cruiseReservation.shipId;
  const cabinType = cruiseReservation.cabinType;
  const deckNo = cruiseReservation.deckNo;

  return await Ship.findById(shipId)
    .then((ship) => {
      const cabinIdList = [];
      if (!ship) {
        console.log(`No data found for Ship with id=${shipId}!`);
      } else {
        ship.deckAndCabin.deck.forEach((deck) => {
          if (deck.deckNumber === deckNo) {
            deck.cabin.forEach((cabin) => {
              if (cabin.type == cabinType) {
                if (cabin.maxGuests === noOfPassengers) {
                  if (!cabin.booked && !cabin.locked) {
                    //available cabin
                    cabinIdList.push({
                      deckIndex: deck._id,
                      cabinIndex: cabin._id,
                      deckNo: deck.deckNumber,
                      roomNo: cabin.roomNo,
                    });
                  }
                }
              }
            });
          }
        });
        return cabinIdList;
      }
    })
    .then(async (cabinIdList) => {
      if (cabinIdList && cabinIdList.length > 0) {
        const { deckIndex, cabinIndex, deckNo, roomNo } = cabinIdList[0];

        const query = {
          _id: shipId,
        };

        const update = {
          $set: {
            "deckAndCabin.deck.$[deck].cabin.$[cabin].locked": true,
          },
        };

        // Array filters to identify the specific deck and cabin
        const options = {
          arrayFilters: [
            { "deck._id": deckIndex },
            { "cabin._id": cabinIndex },
          ],
          new: true, // Return the modified document
        };

        await Ship.findOneAndUpdate(query, update, options)
          .then((updatedDocument) => {
            console.log("Updated document");
          })
          .catch((err) => {
            console.error("Error updating document:", err);
          });
        return cabinIndex;
      }
    });
};

const getFareByCabinAndDeck = async (noOfPassengers, cruiseReservation) => {
  const cruiseId = cruiseReservation.cruiseId;
  const shipId = cruiseReservation.shipId;
  const cabinType = cruiseReservation.cabinType;
  const deckNo = cruiseReservation.deckNo;

  let baseFare = 0;
  let baseTax = 0;
  // get base price fare and tax fare
  await Cruise.findById(cruiseId)
    .then((data) => {
      if (!data) {
        console.log(`No data found for Cruise with id=${cruiseId}!`);
      } else {
        baseFare = data.baseFare;
        baseTax = data.baseTax;
      }
    })
    .catch((err) => {
      console.log("Error retrieving Cruise with id=" + cruiseId);
      console.log(err);
    });

  // if it is default get the base fare from cruise
  if (cabinType !== "default") {
    await Ship.findById(shipId).then((ship) => {
      if (!ship) {
        console.log(`No data found for Ship with id=${shipId}!`);
      } else {
        ship.deckAndCabin.deck.forEach((deck) => {
          if (deck.deckNumber === deckNo) {
            deck.pricePlan.forEach((pricePlan) => {
              if (pricePlan.cabinType == cabinType) {
                if (pricePlan.maxGuests === noOfPassengers) {
                  baseFare += pricePlan.price;
                  baseTax += pricePlan.taxFare;
                }
              }
            });
          }
        });
      }
    });
  }
  return { baseFare, baseTax };
};

exports.deleteCartItemForUser = async (req, res, next) => {
  try {
    const cartItemId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(cartItemId))
      return res.status(400).send({
        message: `Cannot delete Cart Item with path id=${cartItemId}!`,
      });

    const userId = req.user._id;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).send({
        message: "Cart not found for the user.",
      });
    }

    const itemIndex = cart.items.findIndex((item) =>
      item._id.equals(cartItemId)
    );

    if (itemIndex === -1) {
      return res.status(404).send({
        message: `Cart item with id=${cartItemId} not found.`,
      });
    }

    cart.items.splice(itemIndex, 1);

    await cart.save();

    res.send({ message: "Cart Item was removed successfully." });
  } catch (err) {
    res.status(500).send({
      message: "Error deleting Cart Item with id=" + cartItemId,
    });
  }
};

exports.deleteAllCartItemsForUser = async (req, res, next) => {
  await Cart.findOneAndDelete(req.user._id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Cart Items for User id=${req.user._id}.`,
        });
      } else res.send({ message: "Cart Items removed successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error deleting Cart Items for User" + req.user._id,
      });
    });
};

// orders
exports.getAllOrdersForUser = async (req, res, next) => {
  const userId = req.user._id;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const results = {};

  // Check if there's a next page
  if (endIndex < (await Order.countDocuments().exec())) {
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

  results.current = await Order.find({ userId })
    .limit(limit)
    .skip(startIndex)
    .exec();

  res.send(results);
};

exports.getOrderDetailsForUser = async (req, res, next) => {
  const userId = req.user._id;
  const orderId = req.params.id;
  await Order.find({ userId })
    .then((orders) => orders.filter((order) => order._id == orderId))
    .then((order) => {
      if (!order) {
        res.status(404).send({
          message: `Could not found order with id=${req.params.id}.`,
        });
      } else {
        res.send(order);
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Order with id=" + req.params.id,
      });
    });
};

exports.getOrderStatusForUser = async (req, res, next) => {
  const userId = req.user._id;
  const orderId = req.params.id;
  await Order.find({ _id: orderId, userId })
    .then((order) => {
      if (!order) {
        res.status(404).send({
          message: `Could not found order with id=${req.params.id}.`,
        });
      } else {
        res.send(order.orderStatus);
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Order with id=" + req.params.id,
      });
    });
};

exports.cancelOrderForUser = async (req, res, next) => {
  const userId = req.user._id;
  const orderId = req.body.orderId;
  await Order.findByIdAndDelete({ _id: orderId, userId })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete order with id=${req.params.id}.`,
        });
      } else res.send({ message: "Order deleted successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error deleting Order with id=" + req.params.id,
      });
    });
};

// checkout
exports.createOrderForUser = async (req, res, next) => {
  const { error } = validateOrder(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const order = new Order({
    userId: req.user._id,
    paymentInfo: {
      totalAmount: req.body.paymentInfo.totalAmount,
      subTotalAmount: req.body.paymentInfo.subTotalAmount,
      taxFare: req.body.paymentInfo.taxFare,
    },
    passengerInformation: req.body.passengerInformation,
    cruiseDetails: req.body.cruiseDetails,
    orderStatus: req.body.orderStatus,
  });

  try {
    await order.save();
    res.status(201).send(order);
  } catch (ex) {
    console.log(ex.message);
  }
};
