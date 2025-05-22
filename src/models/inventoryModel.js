const pool = require('../services/db');

module.exports.selectAllByCadetId = (data, callback) =>
{
    const SQLSTATMENT = `
    SELECT * FROM CadetsInventory
    WHERE cadet_id = ?;
    `;
const VALUES = [data.cadet_id];

pool.query(SQLSTATMENT, VALUES, callback);
}

module.exports.insertCadetsInventory = (data, callback) =>
{
    const SQLSTATMENT = `
    INSERT INTO CadetsInventory (cadet_id, owned_seed_id, seed_name, seed_type, growth_rate, growth_stage, seed_price )
    VALUES (?, ?, ?, ?, ?, ?, ?);
    `;
const VALUES = [data.cadet_id, data.seed_id, data.seed_name, data.seed_type, data.growth_rate, data.growth_stage, data.seed_price];

pool.query(SQLSTATMENT, VALUES, callback);
}

module.exports.selectInventoryById = (data, callback) =>
{
    const SQLSTATMENT = `
    SELECT inventory_id, cadet_id, owned_seed_id, grown, seed_name, seed_type, growth_rate, growth_stage, seed_price FROM CadetsInventory
    WHERE inventory_id = ?;
    `;
const VALUES = [data.inventory_id];

pool.query(SQLSTATMENT, VALUES, callback);
}

module.exports.updateInventoryById = (data, callback) =>
{
    const SQLSTATMENT = `
    UPDATE CadetsInventory 
    SET growth_stage = growth_stage + ?, grown = ?
    WHERE inventory_id = ?;
    `;
const VALUES = [data.growth_stage, data.grown, data.inventory_id];

pool.query(SQLSTATMENT, VALUES, callback);
}

module.exports.updateInventory = (data, callback) =>
{
    const SQLSTATMENT = `
    UPDATE CadetsInventory 
    SET growth_stage = growth_stage + ?, watered_on = current_timestamp()
    WHERE inventory_id = ?;
    `;
const VALUES = [data.growth_stage, data.inventory_id];

pool.query(SQLSTATMENT, VALUES, callback);
}