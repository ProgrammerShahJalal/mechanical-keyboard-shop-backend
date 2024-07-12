import { IOrderItem } from './checkout.interface';
import Product from '../product/product.model';
import { Order } from './checkout.model';
import Stripe from 'stripe';
import config from '../../config';

const stripe = new Stripe(config.stripeSecretKey!, {
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
  userDetails: { name: string; email: string; phone: string; address: string },
  cartItems: IOrderItem[],
  paymentMethod: 'cashOnDelivery' | 'stripe'
) => {
  if (!userDetails || !cartItems || cartItems.length === 0) {
    throw new Error('Invalid order data');
  }

  const totalAmount = await calculateTotalAmount(cartItems);

  // Fetch product details
  const detailedCartItems = await Promise.all(
    cartItems.map(async (item) => {
      const product = await Product.findById(item.product);
      if (!product) {
        throw new Error('Product not found');
      }
      return {
        ...item,
        product: {
          name: product.name,
          price: product.price,
        },
      };
    })
  );

  let sessionId;
  if (paymentMethod === 'stripe') {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: detailedCartItems.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.product.name,
          },
          unit_amount: item.product.price * 100,
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${config.clientUrl}/success`,
      cancel_url: `${config.clientUrl}/cancel`,
    });

    sessionId = session.id;
  }

  const order = await Order.create({
    userDetails,
    cartItems, // Save original cart items (without detailed product info) in the order
    totalAmount,
    paymentMethod,
    sessionId,
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

const getOrdersByEmail = async (email: string) => {
  const orders = await Order.find({ 'userDetails.email': email });
  return orders;
};

const getAllOrders = async () => {
  const orders = await Order.find();
  return orders;
};

export const CheckoutService = {
  createOrder,
  getOrdersByEmail,
  getAllOrders,
};
