const pool = require('../services/db');

module.exports.selectAll = (callback) =>
{
    const SQLSTATMENT = `
    SELECT * FROM Seeds;
    `;

pool.query(SQLSTATMENT, callback);
}

module.exports.selectSeedById = (data, callback) =>
{
    const SQLSTATMENT = `
    SELECT * FROM Seeds
    WHERE seed_id = ?;
    `;
const VALUES = [data.seed_id];

pool.query(SQLSTATMENT, VALUES, callback);
}