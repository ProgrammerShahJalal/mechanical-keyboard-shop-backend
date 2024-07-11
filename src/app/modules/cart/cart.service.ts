import { ICart } from './cart.interface';

import Product from '../product/product.model';
import Cart from './cart.model';
import AppError from '../../errors/AppError';

// Helper function to calculate total price
const calculateTotalPrice = async (cart: ICart) => {
  let totalPrice = 0;
  for (const item of cart.items) {
    const product = await Product.findById(item.product);
    if (product) {
      totalPrice += product.price * item.quantity;
    }
  }
  return totalPrice;
};

export const getCart = async (userInfo: {
  name: string;
  email: string;
  phone: string;
  address: string;
}): Promise<ICart | null> => {
  const cart = await Cart.findOne({ user: userInfo.name })
    .populate({
      path: 'items.product',
      model: Product,
    })
    .exec();

  if (!cart) {
    throw new AppError(404, 'Cart not found');
  }

  cart.totalPrice = await calculateTotalPrice(cart);
  await cart.save();

  return cart;
};
