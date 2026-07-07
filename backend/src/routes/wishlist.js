import express from 'express';
import authenticate from '../middleware/auth.js';
import { getUsers, saveUsers } from '../utils/fileStore.js';

const router = express.Router();

router.get('/', authenticate, (req, res) => {
  const users = getUsers();
  const user = users.find((item) => item.id === req.user.id);
  res.json({ wishlist: user?.wishlist || [] });
});

router.post('/toggle', authenticate, (req, res) => {
  const users = getUsers();
  const user = users.find((item) => item.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const product = req.body;
  const exists = (user.wishlist || []).some((item) => item.id === product.id);
  if (exists) {
    user.wishlist = (user.wishlist || []).filter((item) => item.id !== product.id);
  } else {
    user.wishlist = [...(user.wishlist || []), product];
  }

  saveUsers(users);
  res.json({ wishlist: user.wishlist });
});

export default router;
