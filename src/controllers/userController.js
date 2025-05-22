//Import the model module
const model = require("../models/userModel.js");
const ecoCadetModel = require("../models/ecoCadetModel.js");
const seedModel = require("../models/seedModel.js");

//Implement the readAllUser function 
module.exports.readAllUser = (req, res, next) =>
{
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readAllUser:", error);
            res.status(500).json(error);
        } 
        else res.status(200).json(results);
    }

    model.selectAll(callback);
}

//Implement the createUser function 
module.exports.createNewUser = (req, res, next) =>
    {
        if(req.body.username == undefined || req.body.username.trim() === "" )
        {
            res.status(400).json({
                message: "Error: username is undefined"
            });
            return;
        }

        const data = {
            username: req.body.username.trim(),
        }
    
        const callback = (error, results, fields) => {
            if (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                res.status(409).json({
                    message: "Error: username already exists"
                });
            } else {
                console.error("Error createNewUser:", error);
                res.status(500).json(error);
            }
            } else {
                res.status(201).json({
                    user_id: results.insertId,
                    username: req.body.username, 
                    points: 0
                });
            }
        }
    
        model.insertSingle(data, callback);
    }

//Implement the readUserById function 
module.exports.readUserById = (req, res, next) =>
{
    const data = {
        user_id: req.params.user_id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readUserById:", error);
            res.status(500).json(error);
        } else {
            if(results.length == 0) 
            {
                res.status(404).json({
                    message: "User not found"
                });
            }
            else res.status(200).json(results[0]);
        }
    }

    model.selectById(data, callback);
}

//Implement the updateUserById function 
module.exports.updateUserById = (req, res, next) =>
{
    if(req.body.username == undefined)
    {
        res.status(400).json({
            message: "Error: username is undefined"
        });
        return;
    }

    const data = {
        user_id: req.params.user_id,
        username: req.body.username,
    }

    const callback = (error, results, fields) => {
        if (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                res.status(409).json({
                    message: "Error: username already exists"
                });
            }
        } else {
            if(results.affectedRows == 0) 
            {
                res.status(404).json({
                    message: "User not found"
                });
            }
            else res.status(200).json({
                user_id: req.params.user_id,
                username: req.body.username, 
                points: req.body.points
            }); 
        }
    }

    model.updateById(data, callback);
}

//check user points
module.exports.checkUserPoints = (req, res, next) =>
{
    const data = {
        user_id: parseInt(req.params.user_id),
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkUserPoints:", error);
            res.status(500).json(error);
        } else {
            if(results.length === 0) 
            {
                res.status(404).json({
                    message: "User not found"
                });
                return;
            }
            req.body.points = results[0].points;
            next();
        }
    };

    model.selectById(data, callback);
}

//Implement the middleware function to check userId existence
module.exports.checkUserIdExistence = (req, res, next) =>
{
    const userId = req.body.user_id ? parseInt(req.body.user_id) : parseInt(req.params.user_id);
    const data = {
        user_id: userId,
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkUserIdExistence:", error);
            res.status(500).json(error);
        } else {
            if(results.length === 0) 
            {
                res.status(404).json({
                    message: "User not found"
                });
                return;
            }
            const points = results[0].points;
            const completedQuestions = results[0].completed_questions;
            res.locals.points = points;
            res.locals.completedQuestions = completedQuestions;
            next();
        }
    };

    model.selectById(data, callback);
}

//Implement the addUserPointByUserId function 
module.exports.updateUserDataByUserId = (req, res, next) =>
{
    const data = {
        user_id: req.body.user_id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error updateUserDataByUserId:", error);
            res.status(500).json(error);
        } else 
            res.status(200).json(); 
    }

    model.updateUserDataById(data, callback);
}

///////////////////////////////////////////////////////////////////////////////////
////////////////////////////////Section B - Gamification///////////////////////////
///////////////////////////////////////////////////////////////////////////////////

//Implement the deductUserPoints function 
module.exports.deductUserPoints = (req, res, next) =>
{
    const seedPrice = res.locals.seedPrice;

    const data = {
        user_id: parseInt(req.params.user_id),
        deduct_amount: seedPrice,
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error deductUserPoints:", error);
            res.status(500).json(error);
        }
        next();
    }

    model.updateUserPointById(data, callback);
}

///////////////////////////////////////////////////////////////////////////////////
                        //User Registration and Login
///////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////
// CONTROLLER FOR LOGIN
//////////////////////////////////////////////////////
module.exports.login = (req, res, next) =>
{
    if(req.body.username == undefined || req.body.password == undefined)
    {
        res.status(400).send("Error: name or password is undefined");
        return;
    }

    const data = {
        username: req.body.username,
        password: req.body.password,
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error login:", error);
            res.status(500).json(error);
        } else {
            if (results.length === 0) {
                res.status(404).json({
                    message: `User not found`,
                });
                return;
            } else {
                const user = results[0];
                console.log(user.user_id);
                res.locals.userId = user.user_id;
                res.locals.hash = user.password;
                next();
            }
        }
    };

    model.selectUserByUsername(data, callback);
}
    
//////////////////////////////////////////////////////
// CONTROLLER FOR REGISTER
//////////////////////////////////////////////////////
module.exports.register = (req, res, next) =>
{
    if(req.body.username == undefined || req.body.email == undefined || req.body.password == undefined)
    {
        res.status(400).send("Error: name or email or password is undefined");
        return;
    }

    const data = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        hash: res.locals.hash
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error register:", error);
            res.status(500).json(error);
        } else {
            res.locals.userId = results.insertId;
            next();
        }
    }

    model.insertSingle(data, callback);
}

//////////////////////////////////////////////////////
// MIDDLEWARE FOR CHECK IF USERNAME OR EMAIL EXISTS
//////////////////////////////////////////////////////
module.exports.checkUsernameOrEmailExist = (req, res, next) =>
{
    const data = {
        username: req.body.username,
        email: req.body.email
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkUsernameOrEmailExist:", error);
            res.status(500).json(error);
        } else {
            if (results.length > 0) {
                const existingUser = results[0];
                if (existingUser.username === data.username || existingUser.email === data.email) {
                    res.status(409).json({
                        message: "Username or email already exists"
                    });
                    return;
                }
            }
            next();
        }
    };

    model.selectUserByUsernameOrEmail(data, callback);
}

//Implement printUserCreation function
module.exports.printUserCreation = (req, res, next) => 
{
    const data = {
        username: req.body.username
    }
    res.status(200).json({
        message: `User ${data.username} created successfully.`,
        token: res.locals.token
    });
};

