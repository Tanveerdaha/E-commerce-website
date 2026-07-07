import express from 'express';
import requireAdmin from '../middleware/admin.js';
import { uploadImage } from '../middleware/upload.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { formatProduct, formatCategory } from '../utils/serialize.js';
import { getNextProductId, getNextCategoryId, slugify } from '../utils/seed.js';

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const router = express.Router();

router.use(requireAdmin);

router.post('/upload', (req, res, next) => {
  uploadImage.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message || 'Upload failed' });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No image file provided' });
      }

      const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      res.status(201).json({ url });
    } catch (error) {
      next(error);
    }
  });
});

// --- Analytics ---

router.get('/analytics', async (_req, res, next) => {
  try {
    const [totalProducts, totalCategories, totalUsers, totalOrders, orders, products] = await Promise.all([
      Product.countDocuments(),
      Category.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Order.countDocuments(),
      Order.find().sort({ createdAt: -1 }).limit(10),
      Product.find(),
    ]);

    const revenueResult = await Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: '$total' } } },
    ]);
    const totalRevenue = revenueResult[0]?.totalRevenue || 0;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const salesByProduct = {};
    const salesByCategory = {};
    const allOrders = await Order.find();

    allOrders.forEach((order) => {
      order.items.forEach((item) => {
        const qty = item.quantity || 1;
        const revenue = (item.price || 0) * qty;

        if (!salesByProduct[item.id]) {
          salesByProduct[item.id] = { id: item.id, title: item.title, unitsSold: 0, revenue: 0 };
        }
        salesByProduct[item.id].unitsSold += qty;
        salesByProduct[item.id].revenue += revenue;

        const cat = item.category || 'Uncategorized';
        if (!salesByCategory[cat]) {
          salesByCategory[cat] = { category: cat, unitsSold: 0, revenue: 0 };
        }
        salesByCategory[cat].unitsSold += qty;
        salesByCategory[cat].revenue += revenue;
      });
    });

    const topSellingProducts = Object.values(salesByProduct)
      .sort((a, b) => b.unitsSold - a.unitsSold)
      .slice(0, 5);

    const topRatedProducts = products
      .map(formatProduct)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);

    const lowStockProducts = products
      .filter((p) => p.stock <= 5)
      .map(formatProduct)
      .sort((a, b) => a.stock - b.stock);

    const categorySales = Object.values(salesByCategory)
      .sort((a, b) => b.revenue - a.revenue);

    const recentOrders = orders.map((order) => ({
      id: order._id.toString(),
      total: order.total,
      status: order.status,
      itemCount: order.items.reduce((sum, item) => sum + (item.quantity || 1), 0),
      createdAt: order.createdAt,
    }));

    res.json({
      analytics: {
        overview: {
          totalRevenue: Math.round(totalRevenue * 100) / 100,
          totalOrders,
          totalProducts,
          totalCategories,
          totalUsers,
          averageOrderValue: Math.round(averageOrderValue * 100) / 100,
        },
        topSellingProducts,
        topRatedProducts,
        lowStockProducts,
        salesByCategory: categorySales,
        recentOrders,
      },
    });
  } catch (error) {
    next(error);
  }
});

// --- Products ---

router.get('/products', async (_req, res, next) => {
  try {
    const products = await Product.find().sort({ productId: 1 });
    res.json({ products: products.map(formatProduct) });
  } catch (error) {
    next(error);
  }
});

router.post('/products', async (req, res, next) => {
  try {
    const { title, description, category, brand, price, discount, rating, images, stock } = req.body;

    if (!title || !description || !category || !brand || price == null) {
      return res.status(400).json({ message: 'Title, description, category, brand, and price are required' });
    }

    const categoryExists = await Category.findOne({ name: category });
    if (!categoryExists) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    const productId = await getNextProductId();
    const product = await Product.create({
      productId,
      title: String(title).trim(),
      description: String(description).trim(),
      category,
      brand: String(brand).trim(),
      price: Number(price),
      discount: Number(discount) || 0,
      rating: Number(rating) || 0,
      images: Array.isArray(images) ? images : [images].filter(Boolean),
      stock: Number(stock) || 0,
      salesCount: 0,
    });

    res.status(201).json({ product: formatProduct(product) });
  } catch (error) {
    next(error);
  }
});

router.put('/products/:id', async (req, res, next) => {
  try {
    const productId = Number(req.params.id);
    const product = await Product.findOne({ productId });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const { title, description, category, brand, price, discount, rating, images, stock } = req.body;

    if (category) {
      const categoryExists = await Category.findOne({ name: category });
      if (!categoryExists) {
        return res.status(400).json({ message: 'Invalid category' });
      }
    }

    if (title != null) product.title = String(title).trim();
    if (description != null) product.description = String(description).trim();
    if (category != null) product.category = category;
    if (brand != null) product.brand = String(brand).trim();
    if (price != null) product.price = Number(price);
    if (discount != null) product.discount = Number(discount);
    if (rating != null) product.rating = Number(rating);
    if (images != null) product.images = Array.isArray(images) ? images : [images].filter(Boolean);
    if (stock != null) product.stock = Number(stock);

    await product.save();
    res.json({ product: formatProduct(product) });
  } catch (error) {
    next(error);
  }
});

router.delete('/products/:id', async (req, res, next) => {
  try {
    const productId = Number(req.params.id);
    const product = await Product.findOneAndDelete({ productId });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ product: formatProduct(product) });
  } catch (error) {
    next(error);
  }
});

// --- Categories ---

router.get('/categories', async (_req, res, next) => {
  try {
    const categories = await Category.find().sort({ categoryId: 1 });
    res.json({ categories: categories.map(formatCategory) });
  } catch (error) {
    next(error);
  }
});

router.post('/categories', async (req, res, next) => {
  try {
    const { name, description, image } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const trimmedName = name.trim();
    const existing = await Category.findOne({ name: new RegExp(`^${escapeRegex(trimmedName)}$`, 'i') });
    if (existing) {
      return res.status(409).json({ message: 'Category already exists' });
    }

    const categoryId = await getNextCategoryId();
    const category = await Category.create({
      categoryId,
      name: trimmedName,
      slug: slugify(trimmedName),
      description: description?.trim() || '',
      image: image?.trim() || '',
    });

    res.status(201).json({ category: formatCategory(category) });
  } catch (error) {
    next(error);
  }
});

router.put('/categories/:id', async (req, res, next) => {
  try {
    const categoryId = Number(req.params.id);
    const category = await Category.findOne({ categoryId });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const { name, description, image } = req.body;
    const oldName = category.name;

    if (name?.trim()) {
      const trimmedName = name.trim();
      const duplicate = await Category.findOne({
        categoryId: { $ne: categoryId },
        name: new RegExp(`^${escapeRegex(trimmedName)}$`, 'i'),
      });
      if (duplicate) {
        return res.status(409).json({ message: 'Category name already in use' });
      }

      category.name = trimmedName;
      category.slug = slugify(trimmedName);

      if (oldName !== trimmedName) {
        await Product.updateMany({ category: oldName }, { category: trimmedName });
      }
    }

    if (description != null) {
      category.description = description.trim();
    }

    if (image != null) {
      category.image = image.trim();
    }

    await category.save();
    res.json({ category: formatCategory(category) });
  } catch (error) {
    next(error);
  }
});

router.delete('/categories/:id', async (req, res, next) => {
  try {
    const categoryId = Number(req.params.id);
    const category = await Category.findOne({ categoryId });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const inUse = await Product.exists({ category: category.name });
    if (inUse) {
      return res.status(400).json({ message: 'Cannot delete category that has products assigned' });
    }

    await category.deleteOne();
    res.json({ category: formatCategory(category) });
  } catch (error) {
    next(error);
  }
});

export default router;
