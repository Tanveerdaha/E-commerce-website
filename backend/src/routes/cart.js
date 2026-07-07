import express from 'express';
import authenticate from '../middleware/auth.js';
import { getUsers, saveUsers } from '../utils/fileStore.js';

const router = express.Router();

router.get('/', authenticate, (req, res) => {
  const users = getUsers();
  const user = users.find((item) => item.id === req.user.id);
  res.json({ cart: user?.cart || [] });
});

router.post('/add', authenticate, (req, res) => {
  const users = getUsers();
  const user = users.find((item) => item.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const item = req.body;
  const existing = user.cart?.find((entry) => entry.id === item.id);
  if (existing) {
    existing.quantity += item.quantity || 1;
  } else {
    user.cart = [...(user.cart || []), { ...item, quantity: item.quantity || 1 }];
  }

  saveUsers(users);
  res.json({ cart: user.cart });
});

router.put('/update', authenticate, (req, res) => {
  const users = getUsers();
  const user = users.find((item) => item.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const { id, quantity } = req.body;
  user.cart = (user.cart || []).map((item) => (item.id === id ? { ...item, quantity } : item)).filter((item) => item.quantity > 0);

  saveUsers(users);
  res.json({ cart: user.cart });
});

router.delete('/:id', authenticate, (req, res) => {
  const users = getUsers();
  const user = users.find((item) => item.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.cart = (user.cart || []).filter((item) => item.id !== Number(req.params.id));
  saveUsers(users);
  res.json({ cart: user.cart });
});

export default router;
