import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const DEFAULT_BASE_URL = 'https://apiapp.acb.com.vn';
const DEFAULT_CLIENT_ID = 'iuSuHYVufIUuNIREV0FB9EoLn9kHsDbm';
const DEFAULT_API_KEY = 'CQk6S5usauGmMgMYLGqCuDtgtqIM8FI1';
const DEFAULT_APP_VERSION = '3.26.0';
const DEFAULT_USER_AGENT = 'ACB-MBA/8 CFNetwork/1335.0.3 Darwin/21.6.0';
const DEFAULT_CONVERSATION_ID = 'f43472f1-6d88-4228-91b9-4618a079342a';
const DEFAULT_TIMEOUT = 30000;

export class ACBClient {
  constructor({ username, password, debug = false }) {
    if (!username || !password) {
      throw new Error('Username and password are required');
    }

    this.username = username.trim();
    this.password = password.trim();
    this.debug = debug;
    this.deviceId = uuidv4().toUpperCase();
    this.accessToken = null;
    this.refreshToken = null;

    this.client = axios.create({
      baseURL: DEFAULT_BASE_URL,
      timeout: DEFAULT_TIMEOUT,
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'apikey': DEFAULT_API_KEY,
        'User-Agent': DEFAULT_USER_AGENT,
        'x-app-version': DEFAULT_APP_VERSION,
        'x-conversation-id': DEFAULT_CONVERSATION_ID,
      },
    });
  }

  _log(message) {
    if (this.debug) {
      console.log(`[ACB Client] ${message}`);
    }
  }

  _getRequestHeaders(includeAuth = false) {
    const headers = { 'x-request-id': uuidv4() };
    if (includeAuth && this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }
    return headers;
  }

  async login() {
    try {
      const payload = {
        username: this.username,
        password: this.password,
        deviceId: this.deviceId,
        clientId: DEFAULT_CLIENT_ID,
      };

      this._log('Attempting login...');
      const response = await this.client.post('/mb/v2/auth/tokens', payload, {
        headers: this._getRequestHeaders(),
      });

      this.accessToken = response.data.accessToken;
      this.refreshToken = response.data.refreshToken;
      this._log('Login successful');
    } catch (error) {
      this._log(`Login failed: ${error.message}`);
      throw new Error(`Authentication failed: ${error.response?.data?.error || error.message}`);
    }
  }

  async refresh() {
    if (!this.refreshToken) {
      return this.login();
    }

    try {
      this._log('Refreshing token...');
      const response = await this.client.post('/mb/v2/auth/refresh', null, {
        headers: {
          ...this._getRequestHeaders(),
          'Authorization': `Bearer ${this.refreshToken}`,
        },
      });

      this.accessToken = response.data.accessToken;
      this._log('Token refreshed successfully');
    } catch (error) {
      this._log('Token refresh failed, attempting full login');
      return this.login();
    }
  }

  async authenticate() {
    if (this.refreshToken) {
      await this.refresh();
    } else {
      await this.login();
    }
  }

  async getBalances() {
    await this.authenticate();

    try {
      this._log('Fetching balances...');
      const response = await this.client.get(
        '/mb/legacy/ss/cs/bankservice/transfers/list/account-payment',
        { headers: this._getRequestHeaders(true) }
      );

      const balances = response.data.data.map(account => ({
        accountNumber: String(account.accountNumber || ''),
        accountDescription: account.accountDescription || '',
        ownerName: account.owner || '',
        currency: account.currency || '',
        balance: parseFloat(account.balance || 0),
        totalBalance: parseFloat(account.totalBalance || 0),
        status: parseInt(account.status || 0),
      }));

      return { balances };
    } catch (error) {
      throw new Error(`Failed to fetch balances: ${error.message}`);
    }
  }

  async getTransactions(accountNumber, rows = 5) {
    await this.authenticate();

    try {
      this._log(`Fetching transactions for account ${accountNumber}...`);
      const response = await this.client.get(
        `/mb/legacy/ss/cs/bankservice/saving/tx-history?maxRows=${rows}&account=${accountNumber}`,
        { headers: this._getRequestHeaders(true) }
      );

      return response.data.data || [];
    } catch (error) {
      throw new Error(`Failed to fetch transactions: ${error.message}`);
    }
  }

  async getFirstAccountNumber() {
    const { balances } = await this.getBalances();
    return balances.length > 0 ? balances[0].accountNumber : null;
  }
}

export default ACBClient;
