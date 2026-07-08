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
  {
    productId: 7,
    title: 'Orion Tablet Stand',
    description: 'Adjustable aluminum stand for tablets, e-readers, and desks.',
    category: 'Electronics',
    brand: 'Orion',
    price: 49,
    discount: 10,
    rating: 4.4,
    images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=900&q=80'],
    stock: 18,
    salesCount: 12,
  },
  {
    productId: 8,
    title: 'Mira Crossbody Bag',
    description: 'Compact everyday carry with sleek lines and smart storage.',
    category: 'Accessories',
    brand: 'Mira',
    price: 119,
    discount: 14,
    rating: 4.6,
    images: ['https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=80'],
    stock: 14,
    salesCount: 16,
  },
  {
    productId: 9,
    title: 'Aster Linen Shirt',
    description: 'Breathable tailored linen shirt for a polished casual look.',
    category: 'Fashion',
    brand: 'Aster',
    price: 89,
    discount: 9,
    rating: 4.5,
    images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80'],
    stock: 20,
    salesCount: 11,
  },
  {
    productId: 10,
    title: 'Harbor Accent Chair',
    description: 'Curved upholstered accent chair built for cozy reading corners.',
    category: 'Home',
    brand: 'Harbor',
    price: 279,
    discount: 17,
    rating: 4.7,
    images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80'],
    stock: 5,
    salesCount: 9,
  },
  {
    productId: 11,
    title: 'Pulse Yoga Mat',
    description: 'Non-slip performance mat with extra cushioning and grip.',
    category: 'Fitness',
    brand: 'Pulse',
    price: 69,
    discount: 11,
    rating: 4.8,
    images: ['https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80'],
    stock: 22,
    salesCount: 25,
  },
  {
    productId: 12,
    title: 'Echo Portable Speaker',
    description: 'Room-filling wireless audio with a compact travel-ready body.',
    category: 'Electronics',
    brand: 'Echo',
    price: 139,
    discount: 16,
    rating: 4.7,
    images: ['https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&w=900&q=80'],
    stock: 13,
    salesCount: 20,
  },
  {
    productId: 13,
    title: 'Vale Card Holder',
    description: 'Slim premium card holder with RFID protection for daily use.',
    category: 'Accessories',
    brand: 'Vale',
    price: 45,
    discount: 7,
    rating: 4.3,
    images: ['https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=80'],
    stock: 30,
    salesCount: 14,
  },
  {
    productId: 14,
    title: 'Ember Wool Coat',
    description: 'Clean silhouette wool coat designed for colder city days.',
    category: 'Fashion',
    brand: 'Ember',
    price: 219,
    discount: 13,
    rating: 4.8,
    images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80'],
    stock: 9,
    salesCount: 17,
  },
  {
    productId: 15,
    title: 'Cove Storage Basket',
    description: 'Woven storage basket that keeps essentials tidy and within reach.',
    category: 'Home',
    brand: 'Cove',
    price: 39,
    discount: 6,
    rating: 4.4,
    images: ['https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80'],
    stock: 26,
    salesCount: 13,
  },
  {
    productId: 16,
    title: 'Stride Training Backpack',
    description: 'Gym-ready backpack with ventilated compartments and laptop sleeve.',
    category: 'Fitness',
    brand: 'Stride',
    price: 99,
    discount: 15,
    rating: 4.6,
    images: ['https://images.unsplash.com/photo-1581605405669-fcdf81165afa?auto=format&fit=crop&w=900&q=80'],
    stock: 16,
    salesCount: 19,
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
  } else {
    const existingProductIds = new Set(
      (await Product.find().select('productId -_id')).map((product) => product.productId),
    );
    const missingProducts = seedProducts.filter((product) => !existingProductIds.has(product.productId));
    if (missingProducts.length) {
      await Product.insertMany(missingProducts);
    }
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
