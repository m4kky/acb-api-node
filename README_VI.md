# acb-api-client

[🇺🇸 English](README.md) | **🇻🇳 Tiếng Việt**

Thư viện Node.js không chính thức cho ACB (Ngân hàng TMCP Á Châu). Lấy số dư tài khoản và lịch sử giao dịch.

## Tính năng

- 🔐 Đăng nhập ACB bằng username và password
- 💰 Lấy số dư tài khoản
- 📊 Lấy lịch sử giao dịch
- 🚀 Có sẵn ví dụ Express server
- 📦 Hỗ trợ npm, pnpm, và bun

## Cài đặt

```bash
# npm
npm install acb-api-client

# pnpm
pnpm add acb-api-client

# bun
bun add acb-api-client
```

## Bắt đầu nhanh

### Dùng như thư viện

```javascript
import { ACBClient } from 'acb-api-client';

const client = new ACBClient({
  username: 'your_username',
  password: 'your_password',
  debug: false,
});

// Lấy số dư
const { balances } = await client.getBalances();
console.log(balances);

// Lấy lịch sử giao dịch
const accountNumber = balances[0].accountNumber;
const transactions = await client.getTransactions(accountNumber, 5);
console.log(transactions);
```

### Chạy demo server

1. Clone repo này:
   ```bash
   git clone https://github.com/m4kky/acb-api-node.git
   cd acb-api-node
   ```

2. Copy `.env.example` thành `.env` và điền thông tin ACB:
   ```bash
   cp .env.example .env
   # Sửa file .env với thông tin đăng nhập của bạn
   ```

3. Cài đặt và chạy:
   ```bash
   npm install
   npm start
   ```

Server chạy tại `http://localhost:3000`

## API Endpoints

- `GET /` - Health check
- `GET /api/balances` - Lấy số dư tất cả tài khoản
- `GET /api/transactions` - Lấy giao dịch của tài khoản đầu tiên
- `GET /api/transactions/:accountNumber` - Lấy giao dịch của tài khoản cụ thể

Query parameters:
- `rows` - Số lượng giao dịch cần lấy (mặc định: 5)

## Biến môi trường

```env
ACB_USERNAME=your_username
ACB_PASSWORD=your_password
PORT=3000
DEBUG=false
```

## Ví dụ Response

### Số dư

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

### Giao dịch

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

## Hỗ trợ Package Manager

Package này hoạt động với tất cả các package manager phổ biến:

```bash
# npm
npm install acb-api-client

# pnpm
pnpm add acb-api-client

# bun
bun add acb-api-client
```

## Demo Repository

Để có server demo chạy ngay, xem tại:
- [https://github.com/m4kky/acb-api-node](https://github.com/m4kky/acb-api-node)

Chỉ cần clone, cấu hình `.env`, và chạy!

## Tác giả

**Makky** ([@m4kky](https://github.com/m4kky))

## Credits

Lấy cảm hứng từ các dự án cộng đồng về unofficial ACB integrations, bao gồm:
- [anhnmt/ACB](https://github.com/anhnmt/ACB)

## Miễn trừ trách nhiệm

Đây là client không chính thức và không liên kết với ACB. API có thể thay đổi bất cứ lúc nào. Tự chịu trách nhiệm khi sử dụng.

## License

ISC
