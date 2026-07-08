import Product from '../models/Product.js';

export const getDiscountedPrice = (price, discount) => price - (price * (discount || 0)) / 100;

export const normalizeShipping = (shipping) => ({
  fullName: String(shipping.fullName).trim(),
  email: String(shipping.email).trim().toLowerCase(),
  phone: String(shipping.phone).trim(),
  address: String(shipping.address).trim(),
  city: String(shipping.city).trim(),
  postalCode: String(shipping.postalCode || '').trim(),
});

export const validateShipping = (shipping) => {
  if (!shipping?.fullName || !shipping?.email || !shipping?.phone || !shipping?.address || !shipping?.city) {
    return 'Complete shipping details are required';
  }
  return null;
};

export async function buildOrderItemsFromCart(cart) {
  let total = 0;
  const orderItems = [];

  for (const item of cart) {
    const product = await Product.findOne({ productId: item.id });
    if (!product) {
      throw Object.assign(new Error(`Product "${item.title}" is no longer available`), { status: 400 });
    }
    if (product.stock < item.quantity) {
      throw Object.assign(new Error(`Insufficient stock for "${product.title}"`), { status: 400 });
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
  }

  return {
    orderItems,
    total: Math.round(total * 100) / 100,
  };
}

export async function fulfillOrder(order, user) {
  for (const item of order.items) {
    const product = await Product.findOne({ productId: item.id });
    if (!product) {
      throw Object.assign(new Error(`Product "${item.title}" is no longer available`), { status: 400 });
    }
    if (product.stock < item.quantity) {
      throw Object.assign(new Error(`Insufficient stock for "${product.title}"`), { status: 400 });
    }

    product.stock -= item.quantity;
    product.salesCount += item.quantity;
    await product.save();
  }

  order.status = 'confirmed';
  order.paymentStatus = order.paymentMethod === 'cod' ? 'cod' : 'paid';
  await order.save();

  user.cart = [];
  await user.save();
}
