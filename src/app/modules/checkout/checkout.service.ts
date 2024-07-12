import { IOrderItem } from './checkout.interface';
import Product from '../product/product.model';
import { Order } from './checkout.model';

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
