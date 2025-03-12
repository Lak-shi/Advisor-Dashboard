import express from 'express';
import { getTotalManagedAssets, getTopSecurities, getAdvisorsByCustodian } from '../services/dataAnalysis.js';

const router = express.Router();

// Get total assets
router.get('/total-assets', async (req, res) => {
    const totalAssets = await getTotalManagedAssets();
    res.json({ totalAssets });
});

// Get top securities
router.get('/top-securities', async (req, res) => {
    const securities = await getTopSecurities();
    res.json(securities);
});

// Get advisors ranked by custodian
router.get('/advisors-by-custodian', async (req, res) => {
    const rankings = await getAdvisorsByCustodian();
    res.json(rankings);
});

export default router;
