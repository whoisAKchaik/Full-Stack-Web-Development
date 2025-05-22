//Import the model module
const model = require("../models/seedModel.js");

//Implement the printAllSeeds function 
module.exports.printAllSeeds = (req, res, next) =>
{
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error printAllSeeds:", error);
            res.status(500).json(error);
        } 
        else res.status(200).json(results);
    }

    model.selectAll(callback);
}

//Implement the middleware function to check seed existence and its information
module.exports.checkSeedsDetails = (req, res, next) =>
{
    const seedId = req.body.seed_id ? parseInt(req.body.seed_id) : parseInt(req.params.seed_id);
    const data = {
        seed_id: seedId,
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkSeedsExistence:", error);
            res.status(500).json(error);
        } else {
            if(results.length === 0) {
                res.status(404).json({
                    message: "Seed not found"
                });
                return;
            } 

            //Storing Seed information in res.locals objects
            const seedName = results[0].seed_name; 
            const seedType = results[0].seed_type; 
            const growthRate = results[0].growth_rate; 
            const growthStage = results[0].growth_stage; 
            const seedPrice = results[0].seed_price; 
      
            res.locals.seedName = seedName;
            res.locals.seedType = seedType;
            res.locals.growthRate = growthRate;
            res.locals.growthStage = growthStage;
            res.locals.seedPrice = seedPrice;

            next();
        }
    };

    model.selectSeedById(data, callback);
}