const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");
const userController = require("../../controllers/authentication/userController");

router.get("/me", auth, userController.me);

router.post("/", userController.register);

module.exports = router;
