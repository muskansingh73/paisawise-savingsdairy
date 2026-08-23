const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/auth');
const db      = require('../db');

router.get('/', auth, async (req, res) => {
  try {
    res.json(db.getTips());
  } catch (err) {
    res.status(500).json({ message: 'Failed to get tips' });
  }
});

module.exports = router;