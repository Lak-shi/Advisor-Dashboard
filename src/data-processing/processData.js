import pool from '../config/db.js';

// Sample Data
const sampleData = {
    advisors: [
        {
            name: "Randall",
            custodians: [
                { name: "Schwab", repId: "1271" },
                { name: "Fidelity", repId: "8996" }
            ]
        }
    ],
    accounts: [
        {
            name: "Bradley Green - 401k",
            number: "21889645",
            repId: "9883",
            custodian: "Schwab",
            holdings: [{ ticker: "HEMCX", units: 77, unitPrice: 398.63 }]
        }
    ],
    securities: [
        {
            ticker: "ICKAX",
            name: "Delaware Ivy Crossover Credit Fund Class A",
            dateAdded: "2001-06-07T11:12:56.205Z"
        }
    ]
};

// Insert advisors & custodians
const insertAdvisors = async (client) => {
    for (const advisor of sampleData.advisors) {
        const { rows: advisorRows } = await client.query(
            'INSERT INTO advisors (name) VALUES ($1) ON CONFLICT (name) DO NOTHING RETURNING id',
            [advisor.name]
        );
        const advisorId = advisorRows[0]?.id;

        for (const custodian of advisor.custodians) {
            const { rows: custodianRows } = await client.query(
                'INSERT INTO custodians (name) VALUES ($1) ON CONFLICT (name) DO NOTHING RETURNING id',
                [custodian.name]
            );
            const custodianId = custodianRows[0]?.id;

            if (advisorId && custodianId) {
                await client.query(
                    'INSERT INTO advisor_custodians (advisor_id, custodian_id, rep_id) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
                    [advisorId, custodianId, custodian.repId]
                );
            }
        }
    }
};

// Insert accounts & holdings
const insertAccounts = async (client) => {
    for (const account of sampleData.accounts) {
        const { rows: custodianRows } = await client.query(
            'SELECT id FROM custodians WHERE name = $1',
            [account.custodian]
        );
        if (!custodianRows.length) throw new Error(`Custodian ${account.custodian} not found`);

        const custodianId = custodianRows[0].id;
        const { rows: accountRows } = await client.query(
            'INSERT INTO accounts (name, number, rep_id, custodian_id) VALUES ($1, $2, $3, $4) ON CONFLICT (number) DO NOTHING RETURNING id',
            [account.name, account.number, account.repId, custodianId]
        );
        const accountId = accountRows[0]?.id;

        for (const holding of account.holdings) {
            const { rows: securityRows } = await client.query(
                'INSERT INTO securities (ticker, name) VALUES ($1, $2) ON CONFLICT (ticker) DO UPDATE SET name = EXCLUDED.name RETURNING id',
                [holding.ticker, "Some Security Name"]
            );
            const securityId = securityRows[0]?.id;

            if (accountId && securityId) {
                await client.query(
                    'INSERT INTO holdings (account_id, security_id, units, unit_price) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
                    [accountId, securityId, holding.units, holding.unitPrice]
                );
            }
        }
    }
};

// Insert securities
const insertSecurities = async (client) => {
    for (const security of sampleData.securities) {
        await client.query(
            'INSERT INTO securities (ticker, name, date_added) VALUES ($1, $2, $3) ON CONFLICT (ticker) DO NOTHING',
            [security.ticker, security.name, security.dateAdded]
        );
    }
};

// Run all insert functions inside a transaction
const processData = async () => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        await insertAdvisors(client);
        await insertAccounts(client);
        await insertSecurities(client);

        await client.query('COMMIT');
        console.log("Sample data inserted successfully!");
    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Data processing failed:", error);
    } finally {
        client.release();
    }
};

// Execute the function
processData();
