# acb-api-client

**🇺🇸 English** | [🇻🇳 Tiếng Việt](README_VI.md)

Unofficial Node.js client for ACB (Asia Commercial Bank) API. Fetch account balances and transaction history.

## Features

- 🔐 Authenticate with ACB using username and password
- 💰 Fetch account balances
- 📊 Retrieve transaction history
- 🚀 Express server example included
- 📦 Works with npm, pnpm, and bun

## Installation

```bash
# npm
npm install acb-api-client

# pnpm
pnpm add acb-api-client

# bun
bun add acb-api-client
```

## Quick Start

### As a library

```javascript
import { ACBClient } from 'acb-api-client';

const client = new ACBClient({
  username: 'your_username',
  password: 'your_password',
  debug: false,
});

// Get balances
const { balances } = await client.getBalances();
console.log(balances);

// Get transactions
const accountNumber = balances[0].accountNumber;
const transactions = await client.getTransactions(accountNumber, 5);
console.log(transactions);
```

### Run demo server

1. Clone this repo:
   ```bash
   git clone https://github.com/m4kky/acb-api-node.git
   cd acb-api-node
   ```

2. Copy `.env.example` to `.env` and fill in your ACB credentials:
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

3. Install dependencies and start:
   ```bash
   npm install
   npm start
   ```

Server runs on `http://localhost:3000`

## API Endpoints

- `GET /` - Health check
- `GET /api/balances` - Get all account balances
- `GET /api/transactions` - Get transactions for first account
- `GET /api/transactions/:accountNumber` - Get transactions for specific account

Query parameters:
- `rows` - Number of transactions to fetch (default: 5)

## Environment Variables

```env
ACB_USERNAME=your_username
ACB_PASSWORD=your_password
PORT=3000
DEBUG=false
```

## Example Response

### Balances

```json
{
  "balances": [
    {
      "accountNumber": "19527581",
      "accountDescription": "TKTT FIRST KHTN (CN) VND",
      "ownerName": "NGUYEN VAN A",
      "currency": "VND",
      "balance": 10028.0,
      "totalBalance": 10028.0,
      "status": 1
    }
  ]
}
```

### Transactions

```json
{
  "accountNumber": "19527581",
  "transactions": [
    {
      "amount": 10000.0,
      "type": "IN",
      "description": "NGUYEN VAN A chuyen tien...",
      "currency": "VND",
      "postingDate": 1774803600000
    }
  ]
}
```

## Package Manager Support

This package works with all major Node.js package managers:

```bash
# npm
npm install acb-api-client

# pnpm
pnpm add acb-api-client

# bun
bun add acb-api-client
```

## Demo Repository

For a ready-to-run demo server, check out:
- [https://github.com/m4kky/acb-api-node](https://github.com/m4kky/acb-api-node)

Just clone, configure `.env`, and run!

## Author

**Makky** ([@m4kky](https://github.com/m4kky))

## Credits

Inspired by community work on unofficial ACB integrations, including:
- [anhnmt/ACB](https://github.com/anhnmt/ACB)

## Disclaimer

This is an unofficial client and is not affiliated with ACB. APIs may change without notice. Use at your own risk.

## License

ISC
