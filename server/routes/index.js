const express = require("express");
const route = express.Router();
const userController = require('../controllers/userController');
const {userValidatorRules, validate} = require('../middelwares/validator');
const isLoggedIn = require('../middelwares/auth');
const doctorController = require('../controllers/doctorController');

// User Routes
route.post("/account/signup", userValidatorRules(), validate, userController.register);
route.post("/account/login", userController.login);
route.get("/account/me", isLoggedIn, userController.me);
route.get("/account/profile", isLoggedIn, userController.getProfile);
route.put("/account/update", isLoggedIn, userController.update);
route.delete("/account/delete", isLoggedIn, userController.delete);

// Doctor Routes
route.get("/doctors", doctorController.index);

module.exports = route;
