const pool = require('../services/db');

module.exports.selectEcoCadetByUserId = (data, callback) =>
{
    const SQLSTATMENT = `
    SELECT * FROM EcoCadets
    WHERE user_id = ?;
    `;
const VALUES = [data.user_id];

pool.query(SQLSTATMENT, VALUES, callback);
}

module.exports.selectEcoCadetById = (data, callback) =>
{
    const SQLSTATMENT = `
    SELECT * FROM EcoCadets
    WHERE cadet_id = ?;
    `;
const VALUES = [data.cadet_id];

pool.query(SQLSTATMENT, VALUES, callback);
}

module.exports.selectEcoCadetInfoByCadetId = (data, callback) =>
{
    const SQLSTATMENT = `
    SELECT * FROM EcoCadets 
    INNER JOIN CadetsInventory ON EcoCadets.cadet_id = CadetsInventory.cadet_id
    WHERE EcoCadets.cadet_id = ?;
    `;
const VALUES = [data.cadet_id];

pool.query(SQLSTATMENT, VALUES, callback);
}

module.exports.insertSingleEcoCadet = (data, callback) =>
{
    const SQLSTATMENT = `
    INSERT INTO EcoCadets (user_id, cadet_name, reward_point, reward_token)
    VALUES (?, ?, 0, 0);
    `;
const VALUES = [data.user_id, data.cadet_name];

pool.query(SQLSTATMENT, VALUES, callback);
}

module.exports.updateEcoCadetByCadetId = (data, callback) =>
{
    const SQLSTATMENT = `
    UPDATE EcoCadets 
    SET cadet_name = ?
    WHERE cadet_id = ?;
    `;
const VALUES = [data.cadet_name, data.cadet_id];

pool.query(SQLSTATMENT, VALUES, callback);
}

module.exports.updateAssetValueByCadetId = (data, callback) =>
{
    const SQLSTATMENT = `
    UPDATE EcoCadets 
    SET asset = ?
    WHERE cadet_id = ?;
    `;
const VALUES = [data.asset, data.cadet_id];

pool.query(SQLSTATMENT, VALUES, callback);
}

module.exports.updateCadetRewardPointById = (data, callback) =>
{
    const SQLSTATMENT = `
    UPDATE EcoCadets 
    SET reward_point = reward_point + ?
    WHERE cadet_id = ?;
    `;
const VALUES = [data.reward_point, data.cadet_id];

pool.query(SQLSTATMENT, VALUES, callback);
}