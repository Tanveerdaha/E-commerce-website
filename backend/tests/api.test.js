import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';

process.env.NODE_ENV = 'test';

const { default: app } = await import('../src/server.js');

test('GET /api/health returns service status', async () => {
  const response = await request(app).get('/api/health');
  assert.equal(response.status, 200);
  assert.equal(response.body.status, 'ok');
});

test('GET /api/products returns seeded products', async () => {
  const response = await request(app).get('/api/products');
  assert.equal(response.status, 200);
  assert.ok(Array.isArray(response.body.products));
  assert.ok(response.body.products.length > 0);
});

test('register and login flows work', async () => {
  const email = `tester-${Date.now()}@gmail.com`;
  const registerResponse = await request(app).post('/api/auth/register').send({
    name: 'Test User',
    email,
    password: 'Password123!',
  });

  assert.equal(registerResponse.status, 201);
  assert.ok(registerResponse.body.token);

  const loginResponse = await request(app).post('/api/auth/login').send({
    email,
    password: 'Password123!',
  });

  assert.equal(loginResponse.status, 200);
  assert.ok(loginResponse.body.token);
});
