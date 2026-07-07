import express from 'express';
import authenticate from '../middleware/auth.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { formatOrder } from '../utils/serialize.js';

const router = express.Router();

const getDiscountedPrice = (price, discount) => price - (price * (discount || 0)) / 100;

router.get('/', authenticate, async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ orders: orders.map(formatOrder) });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order || order.userId !== req.user.id) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ order: formatOrder(order) });
  } catch (error) {
    next(error);
  }
});

router.post('/checkout', authenticate, async (req, res, next) => {
  try {
    const { shipping, paymentMethod } = req.body;

    if (!shipping?.fullName || !shipping?.email || !shipping?.phone || !shipping?.address || !shipping?.city) {
      return res.status(400).json({ message: 'Complete shipping details are required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.cart?.length) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    let total = 0;
    const orderItems = [];

    for (const item of user.cart) {
      const product = await Product.findOne({ productId: item.id });
      if (!product) {
        return res.status(400).json({ message: `Product "${item.title}" is no longer available` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for "${product.title}"` });
      }

      const unitPrice = getDiscountedPrice(product.price, product.discount);
      total += unitPrice * item.quantity;

      orderItems.push({
        id: product.productId,
        title: product.title,
        category: product.category,
        brand: product.brand,
        price: unitPrice,
        discount: product.discount,
        quantity: item.quantity,
        images: product.images,
      });

      product.stock -= item.quantity;
      product.salesCount += item.quantity;
      await product.save();
    }

    const order = await Order.create({
      userId: user._id.toString(),
      items: orderItems,
      shipping: {
        fullName: String(shipping.fullName).trim(),
        email: String(shipping.email).trim().toLowerCase(),
        phone: String(shipping.phone).trim(),
        address: String(shipping.address).trim(),
        city: String(shipping.city).trim(),
        postalCode: String(shipping.postalCode || '').trim(),
      },
      paymentMethod: paymentMethod === 'card' ? 'card' : 'cod',
      total: Math.round(total * 100) / 100,
      status: 'confirmed',
    });

    user.cart = [];
    await user.save();

    res.status(201).json({ order: formatOrder(order) });
  } catch (error) {
    next(error);
  }
});

export default router;
