# 🚀 PAISAWISE FULL-STACK SETUP GUIDE

## TABLE OF CONTENTS
1. Backend Setup
2. Database Setup
3. Frontend Integration
4. Testing & Deployment
5. Troubleshooting

---

## PART 1: BACKEND SETUP (Node.js + Express)

### Step 1.1: Create Backend Directory
```bash
# Navigate to your project folder
cd "C:\Users\muskan singh\OneDrive\Desktop\MoneySaving"

# Create backend folder
mkdir paisawise-backend
cd paisawise-backend
```

### Step 1.2: Initialize Node Project
```bash
npm init -y
```

### Step 1.3: Install Dependencies
```bash
npm install express cors dotenv pg bcryptjs jsonwebtoken
npm install --save-dev nodemon
```

### Step 1.4: Create All Backend Files

#### File Structure:
```
paisawise-backend/
├── .env
├── .gitignore
├── package.json
├── server.js
├── db.js
├── middleware/
│   └── auth.js
├── routes/
│   ├── auth.js
│   ├── expenses.js
│   ├── user.js
│   ├── budgets.js
│   └── tips.js
└── controllers/
    ├── authController.js
    ├── expenseController.js
    ├── userController.js
    ├── budgetController.js
    └── tipsController.js
```

**Create each file with the code provided in the backend code section above** (copy paste each file's content)

---

## PART 2: DATABASE SETUP (PostgreSQL)

### Step 2.1: Install PostgreSQL
Download from: https://www.postgresql.org/download/windows/

### Step 2.2: Create Database & Tables

Open **pgAdmin** (comes with PostgreSQL) or use **psql** CLI:

```bash
psql -U postgres
```

Then run these SQL commands:

```sql
-- Create database
CREATE DATABASE paisawise_db;

-- Connect to database
\c paisawise_db

-- Create tables
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  monthly_income DECIMAL(10, 2) DEFAULT 45000,
  savings_goal DECIMAL(10, 2) DEFAULT 9000,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE expenses (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  time TIME,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE budgets (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL,
  limit_amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, category)
);

CREATE INDEX idx_expenses_user_id ON expenses(user_id);
CREATE INDEX idx_expenses_date ON expenses(date);
CREATE INDEX idx_budgets_user_id ON budgets(user_id);
```

### Step 2.3: Create `.env` File

Create a file named `.env` in your `paisawise-backend` folder:

```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/paisawise_db
JWT_SECRET=your_super_secret_key_change_in_production_123456
PORT=5000
NODE_ENV=development
```

**IMPORTANT:** Replace `YOUR_PASSWORD` with your PostgreSQL password!

---

## PART 3: RUN BACKEND

```bash
# Navigate to backend folder
cd paisawise-backend

# Start development server
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:5000
```

Test it:
```
http://localhost:5000/api/health
```

---

## PART 4: FRONTEND INTEGRATION

### Step 4.1: Create `.env.local` in Frontend

In your `paisawise` folder, create `.env.local`:

```
VITE_API_URL=http://localhost:5000/api
```

### Step 4.2: Update Frontend Files

**Files already updated in `paisawise` folder:**
- ✅ `src/services/api.js` - Now uses real backend
- ✅ `src/App.jsx` - Added authentication
- ✅ `src/pages/Login.jsx` - New login page
- ✅ `src/components/Sidebar.jsx` - Added logout

### Step 4.3: Start Frontend

```bash
cd paisawise
npm run dev
```

Visit: `http://localhost:5173`

---

## PART 5: TEST THE APPLICATION

### Test Registration:
1. Click **"Sign up"** on login page
2. Enter:
   - Name: `Muskan Singh`
   - Email: `muskan@paisawise.com`
   - Password: `Password123`
3. Click **"Create Account"**

### Test Login:
1. Use the credentials from registration
2. You should see the Dashboard

### Test Expense:
1. Go to **Daily Log** page
2. Add an expense (food, ₹100)
3. Check Dashboard - should show updated amounts

### Test Tips:
1. Go to **Saving Tips** page
2. Tips should be generated from your spending data

---

## PART 6: DATABASE RESET (If Needed)

To reset everything:

```sql
DROP DATABASE paisawise_db;
CREATE DATABASE paisawise_db;
\c paisawise_db

-- Then run all the CREATE TABLE commands again
```

---

## TROUBLESHOOTING

### Error: "Cannot connect to database"
- Check PostgreSQL is running
- Verify DATABASE_URL in `.env` is correct
- Check username/password

### Error: "CORS error"
- Make sure backend is running on port 5000
- Check VITE_API_URL in frontend `.env.local`

### Error: "Invalid token"
- Clear localStorage: Open DevTools → Application → localStorage → delete `pw_token`
- Log in again

### Error: "Port 5000 already in use"
```bash
# Windows - kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

---

## NEXT STEPS (Optional Enhancements)

1. **Add validation** in backend routes
2. **Add error handling** for edge cases
3. **Add pagination** for expense lists
4. **Add filters** by date range
5. **Add export to CSV** for expenses
6. **Deploy** to Vercel (frontend) + Render (backend)

---

## QUICK COMMANDS

```bash
# Backend
cd paisawise-backend
npm install
npm run dev          # Start dev server

# Frontend
cd paisawise
npm install
npm run dev          # Start dev server
npm run build        # Build for production
```

---

## API ENDPOINTS REFERENCE

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/auth/register` | ❌ | Create account |
| POST | `/api/auth/login` | ❌ | Login user |
| GET | `/api/user` | ✅ | Get user profile |
| POST | `/api/expenses` | ✅ | Add expense |
| GET | `/api/expenses/today` | ✅ | Get today's expenses |
| GET | `/api/expenses/monthly` | ✅ | Get month's expenses by category |
| GET | `/api/expenses/weekly` | ✅ | Get weekly spend |
| GET | `/api/expenses/trend` | ✅ | Get monthly trend |
| GET | `/api/expenses/history` | ✅ | Get past months data |
| DELETE | `/api/expenses/:id` | ✅ | Delete expense |
| GET | `/api/budgets` | ✅ | Get category budgets |
| PUT | `/api/budgets/:category` | ✅ | Update budget |
| GET | `/api/tips` | ✅ | Get saving tips |

---

**Happy Coding! 🎉**
