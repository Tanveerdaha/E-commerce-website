export const formatProduct = (doc) => {
  if (!doc) return null;
  const product = doc.toObject ? doc.toObject() : doc;
  return {
    id: product.productId,
    title: product.title,
    description: product.description,
    category: product.category,
    brand: product.brand,
    price: product.price,
    discount: product.discount,
    rating: product.rating,
    images: product.images,
    stock: product.stock,
    salesCount: product.salesCount ?? 0,
  };
};

export const formatCategory = (doc) => {
  if (!doc) return null;
  const category = doc.toObject ? doc.toObject() : doc;
  return {
    id: category.categoryId,
    name: category.name,
    slug: category.slug,
    description: category.description || '',
    image: category.image || '',
  };
};

export const formatUser = (doc) => ({
  id: doc._id.toString(),
  name: doc.name,
  email: doc.email,
  role: doc.role || 'user',
});

export const formatOrder = (doc) => {
  const order = doc.toObject ? doc.toObject() : doc;
  return {
    id: order._id.toString(),
    userId: order.userId,
    items: order.items,
    shipping: order.shipping || null,
    paymentMethod: order.paymentMethod || 'cod',
    total: order.total,
    status: order.status,
    createdAt: order.createdAt,
  };
};
