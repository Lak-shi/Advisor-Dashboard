import pool from '../config/db.js';

// Get total value of all accounts
export const getTotalManagedAssets = async () => {
    const { rows } = await pool.query(`
        SELECT SUM(h.units * h.unit_price) AS total_assets
        FROM holdings h
    `);
    return rows[0]?.total_assets || 0;
};

// Get top securities by market exposure
export const getTopSecurities = async () => {
    const { rows } = await pool.query(`
        SELECT s.ticker, SUM(h.units * h.unit_price) AS exposure
        FROM holdings h
        JOIN securities s ON h.security_id = s.id
        GROUP BY s.ticker
        ORDER BY exposure DESC
        LIMIT 5
    `);
    return rows;
};

// Get advisors ranked by assets per custodian
export const getAdvisorsByCustodian = async () => {
    const { rows } = await pool.query(`
        SELECT a.name AS advisor_name, c.name AS custodian_name, SUM(h.units * h.unit_price) AS assets
        FROM holdings h
        JOIN accounts acc ON h.account_id = acc.id
        JOIN advisors a ON acc.advisor_id = a.id
        JOIN custodians c ON acc.custodian_id = c.id
        GROUP BY a.name, c.name
        ORDER BY assets DESC
    `);
    return rows;
};
