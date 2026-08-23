require('dotenv').config(); // MUST be line 1

const express = require('express');
const cors    = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'PaisaWise backend is running' });
});

app.use('/api/auth',     require('./routes/auth'));
app.use('/api/user',     require('./routes/user'));
app.use('/api/expenses', require('./routes/expenses'));
app.use('/api/budgets',  require('./routes/budgets'));
app.use('/api/tips',     require('./routes/tips'));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong' });
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;