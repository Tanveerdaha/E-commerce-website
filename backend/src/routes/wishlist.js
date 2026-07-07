import express from 'express';
import authenticate from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

router.get('/', authenticate, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ wishlist: user.wishlist || [] });
  } catch (error) {
    next(error);
  }
});

router.post('/toggle', authenticate, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const product = req.body;
    const exists = (user.wishlist || []).some((item) => item.id === product.id);
    if (exists) {
      user.wishlist = user.wishlist.filter((item) => item.id !== product.id);
    } else {
      user.wishlist.push(product);
    }

    await user.save();
    res.json({ wishlist: user.wishlist });
  } catch (error) {
    next(error);
  }
});

export default router;
