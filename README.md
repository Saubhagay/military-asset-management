# Military Asset Management System

A full-stack web application to manage military assets like vehicles, weapons, and ammunition across multiple bases. Built with **React**, **Node.js**, **Express**, and **MongoDB**.

---

## Features
- **Dashboard**: View all asset balances across bases, with filtering by base and a pop-up for asset details.
- **Purchases**: Record new asset purchases which automatically update asset balances.
- **Transfers**: Move assets between bases with quantity validation.
- **Assignments / Expenditures**: Assign or expend assets to units or personnel.
- **Role-Based Access Control (RBAC)**:
  - **Admin**: Full access to all bases and all features.
  - **Base Commander**: Can view and manage assets only for their assigned base.
  - **Logistics Officer**: Can purchase and manage assets only for their assigned base.

---

## Project Structure

```
military-asset-management/    ← React frontend
├── src/
│   ├── components/
│   │   ├── Login.js
│   │   ├── Navbar.js
│   │   ├── Dashboard.js
│   │   ├── Purchases.js
│   │   ├── Transfers.js
│   │   └── Assignments.js
│   ├── App.js
│   └── index.css
└── public/

backend/                      ← Node.js backend
├── models/
│   ├── user.js
│   ├── asset.js
│   ├── purchase.js
│   ├── transfer.js
│   └── assignment.js
├── routes/
│   ├── auth.js
│   ├── assets.js
│   ├── purchases.js
│   ├── transfers.js
│   └── assignments.js
├── middleware/
│   └── auth.js
├── index.js
├── seed.js
└── .env
```

---

## Tech Stack
| Layer     | Technology                       |
|-----------|----------------------------------|
| Frontend  | React, Axios, React Router DOM   |
| Backend   | Node.js, Express.js              |
| Database  | MongoDB (via Mongoose)           |
| Auth      | JWT (JSON Web Tokens)            |

---

## Setup Instructions

### Prerequisites
- Node.js installed
- A free MongoDB Atlas account ([mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas))

### Step 1: Configure MongoDB
1. Create a free cluster on MongoDB Atlas.
2. Get your connection string (it looks like `mongodb+srv://...`).
3. Open `backend/.env` and replace `<username>` and `<password>` with your credentials.

### Step 2: Start the Backend
```bash
cd backend
npm install
node seed.js     # Creates default test users (run once)
npm start        # Starts server on http://localhost:5000
```

### Step 3: Start the Frontend
```bash
# In the root project folder:
npm install
npm start        # Opens app at http://localhost:3000
```

---

## Login Credentials (after running seed.js)

| Role              | Username          | Password      |
|-------------------|-------------------|---------------|
| Admin             | `admin`           | `admin123`    |
| Base Commander    | `commander_alpha` | `commander123`|
| Logistics Officer | `logistics_bravo` | `logistics123`|

---

## API Endpoints

| Method | Route                     | Description              | Access            |
|--------|---------------------------|--------------------------|-------------------|
| POST   | /api/auth/register        | Register a new user      | Public            |
| POST   | /api/auth/login           | Login                    | Public            |
| GET    | /api/assets               | Get all assets           | All roles         |
| GET    | /api/assets/:base         | Get assets for one base  | Admin             |
| POST   | /api/purchases            | Record a purchase        | Admin, Logistics  |
| GET    | /api/purchases            | Get all purchases        | All roles         |
| POST   | /api/transfers            | Transfer assets          | All roles         |
| GET    | /api/transfers            | Get all transfers        | All roles         |
| POST   | /api/assignments          | Assign/expend assets     | All roles         |
| GET    | /api/assignments          | Get all assignments      | All roles         |
