import express from 'express';
import dotenv from 'dotenv';
import { ACBClient } from '../src/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'ACB API Server',
    endpoints: {
      balances: '/api/balances',
      transactions: '/api/transactions',
      transactionsById: '/api/transactions/:accountNumber',
    },
  });
});

// Get balances
app.get('/api/balances', async (req, res) => {
  try {
    const client = new ACBClient({
      username: process.env.ACB_USERNAME,
      password: process.env.ACB_PASSWORD,
      debug: process.env.DEBUG === 'true',
    });

    const balances = await client.getBalances();
    res.json(balances);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch balances',
      message: error.message,
    });
  }
});

// Get transactions for first account
app.get('/api/transactions', async (req, res) => {
  try {
    const rows = parseInt(req.query.rows) || 5;
    const client = new ACBClient({
      username: process.env.ACB_USERNAME,
      password: process.env.ACB_PASSWORD,
      debug: process.env.DEBUG === 'true',
    });

    const accountNumber = await client.getFirstAccountNumber();
    if (!accountNumber) {
      return res.status(404).json({ error: 'No accounts found' });
    }

    const transactions = await client.getTransactions(accountNumber, rows);
    res.json({
      accountNumber,
      transactions,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch transactions',
      message: error.message,
    });
  }
});

// Get transactions for specific account
app.get('/api/transactions/:accountNumber', async (req, res) => {
  try {
    const { accountNumber } = req.params;
    const rows = parseInt(req.query.rows) || 5;
    const client = new ACBClient({
      username: process.env.ACB_USERNAME,
      password: process.env.ACB_PASSWORD,
      debug: process.env.DEBUG === 'true',
    });

    const transactions = await client.getTransactions(accountNumber, rows);
    res.json({
      accountNumber,
      transactions,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch transactions',
      message: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`ACB API Server running on http://localhost:${PORT}`);
  console.log(`Try: http://localhost:${PORT}/api/transactions`);
});
