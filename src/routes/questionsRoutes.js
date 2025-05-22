// Import the required modules and create a router object:
const express = require('express');
const router = express.Router();

// Import the playerController module: 
const controller = require('../controllers/questionsController');
const userController = require('../controllers/userController');

// Define the routes and associate them with the corresponding controller functions:
router.get('/', controller.readAllQuestions);
router.post('/', controller.createNewQuestions);
router.put('/:question_id', controller.checkQuestionOwnership, controller.updateQuestionsById);
router.delete('/:question_id', controller.checkQuestionOwnership, controller.deleteQuestionById, controller.deleteAssociatedUserAnswer);
router.post('/:questions_id/answers', controller.checkQuestionIdExistence, controller.createAnswerByQuestionId, userController.updateUserDataByUserId);
router.get('/:questions_id/answers', controller.checkAnswerExistenceByQuestionId, controller.readAllAnswersByQuestionId);
// Export the router object:
module.exports = router;