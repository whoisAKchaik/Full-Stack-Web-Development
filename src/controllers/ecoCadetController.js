//Import the model module
const model = require("../models/ecoCadetModel.js");

//Implement the printEcoCadet function 
module.exports.printEcoCadetByUserId = (req, res, next) =>
{
    const userId = parseInt(req.params.user_id);
    const data = {
        user_id: userId
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error printEcoCadetByUserId:", error);
            res.status(500).json(error);
        } else {
            if(results.length == 0) 
            {
                res.status(404).json({
                    message: "Ecocadet not found"
                });
                return;
            }
            else res.status(200).json(results[0]);
        }
    }

    model.selectEcoCadetByUserId(data, callback);
}

//Implement the printEcoCadetInfo function 
module.exports.printEcoCadetInfo = (req, res, next) =>
{
    const cadetId = parseInt(req.params.cadet_id);
    const data = {
        cadet_id: cadetId
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error printEcoCadetInfo:", error);
            res.status(500).json(error);
        } else {
            if(results.length == 0) 
            {
                res.status(404).json({
                    message: "EcocadetInfo not found"
                });
                return;
            }
            else res.status(200).json(results);
        }
    }

    model.selectEcoCadetInfoByCadetId(data, callback);
}

//Implement the createNewEcoCadet function 
module.exports.createNewEcoCadet = (req, res, next) =>
{
    if(req.body.cadet_name == undefined || req.body.cadet_name.trim() === "")
    {
        res.status(400).json({
            message: "Error: cadet_name is undefined"
        });
        return;
    }

    const ecoCadetQualificationThredshold = 50;
    const data = {
        cadet_name: req.body.cadet_name.trim(),
        user_id: parseInt(req.params.user_id),
        points: req.body.points
    }

    if(data.points < ecoCadetQualificationThredshold){
        res.status(403).json({
            message: "Not enough points"
        });
        return;
    }

    const callback = (error, results, fields) => {
        if (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(409).json({
                message: "Error: cadetname already exists or one user can create only one cadet"
            });
        } else {
            console.error("Error createNewEcoCadet:", error);
            res.status(500).json(error);
        }
        } else {
            req.body.cadet_id = results.insertId
            next();
        }
    }

    model.insertSingleEcoCadet(data, callback);
}

//Implement the middleware function to check cadetId existence
module.exports.checkCadetExistence = (req, res, next) =>
{
    const cadetId = req.body.cadet_id ? parseInt(req.body.cadet_id) : parseInt(req.params.cadet_id);
    const userId = req.body.user_id ? parseInt(req.body.user_id) : parseInt(req.params.user_id);
    const data = {
        cadet_id: cadetId,
        user_id: userId
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkCadetIdExistence:", error);
            res.status(500).json(error);
        } else {
            if(results.length === 0) {
                res.status(404).json({
                    message: "Cadet not found"
                });
                return;
            }
            const rewardPoint = results[0].reward_point;
            const user_id = results[0].user_id;
            res.locals.user_id = user_id;
            res.locals.rewardPoint = rewardPoint;
            next();
        }
    };

    model.selectEcoCadetById(data, callback);
}

//Implement the updateEcoCadet function 
module.exports.updateEcoCadet = (req, res, next) =>
{
    if(req.body.cadet_name == undefined)
    {
        res.status(400).json({
            message: "Error: cadet_name is undefined"
        });
        return;
    }

    const data = {
        cadet_id: parseInt(req.params.cadet_id),
        cadet_name: req.body.cadet_name
    }

    const callback = (error, results, fields) => {
        if (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                res.status(409).json({
                    message: "Error: cadet_name already exists"
                });
            }
        } else {
            if(results.affectedRows == 0) 
            {
                res.status(404).json({
                    message: "Cadet not found"
                });
                return;
            }
            next();
        }
    }

    model.updateEcoCadetByCadetId(data, callback);
}

//Implement the middleware function to check cadet's reward point
module.exports.checkRewardPoint = (req, res, next) =>
{
    const cadetId = req.body.cadet_id ? parseInt(req.body.cadet_id) : parseInt(req.params.cadet_id);
    const data = {
        cadet_id: cadetId
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkRewardPoint:", error);
            res.status(500).json(error);
        } else {
            if(results.length === 0) {
                res.status(404).json({
                    message: "Cadet not found"
                });
                return;
            }
            req.body.reward_point = results[0].reward_point;        //To check the amount of reward point in purchasing seed
            next();
        }
    };

    model.selectEcoCadetById(data, callback);
}

//Implement the updatePossesion function 
module.exports.updatePossesion = (req, res, next) =>
{   
    const asset = 1;
    const data = {
        cadet_id: parseInt(req.params.cadet_id),
        asset: asset
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error updatePossesion:", error);
            res.status(500).json(error);
        } else {
            next();
        }
    }

    model.updateAssetValueByCadetId(data, callback);
}

//Implement the updateCadetRewardPoint function 
module.exports.updateCadetRewardPoint = (req, res, next) =>
{
    const growthStage = res.locals.growthStage;    
    const rewardPoint = res.locals.reward_point; 
    const message = res.locals.message;       

    const data = {
        cadet_id: parseInt(req.params.cadet_id),
        reward_point: rewardPoint
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error updateCadetRewardPoint:", error);
            res.status(500).json(error);
        } else {
            res.status(200).json({
                message: message,
                growth_stage: growthStage,
                reward_points: rewardPoint
            }); 
        }
    }

    model.updateCadetRewardPointById(data, callback);
}

//Implement the checkCadetOwnership function 
module.exports.checkCadetOwnership = (req, res, next) =>
{
    const userId = req.body.user_id ? parseInt(req.body.user_id) : parseInt(req.params.user_id);
    const cadetId = req.body.cadet_id ? parseInt(req.body.cadet_id) : parseInt(req.params.cadet_id);

    const data = {
        user_id: userId,
        cadet_id: cadetId
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkQuestionOwnership:", error);
            res.status(500).json(error);
        } else {
                const user_id = results[0].user_id;
                if( user_id != data.user_id){
                res.status(403).json({
                    message: "This eco-cadet does not belong to user."
                });
                return;
            }
            next();
        }
    };
    model.selectEcoCadetById(data, callback);
}