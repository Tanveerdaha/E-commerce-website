import express from 'express';
import authenticate from '../middleware/auth.js';
import Product from '../models/Product.js';
import Rating from '../models/Rating.js';
import { formatProduct } from '../utils/serialize.js';

const router = express.Router();

const updateProductRating = async (productId) => {
  const ratings = await Rating.find({ productId });
  const product = await Product.findOne({ productId });

  if (!product) return null;

  if (!ratings.length) {
    product.rating = 0;
    product.ratingCount = 0;
  } else {
    const total = ratings.reduce((sum, item) => sum + item.rating, 0);
    product.rating = Math.round((total / ratings.length) * 10) / 10;
    product.ratingCount = ratings.length;
  }

  await product.save();
  return product;
};

router.get('/', async (_req, res, next) => {
  try {
    const products = await Product.find().sort({ productId: 1 });
    res.json({ products: products.map(formatProduct) });
  } catch (error) {
    next(error);
  }
});

router.get('/:id/my-rating', authenticate, async (req, res, next) => {
  try {
    const productId = Number(req.params.id);
    const rating = await Rating.findOne({ userId: req.user.id, productId });
    res.json({ rating: rating?.rating ?? null });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/rate', authenticate, async (req, res, next) => {
  try {
    const productId = Number(req.params.id);
    const value = Number(req.body.rating);

    if (!value || value < 1 || value > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const product = await Product.findOne({ productId });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await Rating.findOneAndUpdate(
      { userId: req.user.id, productId },
      { rating: value },
      { upsert: true, new: true },
    );

    const updated = await updateProductRating(productId);

    res.json({
      rating: value,
      product: formatProduct(updated),
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findOne({ productId: Number(req.params.id) });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ product: formatProduct(product) });
  } catch (error) {
    next(error);
  }
});

export default router;
