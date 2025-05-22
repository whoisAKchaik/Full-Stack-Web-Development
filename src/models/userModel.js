const pool = require('../services/db');

module.exports.selectAll = (callback) =>
{
    const SQLSTATMENT = `
    SELECT user_id, username, points FROM User;
    `;

pool.query(SQLSTATMENT, callback);
}

module.exports.insertSingle = (data, callback) =>
{
    const SQLSTATMENT = `
    INSERT INTO User (username, email, password, points, completed_questions)
    VALUES (?, ?, ?, 0, 0);
    `;
const VALUES = [data.username, data.email, data.hash];

pool.query(SQLSTATMENT, VALUES, callback);
}

module.exports.selectById = (data, callback) =>
{
    const SQLSTATMENT = `
    SELECT user_id, username, email, completed_questions, points FROM User
    WHERE user_id = ?;
    `;
const VALUES = [data.user_id];

pool.query(SQLSTATMENT, VALUES, callback);
}

module.exports.updateById = (data, callback) =>
{
    const SQLSTATMENT = `
    UPDATE User 
    SET username = ?
    WHERE user_id = ?;
    `;
const VALUES = [data.username, data.user_id];

pool.query(SQLSTATMENT, VALUES, callback);
}

module.exports.updateUserDataById = (data, callback) =>
{
    const SQLSTATMENT = `
    UPDATE User 
    SET points = points + 5, completed_questions = completed_questions + 1
    WHERE user_id = ?;
    `;
const VALUES = [data.user_id];

pool.query(SQLSTATMENT, VALUES, callback);
}

///////////////////////////////////////////////////////////////////////////////////

module.exports.updateUserPointById = (data, callback) =>
{
    const SQLSTATMENT = `
    UPDATE User 
    SET points = points - ?
    WHERE user_id = ?;
    `;
const VALUES = [data.deduct_amount, data.user_id];

pool.query(SQLSTATMENT, VALUES, callback);
}


///////////////////////////////////////////////////////////////////////////////////
                        //User Registration and Login
///////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////
// SELECT USER BY USERNAME OR EMAIL
//////////////////////////////////////////////////////
module.exports.selectUserByUsernameOrEmail = (data, callback) =>
{
    const SQLSTATMENT = `
    SELECT * FROM User
    WHERE username = ? OR email = ?;
    `;
const VALUES = [data.username, data.email];

pool.query(SQLSTATMENT, VALUES, callback);
}

//////////////////////////////////////////////////////
// SELECT USER BY USERNAME
//////////////////////////////////////////////////////
module.exports.selectUserByUsername = (data, callback) =>
{
    const SQLSTATMENT = `
    SELECT * FROM User
    WHERE username = ?;
    `;
const VALUES = [data.username];

pool.query(SQLSTATMENT, VALUES, callback);
}