export const getPaymentMethodLabel = (paymentMethod) => {
  if (paymentMethod === 'card' || paymentMethod === 'stripe') {
    return 'Credit / debit card (Stripe)';
  }
  return 'Cash on delivery';
};

export const getPaymentStatusLabel = (paymentStatus) => {
  if (paymentStatus === 'paid') return 'Paid';
  if (paymentStatus === 'pending') return 'Awaiting payment';
  if (paymentStatus === 'failed') return 'Payment failed';
  if (paymentStatus === 'cancelled') return 'Payment cancelled';
  if (paymentStatus === 'cod') return 'Pay on delivery';
  return paymentStatus || 'Unknown';
};

export const getOrderStatusCopy = (order) => {
  if (order?.paymentMethod === 'cod') {
    return {
      title: 'Order placed successfully!',
      message: 'Your order has been confirmed. Please pay when your order is delivered.',
      totalLabel: 'Order total',
    };
  }

  return {
    title: 'Payment successful!',
    message: 'Your Stripe payment was completed and your order has been confirmed.',
    totalLabel: 'Total paid',
  };
};
