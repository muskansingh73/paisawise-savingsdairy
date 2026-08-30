const { Pool }  = require('pg');
const bcrypt    = require('bcryptjs');
const jwt       = require('jsonwebtoken');

// No dotenv here — server.js loads it first
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false,
});

pool.connect((err, client, release) => {
  if (err) console.error('❌ DB connection failed:', err.message);
  else { console.log('✅ Connected to PostgreSQL'); release(); }
});

// ── Default data ───────────────────────────────────────────────────────────────

const defaultBudgets = {
  food: 6000, travel: 4000, rent: 10000,
  shopping: 3000, health: 2000, entertainment: 1500, savings: 9000,
};

const defaultTips = [
  { type: 'warning', title: 'Food spending is high',  body: "You've spent a lot on food this month. Try meal prepping 3 days a week." },
  { type: 'success', title: 'Great savings habit!',   body: 'You are already building a strong savings routine.' },
  { type: 'info',    title: 'Switch to monthly pass', body: 'A monthly pass could save you money on travel.' },
  { type: 'neutral', title: '50 / 30 / 20 rule',      body: 'Keep your savings goal in focus every month.' },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

function sanitizeUser(user) {
  if (!user) return null;
  const { password_hash, ...rest } = user;
  return rest;
}

function currentMonthLabel() {
  return new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' });
}

function attachMonth(user) {
  if (!user) return null;
  return { ...sanitizeUser(user), month: currentMonthLabel() };
}

// ── Auth ───────────────────────────────────────────────────────────────────────

async function createUser({ name, email, password, monthly_income, savings_goal }) {
  console.log('createUser called with income:', monthly_income, 'goal:', savings_goal); // debug

  const existing = await pool.query(
    'SELECT id FROM users WHERE LOWER(email) = LOWER($1)', [email]
  );
  if (existing.rowCount > 0) return null;

  const hash = bcrypt.hashSync(password, 10);

  const incomeVal = Number(monthly_income) || 0;
  const goalVal   = Number(savings_goal)   || 0;

  console.log('Inserting with income:', incomeVal, 'goal:', goalVal); // debug

  const result = await pool.query(
    `INSERT INTO users (name, email, password_hash, monthly_income, savings_goal)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, email,
               monthly_income::float AS "monthlyIncome",
               savings_goal::float   AS "savingsGoal"`,
    [name, email, hash, incomeVal, goalVal]
  );

  const user      = attachMonth(result.rows[0]);
  const today     = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  // Seed sample expenses
  

  return user;
}

async function findUserByEmail(email) {
  const result = await pool.query(
    `SELECT id, name, email, password_hash,
            monthly_income::float AS "monthlyIncome",
            savings_goal::float   AS "savingsGoal"
     FROM users WHERE LOWER(email) = LOWER($1)`,
    [email]
  );
  return result.rows[0] || null;
}

async function getUserById(id) {
  const result = await pool.query(
    `SELECT id, name, email,
            monthly_income::float AS "monthlyIncome",
            savings_goal::float   AS "savingsGoal"
     FROM users WHERE id = $1`,
    [id]
  );
  return attachMonth(result.rows[0] || null);
}

async function updateUser(id, { name, monthly_income, savings_goal }) {
  const result = await pool.query(
    `UPDATE users SET
       name           = COALESCE($1, name),
       monthly_income = COALESCE($2, monthly_income),
       savings_goal   = COALESCE($3, savings_goal)
     WHERE id = $4
     RETURNING id, name, email,
               monthly_income::float AS "monthlyIncome",
               savings_goal::float   AS "savingsGoal"`,
    [name, monthly_income, savings_goal, id]
  );
  return attachMonth(result.rows[0] || null);
}

function verifyPassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}

function createToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
}

// ── Expenses ───────────────────────────────────────────────────────────────────

async function addExpense(userId, expense) {
  const time      = expense.time || new Date().toTimeString().slice(0, 5);
  const date      = expense.date || new Date().toISOString().slice(0, 10);
  const timestamp = `${date} ${time}`;

  const result = await pool.query(
    `WITH inserted AS (
       INSERT INTO expenses (user_id, category_id, name, amount, logged_at)
       VALUES ($1, (SELECT id FROM categories WHERE slug = $2), $3, $4, $5)
       RETURNING id, user_id, category_id, name, amount, logged_at
     )
     SELECT i.id,
            i.user_id AS "userId",
            i.name,
            c.slug    AS category,
            i.amount::float AS amount,
            to_char(i.logged_at, 'HH24:MI') AS time,
            i.logged_at::date               AS date
     FROM inserted i
     JOIN categories c ON c.id = i.category_id`,
    [Number(userId), expense.category, expense.name, Number(expense.amount), timestamp]
  );

  return result.rows[0];
}

async function deleteExpense(userId, entryId) {
  const result = await pool.query(
    'DELETE FROM expenses WHERE id = $1 AND user_id = $2',
    [Number(entryId), Number(userId)]
  );
  return result.rowCount > 0;
}

async function getTodayEntries(userId, selectedDate) {
  const date = selectedDate || new Date().toISOString().slice(0, 10);
  const result = await pool.query(
    `SELECT e.id,
            e.user_id AS "userId",
            e.name,
            c.slug    AS category,
            e.amount::float AS amount,
            to_char(e.logged_at, 'HH24:MI') AS time,
            e.logged_at::date               AS date
     FROM expenses e
     JOIN categories c ON c.id = e.category_id
     WHERE e.user_id = $1
       AND e.logged_at::date = $2::date
     ORDER BY e.logged_at`,
    [Number(userId), date]
  );
  return result.rows;
}

async function getMonthlyTotals(userId) {
  const result = await pool.query(
    `SELECT c.slug AS category, COALESCE(SUM(e.amount), 0) AS total
     FROM expenses e
     JOIN categories c ON c.id = e.category_id
     WHERE e.user_id = $1
       AND e.logged_at >= date_trunc('month', CURRENT_DATE)
       AND e.logged_at <  date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'
     GROUP BY c.slug`,
    [Number(userId)]
  );

  const totals = {
    food: 0, travel: 0, rent: 0,
    shopping: 0, health: 0, entertainment: 0, savings: 0,
  };

  result.rows.forEach(row => {
    if (totals[row.category] !== undefined)
      totals[row.category] = Number(row.total);
  });

  return totals;
}

async function getWeeklySpend(userId) {
  const result = await pool.query(
    `SELECT to_char(e.logged_at, 'Dy') AS day,
            COALESCE(SUM(e.amount), 0) AS amount
     FROM expenses e
     WHERE e.user_id = $1
       AND e.logged_at >= date_trunc('week', CURRENT_DATE)
       AND e.logged_at <  date_trunc('week', CURRENT_DATE) + INTERVAL '7 days'
     GROUP BY day
     ORDER BY MIN(e.logged_at)`,
    [Number(userId)]
  );

  const days  = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const rowMap = result.rows.reduce((map, row) => {
    map[row.day] = Number(row.amount);
    return map;
  }, {});

  return days.map(day => ({ day, amount: rowMap[day] || 0 }));
}

async function getMonthlyTrend(userId) {
  const result = await pool.query(
    `SELECT
       CEIL(EXTRACT(DAY FROM logged_at) / 7.0) AS week_num,
       SUM(amount) AS spent
     FROM expenses
     WHERE user_id = $1
       AND logged_at >= date_trunc('month', CURRENT_DATE)
       AND logged_at <  date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'
     GROUP BY week_num
     ORDER BY week_num`,
    [Number(userId)]
  );

  const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  const rowMap = result.rows.reduce((map, row) => {
    map[Math.min(row.week_num, 4)] = Number(row.spent);
    return map;
  }, {});

  return weeks.map((week, i) => ({
    week,
    spent: rowMap[i + 1] || 0,
    saved: 0,
  }));
}

function getPastMonths() {
  return [
    { month: 'March 2026', totalSpent: 32000, saved: 6000 },
    { month: 'April 2026', totalSpent: 28500, saved: 7500 },
    { month: 'May 2026',   totalSpent: 35200, saved: 4800 },
    { month: 'June 2026',  totalSpent: 24150, saved: 5000 },
  ];
}

function getBudgets()  { return defaultBudgets; }
function getTips()     { return defaultTips; }

module.exports = {
  createUser,
  findUserByEmail,
  getUserById,
  updateUser,
  verifyPassword,
  createToken,
  addExpense,
  deleteExpense,
  getTodayEntries,
  getMonthlyTotals,
  getWeeklySpend,
  getMonthlyTrend,
  getPastMonths,
  getBudgets,
  getTips,
};