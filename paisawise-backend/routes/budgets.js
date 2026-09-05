const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/auth');
const db      = require('../db');

// GET /api/budgets — get all budgets for current month
router.get('/', auth, async (req, res) => {
  try {
    const budgets = await db.getBudgets(req.user.id);
    res.json(budgets);
  } catch (err) {
    console.error('Get budgets error:', err.message);
    res.status(500).json({ message: 'Failed to get budgets' });
  }
});

// PATCH /api/budgets — update a single category budget
router.patch('/', auth, async (req, res) => {
  try {
    const { category, amount } = req.body;
    if (!category || amount === undefined)
      return res.status(400).json({ message: 'category and amount are required.' });

    const result = await db.updateBudget(req.user.id, category, amount);
    res.json(result);
  } catch (err) {
    console.error('Update budget error:', err.message);
    res.status(500).json({ message: 'Failed to update budget' });
  }
});

// POST /api/budgets/recalculate — recalculate budgets from income
router.post('/recalculate', auth, async (req, res) => {
  try {
    const user = await db.getUserById(req.user.id);
    await db.autoCreateBudgets(req.user.id, user.monthlyIncome, user.savingsGoal);
    const budgets = await db.getBudgets(req.user.id);
    res.json(budgets);
  } catch (err) {
    console.error('Recalculate error:', err.message);
    res.status(500).json({ message: 'Failed to recalculate budgets' });
  }
});

module.exports = router;