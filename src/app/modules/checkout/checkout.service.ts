import Stripe from 'stripe';
import { IOrderItem } from './checkout.interface';
import Product from '../product/product.model';
import { Order } from './checkout.model';
import config from '../../config';
import { Types } from 'mongoose';

const stripe = new Stripe(config.stripeSecretKey as string, {
  apiVersion: '2024-06-20',
});

const calculateTotalAmount = async (items: IOrderItem[]) => {
  let total = 0;
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (product) {
      total += product.price * item.quantity;
    }
  }
  return total;
};

const createOrder = async (
  userDetails: Types.ObjectId,
  cartItems: IOrderItem[],
  paymentMethod: 'cashOnDelivery' | 'stripe'
) => {
  // Validate userDetails and cartItems
  if (!userDetails || !cartItems || cartItems.length === 0) {
    throw new Error('Invalid order data');
  }

  const totalAmount = await calculateTotalAmount(cartItems);

  const order = await Order.create({
    userDetails,
    cartItems,
    totalAmount,
    paymentMethod,
  });

  for (const item of cartItems) {
    const product = await Product.findById(item.product);
    if (product) {
      product.availableQuantity -= item.quantity;
      await product.save();
    }
  }

  return order;
};

const processStripePayment = async (orderId: string, paymentToken: string) => {
  const order = await Order.findById(orderId);
  if (!order) {
    return { success: false, message: 'Order not found', data: null };
  }

  try {
    const charge = await stripe.charges.create({
      amount: order.totalAmount * 100, // Amount in cents
      currency: 'usd',
      source: paymentToken,
      description: `Order ${order._id}`,
    });

    order.status = 'completed';
    await order.save();

    return { success: true, message: 'Payment successful', data: charge };
  } catch (error) {
    order.status = 'failed';
    await order.save();
    return { success: false, message: 'Payment failed', data: error };
  }
};

export const CheckoutService = {
  createOrder,
  processStripePayment,
};
