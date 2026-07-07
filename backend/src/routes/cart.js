import express from 'express';
import authenticate from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

router.get('/', authenticate, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ cart: user.cart || [] });
  } catch (error) {
    next(error);
  }
});

router.post('/add', authenticate, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const item = req.body;
    const existing = user.cart?.find((entry) => entry.id === item.id);
    if (existing) {
      existing.quantity += item.quantity || 1;
    } else {
      user.cart.push({ ...item, quantity: item.quantity || 1 });
    }

    await user.save();
    res.json({ cart: user.cart });
  } catch (error) {
    next(error);
  }
});

router.put('/update', authenticate, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { id, quantity } = req.body;
    user.cart = user.cart
      .map((item) => (item.id === id ? { ...item, quantity } : item))
      .filter((item) => item.quantity > 0);

    await user.save();
    res.json({ cart: user.cart });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const productId = Number(req.params.id);
    user.cart = user.cart.filter((item) => item.id !== productId);
    await user.save();
    res.json({ cart: user.cart });
  } catch (error) {
    next(error);
  }
});

export default router;
