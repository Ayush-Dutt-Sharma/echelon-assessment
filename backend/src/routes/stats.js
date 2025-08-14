const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const { mean } = require('../utils/stats');
const router = express.Router();
const DATA_PATH = path.join(__dirname, '../../../data/items.json');

let cachedStats = null;
let lastModified = 0;

// Cache for stats
async function calculateStats() {
  const stats = {};
  const raw = await fs.readFile(DATA_PATH, 'utf8');
  const items = JSON.parse(raw);
  stats.count = items.length;
  stats.meanPrice = mean(items.map(i => i.price));
  return stats;
}

// Watch file for changes and update cache
fs.watch(DATA_PATH, async () => {
  cachedStats = await calculateStats();
  lastModified = Date.now();
});

// GET /api/stats
router.get('/', async (req, res, next) => {
  try {
    if (!cachedStats) {
      cachedStats = await calculateStats();
      lastModified = Date.now();
    }
    res.json({ ...cachedStats, lastModified });
  } catch (err) {
    next(err);
  }
});

module.exports = router;