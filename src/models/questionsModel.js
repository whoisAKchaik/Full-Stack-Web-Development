const pool = require('../services/db');

module.exports.insertSingle = (data, callback) =>
{
    const SQLSTATMENT = `
    INSERT INTO SurveyQuestion (question, creator_id)
    VALUES (?, ?);
    `;
const VALUES = [data.question, data.user_id];

pool.query(SQLSTATMENT, VALUES, callback);
}

module.exports.selectAll = (callback) =>
{
    const SQLSTATMENT = `
    SELECT * FROM SurveyQuestion;
    `;

pool.query(SQLSTATMENT, callback);
}

module.exports.selectById = (data, callback) =>
{
    const SQLSTATMENT = `
    SELECT * FROM SurveyQuestion
    WHERE question_id = ?;
    `;
const VALUES = [data.question_id];

pool.query(SQLSTATMENT, VALUES, callback);
}

module.exports.updateById = (data, callback) =>
{
    const SQLSTATMENT = `
    UPDATE SurveyQuestion 
    SET question = ?
    WHERE question_id = ?;
    `;
const VALUES = [data.question, data.question_id];

pool.query(SQLSTATMENT, VALUES, callback);
}

module.exports.insertAnswerByQuestionId = (data, callback) =>
{
    const SQLSTATMENT = `
    INSERT INTO UserAnswer (answered_question_id, participant_id, answer, creation_date, additional_notes)
    VALUES (?, ?, ?, ?, ?);
    `;
const VALUES = [data.answered_question_id, data.user_id, data.answer, data.creation_date, data.additional_notes];

pool.query(SQLSTATMENT, VALUES, callback);
}

module.exports.selectAnsweredQuestionId = (data, callback) =>
{
    const SQLSTATMENT = `
    SELECT * FROM UserAnswer
    WHERE answered_question_id = ?;
    `;
const VALUES = [data.answered_question_id];

pool.query(SQLSTATMENT, VALUES, callback);
}

// module.exports.selectAllAnswersById = (data, callback) =>
// {
//     const SQLSTATMENT = `
//     SELECT participant_id, answer, creation_date, additional_notes FROM UserAnswer
//     WHERE answered_question_id = ?;
//     `;
// const VALUES = [data.answered_question_id];

// pool.query(SQLSTATMENT, VALUES, callback);
// }

module.exports.selectAllAnswersById = (data, callback) =>
{
    const SQLSTATMENT = `
    SELECT answered_question_id, participant_id, answer, creation_date, additional_notes, user_id, username FROM UserAnswer 
    INNER JOIN User ON UserAnswer.participant_id = User.user_id
    WHERE UserAnswer.answered_question_id = ?;
    `;
const VALUES = [data.answered_question_id];

pool.query(SQLSTATMENT, VALUES, callback);
}

module.exports.deleteById = (data, callback) =>
{
    const SQLSTATMENT = `
    DELETE FROM SurveyQuestion 
    WHERE question_id = ?;
    `;
const VALUES = [data.question_id];

pool.query(SQLSTATMENT, VALUES, callback);
}

module.exports.deleteAssociatedUserAnswer = (data, callback) =>
{
    const SQLSTATMENT = `
    DELETE FROM UserAnswer 
    WHERE answered_question_id = ?;
    `;
const VALUES = [data.answered_question_id];

pool.query(SQLSTATMENT, VALUES, callback);
}