import express from 'express';
import Category from '../models/Category.js';
import { formatCategory } from '../utils/serialize.js';

const router = express.Router();

router.get('/', async (_req, res, next) => {
  try {
    const categories = await Category.find().sort({ categoryId: 1 });
    res.json({ categories: categories.map(formatCategory) });
  } catch (error) {
    next(error);
  }
});

export default router;
