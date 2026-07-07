import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Order from '../models/Order.js';

const slugify = (value) => String(value)
  .trim()
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

const seedCategories = [
  {
    categoryId: 1,
    name: 'Electronics',
    slug: 'electronics',
    description: 'Gadgets and smart devices',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80',
  },
  {
    categoryId: 2,
    name: 'Accessories',
    slug: 'accessories',
    description: 'Bags, wallets, and more',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80',
  },
  {
    categoryId: 3,
    name: 'Fashion',
    slug: 'fashion',
    description: 'Clothing and apparel',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=400&q=80',
  },
  {
    categoryId: 4,
    name: 'Home',
    slug: 'home',
    description: 'Home decor and furniture',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80',
  },
  {
    categoryId: 5,
    name: 'Fitness',
    slug: 'fitness',
    description: 'Sports and fitness gear',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=400&q=80',
  },
];

const seedProducts = [
  {
    productId: 1,
    title: 'Aurora Smart Watch',
    description: 'Minimal design with premium health tracking features.',
    category: 'Electronics',
    brand: 'Aurora',
    price: 249,
    discount: 15,
    rating: 4.8,
    images: ['https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=900&q=80'],
    stock: 12,
    salesCount: 24,
  },
  {
    productId: 2,
    title: 'Luna Leather Tote',
    description: 'Soft Italian leather crafted for everyday luxury.',
    category: 'Accessories',
    brand: 'Luna',
    price: 189,
    discount: 10,
    rating: 4.7,
    images: ['https://images.unsplash.com/photo-1581605405669-fcdf81165afa?auto=format&fit=crop&w=900&q=80'],
    stock: 8,
    salesCount: 18,
  },
  {
    productId: 3,
    title: 'Nova Headphones',
    description: 'Immersive sound with active noise cancellation.',
    category: 'Electronics',
    brand: 'Nova',
    price: 299,
    discount: 20,
    rating: 4.9,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80'],
    stock: 6,
    salesCount: 31,
  },
  {
    productId: 4,
    title: 'Velora Knit Jacket',
    description: 'Structured comfort with elevated texture and fit.',
    category: 'Fashion',
    brand: 'Velora',
    price: 129,
    discount: 12,
    rating: 4.6,
    images: ['https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80'],
    stock: 10,
    salesCount: 15,
  },
  {
    productId: 5,
    title: 'Sage Ceramic Lamp',
    description: 'Warm ambient lighting for modern interiors.',
    category: 'Home',
    brand: 'Sage',
    price: 95,
    discount: 8,
    rating: 4.5,
    images: ['https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=900&q=80'],
    stock: 15,
    salesCount: 22,
  },
  {
    productId: 6,
    title: 'Solstice Running Shoes',
    description: 'Lightweight cushioning designed for all-day movement.',
    category: 'Fitness',
    brand: 'Solstice',
    price: 159,
    discount: 18,
    rating: 4.8,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80'],
    stock: 7,
    salesCount: 27,
  },
];

const getNextProductId = async () => {
  const latest = await Product.findOne().sort({ productId: -1 }).select('productId');
  return (latest?.productId || 0) + 1;
};

const getNextCategoryId = async () => {
  const latest = await Category.findOne().sort({ categoryId: -1 }).select('categoryId');
  return (latest?.categoryId || 0) + 1;
};

export const ensureSeedData = async () => {
  const categoryCount = await Category.countDocuments();
  if (categoryCount === 0) {
    await Category.insertMany(seedCategories);
  } else {
    await Promise.all(
      seedCategories.map((category) => Category.updateOne(
        { categoryId: category.categoryId, $or: [{ image: { $exists: false } }, { image: '' }] },
        { $set: { image: category.image } },
      )),
    );
  }

  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    await Product.insertMany(seedProducts);
  }

  const adminExists = await User.findOne({ role: 'admin' });
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('Admin@12345', 10);
    await User.create({
      name: 'Store Admin',
      email: 'admin@northstar.com',
      password: hashedPassword,
      role: 'admin',
    });
  }

  const orderCount = await Order.countDocuments();
  if (orderCount === 0) {
    const products = await Product.find().limit(4);
    if (products.length) {
      const sampleOrders = products.map((product, index) => {
        const qty = index + 1;
        const unitPrice = product.price - (product.price * product.discount) / 100;
        return {
          userId: 'seed-user',
          items: [{
            id: product.productId,
            title: product.title,
            category: product.category,
            brand: product.brand,
            price: unitPrice,
            discount: product.discount,
            quantity: qty,
            images: product.images,
          }],
          total: unitPrice * qty,
          status: 'confirmed',
          createdAt: new Date(Date.now() - (index + 1) * 86400000),
        };
      });
      await Order.insertMany(sampleOrders);
    }
  }
};

export { getNextProductId, getNextCategoryId, slugify };
