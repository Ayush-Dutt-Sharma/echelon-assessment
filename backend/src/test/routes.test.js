const request = require('supertest');
const express = require('express');
const itemsRouter = require('../routes/items');

const app = express();
app.use(express.json());
app.use('/api/items', itemsRouter);

describe('Items API', () => {
  it('GET /api/items returns items', async () => {
    const res = await request(app).get('/api/items');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/items?q=search returns filtered items', async () => {
    const res = await request(app).get('/api/items?q=test');
    expect(res.statusCode).toBe(200);
    expect(res.body.every(item => item.name.toLowerCase().includes('test'))).toBe(true);
  });

  it('GET /api/items/:id returns item', async () => {
    const res = await request(app).get('/api/items/1');
    expect(200).toBe(res.statusCode);
  });

  it('POST /api/items creates item', async () => {
    const newItem = {id:6, name: 'Test', price: 123, category: 'Demo' };
    const res = await request(app).post('/api/items').send(newItem);
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Test');
  });

 it('GET /api/items/:id return 404', async () => {
    const res = await request(app).get('/api/items/101');
    expect(404).toBe(res.statusCode);
  });

});