import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import statsRoutes from './src/routes/statsRoutes.js';
import accountRoutes from './src/routes/accountRoutes.js';
import advisorRoutes from './src/routes/advisorRoutes.js';
import securityRoutes from './src/routes/securityRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Register Routes
app.use('/api/stats', statsRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/advisors', advisorRoutes);
app.use('/api/securities', securityRoutes);

// Add Health Check Route
app.get('/', (req, res) => {
    res.send('Advisor Dashboard API is running...');
});

// 404 Error Handling for Undefined Routes
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
