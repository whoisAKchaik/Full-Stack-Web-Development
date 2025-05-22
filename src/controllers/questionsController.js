//Import the model module
const model = require("../models/questionsModel.js");

//Implement the createNewQuestions function 
module.exports.createNewQuestions = (req, res, next) =>
{
    if(req.body.question == undefined || req.body.user_id == undefined || req.body.question.trim() === "" )
    {
        res.status(400).send();
        return;
    }

    const data = {
        question: req.body.question,
        user_id: req.body.user_id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error createNewQuestions:", error);
            res.status(500).json(error);
        } else {
            res.status(201).json({
                question_id: results.insertId,
                question: req.body.question, 
                creator_id: req.body.user_id
            });
        }
    }

    model.insertSingle(data, callback);
}

//Implement the readAllQuestions function 
module.exports.readAllQuestions = (req, res, next) =>
{
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readAllQuestions:", error);
            res.status(500).json(error);
        } 
        else res.status(200).json(results);
    }

    model.selectAll(callback);
}

//Implement the middleware function to check question ownership
module.exports.checkQuestionOwnership = (req, res, next) =>
{
    if(req.body.user_id == undefined)
    {
        res.status(400).json({
            message: "Error: user_id is undefined"
        });
        return;
    }
    const data = {
        question_id: parseInt(req.params.question_id),
        user_id: req.body.user_id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkQuestionOwnership:", error);
            res.status(500).json(error);
        } else {
            if(results.length === 0) 
            {
                res.status(404).json({
                    message: "Question not found"
                });
                return;
            } else if(results[0].creator_id != data.user_id){
                res.status(403).json({
                    message: "Question does not belong to user."
                });
                return;
            }
            next();
        }
    };
    model.selectById(data, callback);
}

//Implement the updateQuestionsById function 
module.exports.updateQuestionsById = (req, res, next) =>
{
    if(req.body.question == undefined)
    {
        res.status(400).json({
            message: "Error: Question is undefined"
        });
        return;
    }

    const data = {
        question_id: parseInt(req.params.question_id),
        user_id: req.body.user_id,
        question: req.body.question,
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error updateQuestionsById:", error);
            res.status(500).json(error);
        } else {
            res.status(200).json({
            question_id: data.question_id,
            question: req.body.question, 
            creator_id: data.user_id
            }); 
        }
    }

    model.updateById(data, callback);
}

//Implement the middleware function to check questionId existence
module.exports.checkQuestionIdExistence = (req, res, next) =>
{
    const data = {
        question_id: parseInt(req.params.questions_id),
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkQuestionIdExistence:", error);
            res.status(500).json(error);
        } else {
            if(results.length === 0) 
            {
                res.status(404).json({
                    message: "Question not found"
                });
                return;
            }
            next();
        }
    };

    model.selectById(data, callback);
}

//Implement the createAnswerByQuestionId function 
module.exports.createAnswerByQuestionId = (req, res, next) =>
{
    if(req.body.answer == undefined)
    {
        res.status(400).json({
            message: "Error: Answer or date is undefined"
        });
        return;
    }

    const data = {
        user_id: req.body.user_id,
        answer: req.body.answer,
        creation_date: new Date(),
        additional_notes: req.body.additional_notes,
        answered_question_id: parseInt(req.params.questions_id)
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error createNewAnswer:", error);
            res.status(500).json(error);
        } else {
            res.status(201).json({
                answer_id: results.insertId,
                answered_question_id: req.params.questions_id, 
                participant_id: req.body.user_id,
                answer: req.body.answer,
                creation_date: req.body.creation_date,
                additional_notes: req.body.additional_notes
            });
            next();
        }
    }

    model.insertAnswerByQuestionId(data, callback);
}

//Implement the middleware function to check answers existence
module.exports.checkAnswerExistenceByQuestionId = (req, res, next) =>
{
    const data = {
        answered_question_id: parseInt(req.params.questions_id),
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkAnswerExistenceByQuestionId:", error);
            res.status(500).json(error);
        } else {
            if(results.length === 0) 
            {
                res.status(404).json({
                    message: "Answers not found"
                });
                return;
            }
            next();
        }
    };

    model.selectAnsweredQuestionId(data, callback);
}

//Implement the readAllAnswersByQuestionId function 
module.exports.readAllAnswersByQuestionId = (req, res, next) =>
{
    const data = {
        answered_question_id: parseInt(req.params.questions_id)
    }
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readAllAnswersByQuestionId:", error);
            res.status(500).json(error);
        } 
        else res.status(200).json(results);
    }

    model.selectAllAnswersById(data, callback);
}

//Implement the deleteQuestionById function 
module.exports.deleteQuestionById = (req, res, next) =>
{
    const data = {
        question_id: parseInt(req.params.question_id)
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error deleteQuestionById:", error);
            res.status(500).json(error);
        } else {
            if(results.affectedRows == 0) 
            {
                res.status(404).json({
                    message: "Question not found"
                });
                return;
            }
            next();          
        }
    }

    model.deleteById(data, callback);
}

//Implement the deleteAssociatedUserAnswer function 
module.exports.deleteAssociatedUserAnswer = (req, res, next) =>
{
    const data = {
        answered_question_id: parseInt(req.params.question_id)
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error deleteAssociatedUserAnswer:", error);
            res.status(500).json(error);
        } else res.status(204).send(); // 204 No Content            
    }

    model.deleteAssociatedUserAnswer(data, callback);
}
