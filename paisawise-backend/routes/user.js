const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/auth');
const db      = require('../db');

router.get('/me', auth, async (req, res) => {
  try {
    const user = await db.getUserById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user);
  } catch (err) {
    console.error('Get user error:', err.message);
    res.status(500).json({ message: 'Failed to get user' });
  }
});

router.patch('/me', auth, async (req, res) => {
  try {
    const { name, monthly_income, savings_goal } = req.body;
    const user = await db.updateUser(req.user.id, { name, monthly_income, savings_goal });
    res.json(user);
  } catch (err) {
    console.error('Update user error:', err.message);
    res.status(500).json({ message: 'Failed to update user' });
  }
});

module.exports = router;