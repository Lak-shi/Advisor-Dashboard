-- Drop tables if they exist
DROP TABLE IF EXISTS holdings CASCADE;
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS securities CASCADE;
DROP TABLE IF EXISTS advisors CASCADE;
DROP TABLE IF EXISTS custodians CASCADE;
DROP TABLE IF EXISTS advisor_custodians CASCADE;

-- 1. Create `advisors` table
CREATE TABLE advisors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- 2. Create `custodians` table
CREATE TABLE custodians (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- 3. Create `advisor_custodians` table (Many-to-Many relationship)
CREATE TABLE advisor_custodians (
    advisor_id INT REFERENCES advisors(id) ON DELETE CASCADE,
    custodian_id INT REFERENCES custodians(id) ON DELETE CASCADE,
    rep_id VARCHAR(50) NOT NULL,
    PRIMARY KEY (advisor_id, custodian_id)
);

-- 4. Create `accounts` table
CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    number VARCHAR(50) NOT NULL UNIQUE,
    rep_id VARCHAR(50) NOT NULL,
    advisor_id INT REFERENCES advisors(id) ON DELETE CASCADE,
    custodian_id INT REFERENCES custodians(id) ON DELETE CASCADE
);

-- 5. Create `securities` table
CREATE TABLE securities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticker VARCHAR(10) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    date_added TIMESTAMP DEFAULT NOW()
);

-- 6. Create `holdings` table (Links accounts and securities)
CREATE TABLE holdings (
    id SERIAL PRIMARY KEY,
    account_id INT REFERENCES accounts(id) ON DELETE CASCADE,
    security_id UUID REFERENCES securities(id) ON DELETE CASCADE,
    units DECIMAL(15, 2) NOT NULL CHECK (units >= 0),
    unit_price DECIMAL(15, 2) NOT NULL CHECK (unit_price >= 0)
);

-- 7. Indexes for faster queries
CREATE INDEX idx_advisors_name ON advisors(name);
CREATE INDEX idx_custodians_name ON custodians(name);
CREATE INDEX idx_accounts_number ON accounts(number);
CREATE INDEX idx_holdings_account_id ON holdings(account_id);
CREATE INDEX idx_holdings_security_id ON holdings(security_id);

-- 8. Insert Sample Data
INSERT INTO advisors (name) VALUES ('Randall'), ('John Doe');
INSERT INTO custodians (name) VALUES ('Schwab'), ('Fidelity');

INSERT INTO advisor_custodians (advisor_id, custodian_id, rep_id) VALUES
(1, 1, '1271'),
(1, 2, '8996');

INSERT INTO accounts (name, number, rep_id, advisor_id, custodian_id) VALUES
('Bradley Green - 401k', '21889645', '9883', 1, 1);

INSERT INTO securities (ticker, name, date_added) VALUES
('HEMCX', 'Healthcare Mutual Fund', '2024-03-11 12:00:00'),
('ICKAX', 'Delaware Ivy Crossover Credit Fund Class A', '2001-06-07 11:12:56.205Z');

INSERT INTO holdings (account_id, security_id, units, unit_price)
VALUES
(1, (SELECT id FROM securities WHERE ticker = 'HEMCX'), 77, 398.63);
