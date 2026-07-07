import express from 'express';
import authenticate from '../middleware/auth.js';
import { getOrders, saveOrders, getUsers, saveUsers } from '../utils/fileStore.js';

const router = express.Router();

router.get('/', authenticate, (req, res) => {
  const orders = getOrders().filter((order) => order.userId === req.user.id);
  res.json({ orders });
});

router.post('/checkout', authenticate, (req, res) => {
  const users = getUsers();
  const user = users.find((item) => item.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const orders = getOrders();
  const order = {
    id: Date.now().toString(),
    userId: req.user.id,
    items: user.cart || [],
    total: req.body.total || 0,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };

  orders.push(order);
  user.cart = [];
  saveOrders(orders);
  saveUsers(users);
  res.status(201).json({ order });
});

export default router;
