//Import the model module
const model = require("../models/inventoryModel.js");

//Implement the printAllInventoryByCadetId function 
module.exports.printAllInventoryByCadetId = (req, res, next) =>
{
    const data = {
        cadet_id: parseInt(req.params.cadet_id),
    }
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error printAllInventory:", error);
            res.status(500).json(error);
        } 
        else {
            if(results.length === 0) {
                res.status(404).json({
                    message: "Inventory not found"
                });
            } else {
                res.status(200).json(results);
            }
        }

    }

    model.selectAllByCadetId(data, callback);
}

//Implement the purchaseSeed function 
module.exports.purchaseSeed = (req, res, next) =>
{
    if(req.body.seed_id == undefined)
    {
        res.status(400).json({
            message: "Error: seed_id is undefined"
        });
        return;
    }

    const seedName = res.locals.seedName;
    const seedType = res.locals.seedType;
    const growthRate = res.locals.growthRate;
    const growthStage = res.locals.growthStage;
    const seedPrice = res.locals.seedPrice;
    const userPoints = res.locals.points;

    const data = {
        ordered_seed_id: req.body.seed_id,
        cadet_id: parseInt(req.params.cadet_id),
        seed_id: parseInt(req.params.seed_id),
        seed_name: seedName,
        seed_type: seedType,
        growth_rate: growthRate,
        growth_stage: growthStage,
        seed_price: seedPrice
    }

    // Check if the ordered seed_id matches the provided seed_id
    if (data.ordered_seed_id != data.seed_id) {
        res.status(403).json({
            message: "Seed ID mismatch"
        });
        return;
    }

    // Check if user has enough points to purchase
    if (userPoints < seedPrice) {
        res.status(403).json({
            message: "Not enough points"
        });
        return;
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error purchaseSeed:", error);
            res.status(500).json(error);
        }
        req.body.inventory_id = results.insertId;       //Import inserted inventory id to the coming function
        next();
    }

    model.insertCadetsInventory(data, callback);
}

//Implement the printInventory function 
module.exports.printInventory = (req, res, next) =>
{
    const inventoryId = req.body.inventory_id ? parseInt(req.body.inventory_id) : parseInt(req.params.inventory_id);
    const data = {
        inventory_id: inventoryId
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error printInventory:", error);
            res.status(500).json(error);
        } else {
            if(results.length == 0) 
            {
                res.status(404).json({
                    message: "Inventory not found"
                });
                return;
            }
            else res.status(200).json({
                message: "Purchase successful..",
                purchasedItem: results[0]
            });
        }
    }

    model.selectInventoryById(data, callback);
}

//Implement the checkInventoryOwnership function 
module.exports.checkInventoryOwnership = (req, res, next) =>
{
    const cadetId = req.body.cadet_id ? parseInt(req.body.cadet_id) : parseInt(req.params.cadet_id);
    const inventoryId = req.body.inventory_id ? parseInt(req.body.inventory_id) : parseInt(req.params.inventory_id);

    const data = {
        cadet_id: cadetId,
        inventory_id: inventoryId
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkInventoryOwnership:", error);
            res.status(500).json(error);
        } else {
            if(results.length === 0) {
                res.status(404).json({
                    message: "Inventory not found"
                });
                return;
            } else {
                const cadet_id = results[0].cadet_id;
                if( cadet_id != data.cadet_id){
                    res.status(403).json({
                        message: "You do not own this inventory!"
                    });
                return;
                }
            }
            next();
        }
    };
    model.selectInventoryById(data, callback);
}

//Implement the middleware function to check inventory existence and its information
module.exports.checkInventoryDetails = (req, res, next) =>
{
    const inventoryId = req.body.inventory_id ? parseInt(req.body.inventory_id) : parseInt(req.params.inventory_id);
    const data = {
        inventory_id: inventoryId,
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkInventoryDetails:", error);
            res.status(500).json(error);
        } else {
            if(results.length === 0) {
                res.status(404).json({
                    message: "Inventory not found"
                });
                return;
            } 

            //Check Seed status
            if (results[0].grown && req.params.action == "grow") {
                res.status(403).json({
                    message: "Seed has already been grown"
                });
                return;
            }

            
            //Storing Seed information in res.locals objects 
            const growthRate = results[0].growth_rate; 
            res.locals.growthRate = growthRate;
            next();
        }
    };

    model.selectInventoryById(data, callback);
}

//Implement the growSeed function 
module.exports.growSeed = (req, res, next) =>
{
    const minGrowthStage = 1; 
    const maxGrowthStage = 5; 
    const RandomGrowthStage = Math.floor(Math.random() * (maxGrowthStage - minGrowthStage + 1)) + minGrowthStage;        //Set random growth_stage value after growing a seed
    const growthRate = res.locals.growthRate;                 //Retrieve stored growthRate
    const rewardPoint = growthRate * RandomGrowthStage;       //Reward point calculation

    const data = {
        inventory_id: parseInt(req.params.inventory_id),
        growth_stage: RandomGrowthStage,
        grown: true
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error growSeed:", error);
            res.status(500).json(error);
        } else {
            if(req.params.action == "grow"){
                res.locals.message = `Grew seed successfully..`;
                res.locals.reward_point = rewardPoint;       //store rewardPoint in res.locals obj
                res.locals.growthStage = RandomGrowthStage;       //Store RandomGrowthStage into res.locals obj
                next();
            } else {
                res.status(404).json({
                    message: "Unknown Action!"
                });
                return;
            }
        }
    }

    model.updateInventoryById(data, callback);
}

//Implement the waterSeed function 
module.exports.waterSeed = (req, res, next) =>
{
    const completedQuestions = res.locals.completedQuestions;
    const lowActivityTier = 20;
    const highActivityTier = Math.floor(Math.random() * (100 - 20 + 1)) + 20;  //randomly from 20 questions to 100
    let RandomGrowthStage;
    if(completedQuestions <= lowActivityTier) {
        const minGrowthStage = 2; 
        const maxGrowthStage = 7; 
        RandomGrowthStage = Math.floor(Math.random() * (maxGrowthStage - minGrowthStage + 1)) + minGrowthStage; //Set random growth_stage value after growing a seed
    } else if(completedQuestions >= highActivityTier){
        const minGrowthStage = 7; 
        const maxGrowthStage = 15; 
        RandomGrowthStage = Math.floor(Math.random() * (maxGrowthStage - minGrowthStage + 1)) + minGrowthStage; 
    } else {
        RandomGrowthStage = 8;
    }
    const growthRate = res.locals.growthRate;                 //Retrieve stored growthRate
    const rewardPoint = growthRate * RandomGrowthStage;       //Reward point calculation
    
    const data = {
        inventory_id: parseInt(req.params.inventory_id),
        growth_stage: RandomGrowthStage,
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error waterSeed:", error);
            res.status(500).json(error);
        } else {
            if(req.params.action == "water"){
                res.locals.message = `Watered seed successfully..`;
                res.locals.reward_point = rewardPoint;       //store rewardPoint in res.locals obj
                res.locals.growthStage = RandomGrowthStage;       //Store RandomGrowthStage into res.locals obj
                next();
            } else {
                res.status(404).json({
                    message: "Unknown Action!"
                });
                return;
            }
        }
    }

    model.updateInventory(data, callback);
}
