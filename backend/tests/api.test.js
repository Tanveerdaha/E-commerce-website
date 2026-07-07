import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { ensureSeedData } from '../src/utils/seed.js';

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

const mongoServer = await MongoMemoryServer.create();
process.env.MONGODB_URI = mongoServer.getUri();

await connectDB();
await ensureSeedData();

const { default: app } = await import('../src/server.js');

test.after(async () => {
  await disconnectDB();
  await mongoServer.stop();
});

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

test('admin login and product CRUD', async () => {
  const loginResponse = await request(app).post('/api/auth/admin/login').send({
    email: 'admin@northstar.com',
    password: 'Admin@12345',
  });

  assert.equal(loginResponse.status, 200);
  assert.equal(loginResponse.body.user.role, 'admin');
  const token = loginResponse.body.token;

  const createResponse = await request(app)
    .post('/api/admin/products')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: 'Test Product',
      description: 'A test product',
      category: 'Electronics',
      brand: 'TestBrand',
      price: 99,
      discount: 5,
      rating: 4.5,
      stock: 10,
      images: ['https://example.com/image.jpg'],
    });

  assert.equal(createResponse.status, 201);
  const productId = createResponse.body.product.id;

  const updateResponse = await request(app)
    .put(`/api/admin/products/${productId}`)
    .set('Authorization', `Bearer ${token}`)
    .send({ price: 89 });

  assert.equal(updateResponse.status, 200);
  assert.equal(updateResponse.body.product.price, 89);

  const deleteResponse = await request(app)
    .delete(`/api/admin/products/${productId}`)
    .set('Authorization', `Bearer ${token}`);

  assert.equal(deleteResponse.status, 200);
});

test('non-admin cannot access admin routes', async () => {
  const email = `user-${Date.now()}@gmail.com`;
  const registerResponse = await request(app).post('/api/auth/register').send({
    name: 'Regular User',
    email,
    password: 'Password123!',
  });

  const response = await request(app)
    .get('/api/admin/products')
    .set('Authorization', `Bearer ${registerResponse.body.token}`);

  assert.equal(response.status, 403);
});

test('admin analytics endpoint returns overview', async () => {
  const loginResponse = await request(app).post('/api/auth/admin/login').send({
    email: 'admin@northstar.com',
    password: 'Admin@12345',
  });

  const response = await request(app)
    .get('/api/admin/analytics')
    .set('Authorization', `Bearer ${loginResponse.body.token}`);

  assert.equal(response.status, 200);
  assert.ok(response.body.analytics.overview);
  assert.ok(Array.isArray(response.body.analytics.topRatedProducts));
});
