const pool = require('../services/db');

module.exports.selectAll = (callback) =>
{
    const SQLSTATMENT = `
    SELECT id, review_amt, review_text, Reviews.user_id, created_at, User.user_id, username FROM Reviews 
    INNER JOIN User ON Reviews.user_id = User.user_id;
    `;

    pool.query(SQLSTATMENT, callback);
}

module.exports.selectById = (data, callback) =>
{
    const SQLSTATMENT = `
    SELECT * FROM Reviews
    WHERE id = ?;
    `;
    const VALUES = [data.id];

    pool.query(SQLSTATMENT, VALUES, callback);
}

module.exports.insertSingle = (data, callback) =>
{
    const SQLSTATMENT = `
    INSERT INTO Reviews (review_amt, review_text, user_id)
    VALUES (?, ?, ?);
    `;
    const VALUES = [data.review_amt, data.review_text, data.user_id];

    pool.query(SQLSTATMENT, VALUES, callback);
}

module.exports.updateById = (data, callback) =>
{
    const SQLSTATMENT = `
    UPDATE Reviews 
    SET review_amt = ?, review_text = ?, user_id = ?
    WHERE id = ?;
    `;
    const VALUES = [data.review_amt, data.review_text, data.user_id, data.id];

    pool.query(SQLSTATMENT, VALUES, callback);
}

module.exports.deleteById = (data, callback) =>
{
    const SQLSTATMENT = `
    DELETE FROM Reviews 
    WHERE id = ?;
    `;
    const VALUES = [data.id];

    pool.query(SQLSTATMENT, VALUES, callback);
}
