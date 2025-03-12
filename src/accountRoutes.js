import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// Get all accounts
router.get('/', async (req, res) => {
    const { rows } = await pool.query('SELECT * FROM accounts');
    res.json(rows);
});

// Get account by ID
router.get('/:id', async (req, res) => {
    const { rows } = await pool.query('SELECT * FROM accounts WHERE id = $1', [req.params.id]);
    res.json(rows[0] || { error: "Account not found" });
});

export default router;
