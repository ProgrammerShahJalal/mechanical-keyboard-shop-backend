import { ICart } from './cart.interface';
import { Types } from 'mongoose';
import { User } from '../user/user.model';
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

export const addToCart = async (
  userId: Types.ObjectId,
  productId: Types.ObjectId,
  quantity: number
): Promise<ICart | null> => {
  const cart =
    (await Cart.findOne({ user: userId })) ||
    new Cart({ user: userId, items: [] });

  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError(404, 'Product not found');
  }

  // Check available quantity
  if (product.availableQuantity < quantity) {
    throw new AppError(400, 'Insufficient product quantity');
  }

  const existingItemIndex = cart.items.findIndex((item) =>
    item.product.equals(productId)
  );

  if (existingItemIndex !== -1) {
    // Update available quantity
    product.availableQuantity -=
      quantity - cart.items[existingItemIndex].quantity;
    cart.items[existingItemIndex].quantity = quantity;
  } else {
    // Update available quantity
    product.availableQuantity -= quantity;
    cart.items.push({ product: productId, quantity });
  }

  await product.save();
  cart.totalPrice = await calculateTotalPrice(cart);
  await cart.save();

  return await Cart.findById(cart._id)
    .populate({
      path: 'items.product',
      model: Product,
    })
    .populate({
      path: 'user',
      model: User,
    })
    .exec();
};

export const updateCart = async (
  userId: Types.ObjectId,
  productId: Types.ObjectId,
  quantity: number
): Promise<ICart | null> => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new AppError(404, 'Cart not found');
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError(404, 'Product not found');
  }

  const existingItemIndex = cart.items.findIndex((item) =>
    item.product.equals(productId)
  );
  if (existingItemIndex === -1) {
    throw new AppError(400, 'Product not found in cart');
  }

  // Check available quantity
  const additionalQuantity = quantity - cart.items[existingItemIndex].quantity;
  if (product.availableQuantity < additionalQuantity) {
    throw new AppError(400, 'Insufficient product quantity');
  }

  // Update available quantity
  product.availableQuantity -= additionalQuantity;
  await product.save();

  cart.items[existingItemIndex].quantity = quantity;
  cart.totalPrice = await calculateTotalPrice(cart);
  await cart.save();

  return await Cart.findById(cart._id)
    .populate({
      path: 'items.product',
      model: Product,
    })
    .populate({
      path: 'user',
      model: User,
    })
    .exec();
};

export const removeFromCart = async (
  userId: Types.ObjectId,
  productId: Types.ObjectId
): Promise<ICart | null> => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new AppError(404, 'Cart not found');
  }

  const itemIndex = cart.items.findIndex((item) =>
    item.product.equals(productId)
  );
  if (itemIndex === -1) {
    throw new AppError(400, 'Product not found in cart');
  }

  const cartItem = cart.items[itemIndex];

  // Find the product to update its available quantity
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError(404, 'Product not found');
  }

  // Update the available quantity of the product
  product.availableQuantity += cartItem.quantity;
  await product.save();

  // Remove the item from the cart
  cart.items.splice(itemIndex, 1);

  cart.totalPrice = await calculateTotalPrice(cart);
  await cart.save();

  // Populate the cart with user and product details
  return await Cart.findById(cart._id)
    .populate({
      path: 'items.product',
      model: Product,
    })
    .populate({
      path: 'user',
      model: User,
    })
    .exec();
};

export const getCart = async (
  userId: Types.ObjectId
): Promise<ICart | null> => {
  const cart = await Cart.findOne({ user: userId })
    .populate({
      path: 'items.product',
      model: Product,
    })
    .populate({
      path: 'user',
      model: User,
    })
    .exec();

  if (!cart) {
    throw new AppError(404, 'Cart not found');
  }

  cart.totalPrice = await calculateTotalPrice(cart);
  await cart.save();

  return cart;
};
