const express = require('express');
const router  = express.Router();
const db      = require('../db');

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, monthly_income, savings_goal } = req.body;

    console.log('Register body:', req.body); // debug line

    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email and password are required.' });

    const user = await db.createUser({
      name,
      email,
      password,
      monthly_income: Number(monthly_income) || 0,
      savings_goal:   Number(savings_goal)   || 0,
    });

    if (!user)
      return res.status(409).json({ message: 'Email already registered.' });

    const token = db.createToken(user);
    res.status(201).json({ token, user });

  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ message: 'Failed to register user' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required.' });

    const user = await db.findUserByEmail(email);

    if (!user || !db.verifyPassword(password, user.password_hash))
      return res.status(401).json({ message: 'Invalid email or password.' });

    const token = db.createToken(user);
    const { password_hash, ...safeUser } = user;

    res.json({
      token,
      user: {
        ...safeUser,
        month: new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' })
      }
    });

  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Failed to login' });
  }
});

module.exports = router;