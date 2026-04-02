# 🏦 Banking Ledger System

A secure, production-grade **ledger-based transaction system** built with Node.js. Implements real-world financial system concepts including idempotent transfers, MongoDB ACID transactions, JWT authentication, and double-entry bookkeeping via a ledger model.

---

## ✨ Features

- 🔐 **JWT Authentication** — secure register, login, logout with token blacklisting
- 💸 **Idempotent Money Transfers** — prevents duplicate transactions on retries
- 🧾 **Ledger-Based Accounting** — double-entry bookkeeping for every transaction
- ⚛️ **MongoDB ACID Transactions** — atomic operations ensure consistent money movement
- 📧 **Email Notifications** — nodemailer integration for transaction alerts
- 🍪 **Cookie-based Auth** — secure HTTP-only cookies for token storage
- 🔒 **Password Hashing** — bcrypt for secure credential storage

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js v5 |
| Database | MongoDB + Mongoose |
| Auth | JSON Web Tokens (JWT) |
| Security | bcrypt, cookie-parser |
| Email | Nodemailer |
| Dev Tool | Nodemon |

---

## 📁 Project Structure

```
banking-system/
├── server.js                          # Entry point
├── src/
│   ├── app.js                         # Express app setup
│   ├── config/
│   │   └── db.js                      # MongoDB connection
│   ├── controllers/
│   │   ├── auth.controller.js         # Register, login, logout
│   │   ├── account.controller.js      # Account management
│   │   └── transaction.controller.js  # Transfer, fund
│   ├── middleware/
│   │   └── auth.middleware.js         # JWT verification
│   ├── models/
│   │   ├── user.model.js              # User schema
│   │   ├── account.model.js           # Account schema
│   │   ├── transaction.model.js       # Transaction schema
│   │   ├── ledger.model.js            # Ledger entry schema
│   │   └── blacklist.model.js         # Token blacklist schema
│   ├── routes/
│   │   ├── auth.routes.js             # Auth routes
│   │   ├── account.routes.js          # Account routes
│   │   └── transaction.routes.js      # Transaction routes
│   └── services/
│       └── email.js                   # Email service
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | ❌ | Register a new user |
| POST | `/api/auth/login` | ❌ | Login and receive JWT |
| POST | `/api/auth/logout` | ✅ | Logout and blacklist token |

### Account
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/account/` | ✅ | Create a new bank account |
| GET | `/api/account/` | ✅ | Get all accounts for user |
| GET | `/api/account/balance/:accountId` | ✅ | Get balance of an account |

### Transactions
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/transaction/transfer` | ✅ | Transfer money between accounts |
| POST | `/api/transaction/fund` | ✅ | Add initial funds to an account |

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/Raj9134/banking-system.git
cd banking-system

# 2. Install dependencies
npm install

# 3. Create .env file
cp .env.example .env
# Fill in your values (see Environment Variables below)

# 4. Start the server
node server.js

# Or with hot reload
npx nodemon server.js
```

---

## 🔑 Environment Variables

Create a `.env` file in the root directory:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_ID=your_google_oauth_client_id
CLIENT_SECRET=your_google_oauth_client_secret
REFRESH_TOKEN=your_gmail_refresh_token
EMAIL_USER=your_email@gmail.com
```

---

## 🔐 Key Technical Concepts

### Idempotent Transfers
Each transfer request uses a unique idempotency key to ensure that retrying a failed request never results in duplicate transactions — critical for financial systems.

### MongoDB ACID Transactions
Money transfers use MongoDB sessions and transactions to guarantee atomicity — either both the debit and credit succeed, or neither does. No partial transfers.

### Ledger Model (Double-Entry Bookkeeping)
Every transaction creates two ledger entries — a debit on the sender's side and a credit on the receiver's side — maintaining a complete, auditable financial history.

### Token Blacklisting
On logout, the JWT is stored in a blacklist collection in MongoDB, preventing reuse of old tokens even before they expire.

---

## 👨‍💻 Author

**Raj Mishra**
- GitHub: [@Raj9134](https://github.com/Raj9134)
