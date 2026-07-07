import express from 'express';
import { getProducts, saveProducts } from '../utils/fileStore.js';

const router = express.Router();

router.get('/', (_req, res) => {
  const products = getProducts();
  res.json({ products });
});

router.get('/:id', (req, res) => {
  const product = getProducts().find((item) => item.id === Number(req.params.id));
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json({ product });
});

router.post('/', (req, res) => {
  const products = getProducts();
  const newProduct = {
    id: Date.now(),
    ...req.body,
  };
  products.push(newProduct);
  saveProducts(products);
  res.status(201).json({ product: newProduct });
});

export default router;
