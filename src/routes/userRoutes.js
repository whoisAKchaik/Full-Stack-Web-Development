// Import the required modules and create a router object:
const express = require('express');
const router = express.Router();

// Import the playerController module: 
const controller = require('../controllers/userController');
const ecoCadetController = require('../controllers/ecoCadetController');
const seedController = require('../controllers/seedController');
const inventoryController = require('../controllers/inventoryController');


// Define the routes and associate them with the corresponding controller functions:
router.get('/', controller.readAllUser);
router.post('/', controller.createNewUser);
router.get('/:user_id', controller.readUserById);
router.put('/:user_id', controller.checkUserPoints, controller.updateUserById);

//create Eco-cadet
router.post('/:user_id/ecoCadet', controller.checkUserIdExistence, controller.checkUserPoints, ecoCadetController.createNewEcoCadet, ecoCadetController.printEcoCadetByUserId);

//Get an ecoCadet by user_id
// router.get('/:user_id/ecoCadet/:cadet_id', controller.checkUserIdExistence, ecoCadetController.checkCadetExistence, ecoCadetController.checkCadetOwnership, ecoCadetController.printEcoCadetById);
router.get('/:user_id/ecoCadet', controller.checkUserIdExistence, ecoCadetController.printEcoCadetByUserId);

//Get ecoCadetInfo by cadet_id
router.get('/:user_id/ecoCadet/:cadet_id', controller.checkUserIdExistence, ecoCadetController.checkCadetExistence, ecoCadetController.checkCadetOwnership, ecoCadetController.printEcoCadetInfo);

//update Eco-cadet name
router.put('/:user_id/ecoCadet/:cadet_id', controller.checkUserIdExistence, ecoCadetController.checkCadetExistence, ecoCadetController.checkCadetOwnership, ecoCadetController.updateEcoCadet, ecoCadetController.printEcoCadetByUserId);

//Search all seeds
router.get('/:user_id/ecoCadet/:cadet_id/seeds', controller.checkUserIdExistence, ecoCadetController.checkCadetExistence, ecoCadetController.checkCadetOwnership, seedController.printAllSeeds);

//buy seed
router.post('/:user_id/ecoCadet/:cadet_id/seeds/:seed_id/purchase', controller.checkUserIdExistence, ecoCadetController.checkCadetExistence, ecoCadetController.checkCadetOwnership, seedController.checkSeedsDetails, inventoryController.purchaseSeed, controller.deductUserPoints, ecoCadetController.updatePossesion, inventoryController.printInventory);

//search cadet's inventory
router.get('/:user_id/ecoCadet/:cadet_id/inventory', controller.checkUserIdExistence, ecoCadetController.checkCadetExistence, ecoCadetController.checkCadetOwnership, inventoryController.printAllInventoryByCadetId);

//grow seed (action parameter must be "grow")
router.put('/:user_id/ecoCadet/:cadet_id/inventory/:inventory_id/grow/:action', controller.checkUserIdExistence, ecoCadetController.checkCadetExistence, ecoCadetController.checkCadetOwnership, inventoryController.checkInventoryOwnership, inventoryController.checkInventoryDetails, inventoryController.growSeed, ecoCadetController.updateCadetRewardPoint);

//water seed (action parameter must be "water")
router.put('/:user_id/ecoCadet/:cadet_id/inventory/:inventory_id/water/:action', controller.checkUserIdExistence, ecoCadetController.checkCadetExistence, ecoCadetController.checkCadetOwnership, inventoryController.checkInventoryOwnership, inventoryController.checkInventoryDetails, inventoryController.waterSeed, ecoCadetController.updateCadetRewardPoint);


// Export the router object:
module.exports = router;