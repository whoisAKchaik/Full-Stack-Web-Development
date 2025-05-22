// Import the required modules:
const express = require('express');
const router = express.Router();

// Import the userRoutes:
const userRoutes = require('./userRoutes');

// Import the questionsRoutes:
const questionsRoutes = require('./questionsRoutes');

// Import the reviewRoutes:
const reviewRoutes = require('./reviewRoutes');

//////////////////////////////////////////////////////
// Import the Controller module:
//////////////////////////////////////////////////////
const userController = require('../controllers/userController');
const bcryptMiddleware = require('../middlewares/bcryptMiddleware');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

// Define the routes:
router.use("/users", userRoutes);
router.use("/questions", questionsRoutes);
router.use("/reviews", reviewRoutes);

//Define routes for users register/login
router.post("/login", userController.login, bcryptMiddleware.comparePassword, jwtMiddleware.generateToken, jwtMiddleware.sendToken);
router.post("/register", userController.checkUsernameOrEmailExist, bcryptMiddleware.hashPassword, userController.register, jwtMiddleware.generateToken, userController.printUserCreation);
router.get("/verify", jwtMiddleware.verifyToken);

// Export the router:
module.exports = router;

