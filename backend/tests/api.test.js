import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { ensureSeedData } from '../src/utils/seed.js';

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'test-refresh-secret';

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
  assert.ok(registerResponse.body.accessToken);
  assert.ok(registerResponse.body.refreshToken);

  const loginResponse = await request(app).post('/api/auth/login').send({
    email,
    password: 'Password123!',
  });

  assert.equal(loginResponse.status, 200);
  assert.ok(loginResponse.body.token);
  assert.ok(loginResponse.body.accessToken);
  assert.ok(loginResponse.body.refreshToken);
});

test('refresh token issues new access token and rejects invalid refresh', async () => {
  const email = `refresh-${Date.now()}@gmail.com`;
  const registerResponse = await request(app).post('/api/auth/register').send({
    name: 'Refresh User',
    email,
    password: 'Password123!',
  });

  assert.equal(registerResponse.status, 201);

  const refreshResponse = await request(app).post('/api/auth/refresh').send({
    refreshToken: registerResponse.body.refreshToken,
  });

  assert.equal(refreshResponse.status, 200);
  assert.ok(refreshResponse.body.accessToken);
  assert.ok(refreshResponse.body.refreshToken);
  assert.ok(refreshResponse.body.token);

  const protectedResponse = await request(app)
    .get('/api/orders')
    .set('Authorization', `Bearer ${refreshResponse.body.accessToken}`);
  assert.equal(protectedResponse.status, 200);

  const refreshAsAccess = await request(app)
    .get('/api/orders')
    .set('Authorization', `Bearer ${registerResponse.body.refreshToken}`);
  assert.equal(refreshAsAccess.status, 401);

  const invalidRefresh = await request(app).post('/api/auth/refresh').send({
    refreshToken: 'not-a-valid-token',
  });
  assert.equal(invalidRefresh.status, 401);

  const missingRefresh = await request(app).post('/api/auth/refresh').send({});
  assert.equal(missingRefresh.status, 401);
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

test('checkout flow creates order with shipping', async () => {
  const email = `buyer-${Date.now()}@gmail.com`;
  const registerResponse = await request(app).post('/api/auth/register').send({
    name: 'Buyer Test',
    email,
    password: 'Password123!',
  });
  const token = registerResponse.body.token;

  await request(app)
    .post('/api/cart/add')
    .set('Authorization', `Bearer ${token}`)
    .send({
      id: 1,
      title: 'Aurora Smart Watch',
      price: 249,
      discount: 15,
      quantity: 1,
      images: ['https://example.com/watch.jpg'],
    });

  const checkoutResponse = await request(app)
    .post('/api/orders/checkout')
    .set('Authorization', `Bearer ${token}`)
    .send({
      shipping: {
        fullName: 'Buyer Test',
        email,
        phone: '03001234567',
        address: '123 Main St',
        city: 'Lahore',
        postalCode: '54000',
      },
      paymentMethod: 'cod',
    });

  assert.equal(checkoutResponse.status, 201);
  assert.ok(checkoutResponse.body.order.id);
  assert.ok(checkoutResponse.body.order.shipping);
  assert.equal(checkoutResponse.body.order.paymentMethod, 'cod');

  const ordersResponse = await request(app)
    .get('/api/orders')
    .set('Authorization', `Bearer ${token}`);

  assert.equal(ordersResponse.status, 200);
  assert.ok(ordersResponse.body.orders.length >= 1);
});

test('admin can list all orders and customers', async () => {
  const loginResponse = await request(app).post('/api/auth/admin/login').send({
    email: 'admin@northstar.com',
    password: 'Admin@12345',
  });
  const token = loginResponse.body.token;

  const ordersResponse = await request(app)
    .get('/api/admin/orders')
    .set('Authorization', `Bearer ${token}`);

  assert.equal(ordersResponse.status, 200);
  assert.ok(Array.isArray(ordersResponse.body.orders));

  const customersResponse = await request(app)
    .get('/api/admin/customers')
    .set('Authorization', `Bearer ${token}`);

  assert.equal(customersResponse.status, 200);
  assert.ok(Array.isArray(customersResponse.body.customers));
});

test('logged in user can rate a product', async () => {
  const email = `rater-${Date.now()}@gmail.com`;
  const registerResponse = await request(app).post('/api/auth/register').send({
    name: 'Rater User',
    email,
    password: 'Password123!',
  });
  const token = registerResponse.body.token;

  const rateResponse = await request(app)
    .post('/api/products/1/rate')
    .set('Authorization', `Bearer ${token}`)
    .send({ rating: 5 });

  assert.equal(rateResponse.status, 200);
  assert.equal(rateResponse.body.rating, 5);
  assert.equal(rateResponse.body.product.rating, 5);
  assert.equal(rateResponse.body.product.ratingCount, 1);

  const myRatingResponse = await request(app)
    .get('/api/products/1/my-rating')
    .set('Authorization', `Bearer ${token}`);

  assert.equal(myRatingResponse.status, 200);
  assert.equal(myRatingResponse.body.rating, 5);

  const updateResponse = await request(app)
    .post('/api/products/1/rate')
    .set('Authorization', `Bearer ${token}`)
    .send({ rating: 4 });

  assert.equal(updateResponse.status, 200);
  assert.equal(updateResponse.body.product.rating, 4);
  assert.equal(updateResponse.body.product.ratingCount, 1);
});

test('customer can submit a support message', async () => {
  const response = await request(app).post('/api/support').send({
    name: 'Support User',
    email: 'support.user@gmail.com',
    subject: 'Order question',
    message: 'I need help tracking my recent order please.',
  });

  assert.equal(response.status, 201);
  assert.match(response.body.message, /sent/i);
  assert.ok(response.body.id);
});
