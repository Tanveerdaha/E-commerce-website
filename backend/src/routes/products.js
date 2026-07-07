import express from 'express';
import Product from '../models/Product.js';
import { formatProduct } from '../utils/serialize.js';

const router = express.Router();

router.get('/', async (_req, res, next) => {
  try {
    const products = await Product.find().sort({ productId: 1 });
    res.json({ products: products.map(formatProduct) });
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
