import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// Get all advisors
router.get('/', async (req, res) => {
    const { rows } = await pool.query('SELECT * FROM advisors');
    res.json(rows);
});

// Get advisor by ID
router.get('/:id', async (req, res) => {
    const { rows } = await pool.query('SELECT * FROM advisors WHERE id = $1', [req.params.id]);
    res.json(rows[0] || { error: "Advisor not found" });
});

export default router;
