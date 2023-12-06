const express = require("express");
const routes = express.Router();
const userController = require("../controllers/userController");
const userMiddleware = require("../middlewares/userMiddleware");

// User Routes
routes.post("/user/register", userController.registerUser);
routes.post("/user/login", userController.loginUser);
routes.get("/users", userMiddleware, userController.getAllUsers);
routes.delete("/users", userMiddleware, userController.deleteUser);

module.exports = routes;
