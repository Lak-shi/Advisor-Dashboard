import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// Get all securities
router.get('/', async (req, res) => {
    const { rows } = await pool.query('SELECT * FROM securities');
    res.json(rows);
});

// Get security by ticker
router.get('/:ticker', async (req, res) => {
    const { rows } = await pool.query('SELECT * FROM securities WHERE ticker = $1', [req.params.ticker]);
    res.json(rows[0] || { error: "Security not found" });
});

export default router;
