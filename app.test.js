process.env.NODE_ENV = 'test';
const request = require('supertest');
const {app} = require('./app');

let steak = {name: 'steak', price: 19.99};

describe('GET /items', () => {
    test('get all items', async () => {
      let res = await request(app).get('/items');
      expect(res.statusCode).toBe(200)
      expect(res.body).toEqual({data: [
            {name: 'eggs', price: 3.99}, 
            {name: 'milk', price: 4.49},
            {name: 'butter', price: 6.99},
            {name: 'cheese', price: 2.79}
        ]})
    });
});

describe('GET /items/:name', () => {
    test('get item by name', async () => {
      const res = await request(app).get('/items/eggs');
      expect(res.statusCode).toBe(200)
      expect(res.body).toEqual({name: 'eggs', price: 3.99})
    });
    test('responds with 404 for invalid item', async () => {
      const res = await request(app).get('/items/guacamole');
      expect(res.statusCode).toBe(404)
    });
});

describe('POST /items', () => {
    test('creating an item', async () => {
      const res = await request(app).post('/items').send(steak);
      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({ added: {name: 'steak', price: 19.99} });
    });
    test('responds with 400 if name is missing', async () => {
      const res = await request(app).post('/items').send({});
      expect(res.statusCode).toBe(422);
    });
  });

describe('/PATCH /items/:name', () => {
    test('updating an item', async () => {
      const res = await request(app).patch('/items/cheese').send({name: 'cheese', price: 3.00});
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ updated: {name: 'cheese', price: 3.00}});
    });
    test('responds with 404 for invalid data', async () => {
      const res = await request(app).patch('/items/shrimp').send({name: 'milk', price: 4.49});
      expect(res.statusCode).toBe(404);
    });
});

describe('/DELETE /items/:name', () => {
    test('deleting an item', async () => {
      const res = await request(app).delete('/items/butter');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'Deleted' })
    });
    test('responds with 404 for deleting invalid item', async () => {
      const res = await request(app).delete('/items/almonds');
      expect(res.statusCode).toBe(404);
    });
});
