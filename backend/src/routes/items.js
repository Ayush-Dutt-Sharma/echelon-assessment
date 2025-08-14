const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();
const DATA_PATH = path.join(__dirname, '../../../data/items.json');

let cachedData = null;

// Utility to read data asynchronously
async function readData() {
  if (!cachedData) {
    const raw = await fs.readFile(DATA_PATH, 'utf8');
    cachedData = JSON.parse(raw).map(item => ({
      ...item,
      _lcName: item.name.toLowerCase()
    }));
  }
  return cachedData;
}

// watching for file changes to invalidate cache
fs.watch(DATA_PATH, () => { cachedData = null; });

// GET /api/items
router.get('/', async (req, res, next) => {
  try {
    const data = await readData();
    const { limit = 20, page = 1, q } = req.query;
    let results = data;
    const totalCount = results.length;

    if (q) {
      results = results.filter(item => item._lcName.includes(q.toLowerCase()));
    }

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;
    const start = (pageNum - 1) * limitNum;
    results = results.slice(start, start + limitNum);

    res.json({results, totalCount, page: pageNum, limit: limitNum});
  } catch (err) {
    next(err);
  }
});

// GET /api/items/:id
router.get('/:id', async (req, res, next) => {
  try {
    const data = await readData();
    const item = data.find(i => i.id === parseInt(req.params.id));
    if (!item) {
      const err = new Error('Item not found');
      err.status = 404;
      throw err;
    }
    res.json(item);
  } catch (err) {
    next(err);
  }
});

// POST /api/items
router.post('/', async (req, res, next) => {
  try {
    const { name, category, price } = req.body;

    // Basic validation and sanitization
    if (
      typeof name !== 'string' || !name.trim() ||
      typeof category !== 'string' || !category.trim() ||
      typeof price !== 'number' || isNaN(price) || price < 0
    ) {
      return res.status(400).json({ error: 'Invalid item data. Name, category, and price are required.' });
    }

    const item = {
      id: Date.now(),
      name: name.trim(),
      category: category.trim(),
      price: Math.round(price),
      _lcName: name.trim().toLowerCase()
    };

    const data = await readData();
    data.push(item);
    await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2));
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

module.exports = router;