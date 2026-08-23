const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/auth');
const db      = require('../db');

router.get('/daily', auth, async (req, res) => {
  try {
    const entries = await db.getTodayEntries(req.user.id, req.query.date);
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get daily entries' });
  }
});

router.get('/monthly', auth, async (req, res) => {
  try {
    const totals = await db.getMonthlyTotals(req.user.id);
    res.json(totals);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get monthly totals' });
  }
});

router.get('/weekly', auth, async (req, res) => {
  try {
    const weekly = await db.getWeeklySpend(req.user.id);
    res.json(weekly);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get weekly spend' });
  }
});

router.get('/trend', auth, async (req, res) => {
  try {
    const trend = await db.getMonthlyTrend(req.user.id);
    res.json(trend);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get trend' });
  }
});

router.get('/history', auth, async (req, res) => {
  try {
    res.json(db.getPastMonths());
  } catch (err) {
    res.status(500).json({ message: 'Failed to get history' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { name, category, amount, date, time } = req.body;
    if (!name || !category || !amount)
      return res.status(400).json({ message: 'name, category and amount are required.' });

    const entry = await db.addExpense(req.user.id, { name, category, amount, date, time });
    res.status(201).json(entry);
  } catch (err) {
    console.error('Add expense error:', err.message);
    res.status(500).json({ message: 'Failed to add expense' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await db.deleteExpense(req.user.id, req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Expense not found.' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete expense' });
  }
});

module.exports = router;