const express = require('express');
const router = express.Router();

// GET /api/salud
router.get('/salud', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// GET /api/version
router.get('/version', (req, res) => {
  res.json({ version: '1.0.0' });
});

module.exports = router; 