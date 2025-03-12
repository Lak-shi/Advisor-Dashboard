# Overview Advisor-Dashboard
Advisor Dashboard Backend is a Node.js and PostgreSQL system with RESTful APIs to track advisors, accounts, custodians, and securities. It computes total assets, top securities, and advisor rankings per custodian.

## Features
- Parses and processes advisor, account, and security data.
- Computes total managed assets across all accounts.
- Identifies top securities by exposure.
- Ranks advisors based on assets under each custodian.
- Provides RESTful APIs for accessing processed financial data.

## Project Structure
```
advisor-dashboard/
│── node_modules/                       # Installed dependencies
│── src/
│   ├── config/                     # Configuration files
│   │   ├── db.js                   # PostgreSQL database connection
│   ├── data-processing/            # Data processing scripts
│   │   ├── processData.js          # Inserts sample data into PostgreSQL
│   ├── db/                         # Database schema & migrations
│   │   ├── schema.sql              # SQL schema for PostgreSQL tables
│   ├── routes/                     # Express.js API routes
│   │   ├── accountRoutes.js        # API routes for accounts
│   │   ├── advisorRoutes.js        # API routes for advisors
│   │   ├── securityRoutes.js       # API routes for securities
│   │   ├── statsRoutes.js          # API routes for analytics (total assets, rankings)
│   ├── services/                   # Business logic services
│   │   ├── dataAnalysis.js         # Computes analytics (total assets, rankings)
│── .env                                # Environment variables (DB config)
│── package.json                        # Dependencies & scripts
│── server.js                       # Main Express.js API server
```

## Setup Instructions
### Prerequisites
- **Node.js**
- **PostgreSQL** (run on Docker for convenience or locally)
- **Docker** (optional, for containerized deployment)

### Installation
1. Clone the repository:

2. Install dependencies:
   npm install
   
4. Setup environment variables:
   Create a `.env` file in the root directory with:
   ```sh
   PORT=5001
   DATABASE_URL=postgres://postgres:mysecretpassword@localhost:5431/advisor_dashboard
   ```

### Database Setup
1. Start PostgreSQL (if using Docker):
   '''
   docker run --name some-postgres -p 5431:5432 -e POSTGRES_PASSWORD=mysecretpassword -d postgres
   '''
   OR
   - Start the PostgreSQL service from pgAdmin

3. Initialize the database:
   psql -U postgres -d advisor_dashboard -f src/db/schema.sql

4. Run the data processing script:
   node src/data-processing/processData.js


### Running the Server
npm run dev

Server should start on **http://localhost:5001**

### API Endpoints
### 1. Get Total Managed Assets
```
http://localhost:5001/api/stats/total-assets
Response for sample data: { "totalAssets": "30694.51" }
```

### 2. Get Top Securities by Market Exposure
```
http://localhost:5001/api/stats/top-securities
Response for sample data: [{ "ticker": "HEMCX", "exposure": "30694.51" }]
```

### 3. Get Advisors Ranked by Custodian
```
http://localhost:5001/api/stats/advisors-by-custodian
Response for sample data: [{ "advisor_name": "Randall", "custodian_name": "Schwab", "assets": "30694.51" }]
```

## Assumptions
- The data provided in `processData.js` is a sample representation.
- Each advisor can have multiple custodians.
- Accounts are linked to custodians and advisors.

## TODOs & Optimizations
- Add unit tests for API and data processing scripts.
- Optimize queries for large datasets.
- Implement caching for frequently accessed queries.
- Deploy on cloud with CI/CD pipeline.
- Enhance security measures (e.g., API authentication & authorization)
- Improve error handling and logging.

## Implementation Summary
The Advisor Dashboard backend is designed to store, process, and analyze financial data efficiently. It is structured to keep things organized, scalable, and easy to maintain.

- PostgreSQL stores financial data securely, using indexed tables for fast queries.
- Express.js provides API routes to fetch advisor, account, and securities data.
- Database Transactions ensure that no partial or broken data gets inserted.
- SQL Queries are optimized to calculate total assets, top securities, and advisor rankings.

