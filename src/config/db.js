import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

// Create a new PostgreSQL connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Log when connected successfully
pool.on('connect', () => {
    console.log('Connected to the PostgreSQL database successfully!');
});

// Handle database errors gracefully
pool.on('error', (err) => {
    console.error('Unexpected PostgreSQL error:', err);
    process.exit(-1);  // Exit process on DB failure
});

export default pool;
