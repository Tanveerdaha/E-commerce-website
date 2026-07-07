export const getDiscountedPrice = (price, discount = 0) => {
  const amount = Number(price) || 0;
  const off = Number(discount) || 0;
  return Math.round((amount - (amount * off) / 100) * 100) / 100;
};

export const getItemLineTotal = (item) => {
  const unit = getDiscountedPrice(item.price, item.discount);
  return unit * (item.quantity || 1);
};

export const getCartTotal = (cart) => cart.reduce((sum, item) => sum + getItemLineTotal(item), 0);
