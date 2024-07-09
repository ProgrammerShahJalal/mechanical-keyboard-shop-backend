import mongoose from 'mongoose';
import Cart from './cart.model';
import Product from '../product/product.model';
import { ICart, ICartItem } from './cart.interface';
import { Types } from 'mongoose';
import { User } from '../user/user.model';
import AppError from '../../errors/AppError';

export const addToCart = async (
  userId: Types.ObjectId,
  productId: Types.ObjectId,
  quantity: number
): Promise<ICart | null> => {
  // Find the product
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError(404, 'Product not found');
  }

  // Check if the product has enough available quantity
  if (product.availableQuantity < quantity) {
    throw new AppError(400, 'Not enough quantity available');
  }

  // Find the user's cart
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    // If the cart doesn't exist, create a new one
    cart = new Cart({
      user: userId,
      items: [{ product: productId, quantity }],
    });
  } else {
    // If the cart exists, update the quantity or add the item
    const itemIndex = cart.items.findIndex((item) =>
      item.product.equals(productId)
    );

    if (itemIndex > -1) {
      // If the item already exists, update the quantity
      const newQuantity = cart.items[itemIndex].quantity + quantity;

      if (product.availableQuantity < newQuantity) {
        throw new AppError(400, 'Not enough quantity available');
      }

      cart.items[itemIndex].quantity = newQuantity;
    } else {
      // If the item doesn't exist, add it to the cart
      cart.items.push({ product: productId, quantity });
    }
  }

  // Save the cart
  await cart.save();

  // Update the available quantity of the product
  product.availableQuantity -= quantity;
  await product.save();

  // Populate the cart with user and product details
  const populatedCart = await Cart.findById(cart._id)
    .populate({
      path: 'items.product',
      model: Product,
    })
    .populate({
      path: 'user',
      model: User,
    })
    .exec();

  return populatedCart;
};

export const getCart = async (userId: string) => {
  return await Cart.findOne({
    user: new mongoose.Types.ObjectId(userId),
  })
    .populate('user')
    .populate('items.product');
};

export const updateCart = async (
  userId: Types.ObjectId,
  productId: Types.ObjectId,
  quantity: number
): Promise<ICart | null> => {
  // Find the user's cart
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new AppError(404, 'Cart not found');
  }

  // Find the product
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError(404, 'Product not found');
  }

  // Check if the product is in the cart
  const itemIndex = cart.items.findIndex((item) =>
    item.product.equals(productId)
  );
  if (itemIndex === -1) {
    throw new AppError(400, 'Product not in cart');
  }

  const cartItem = cart.items[itemIndex];
  const quantityChange = quantity - cartItem.quantity;

  // Check if the product has enough available quantity for the update
  if (product.availableQuantity < quantityChange) {
    throw new AppError(400, 'Not enough quantity available');
  }

  // Update the cart item quantity
  cartItem.quantity = quantity;
  await cart.save();

  // Update the available quantity of the product
  product.availableQuantity -= quantityChange;
  await product.save();

  // Populate the cart with user and product details
  const populatedCart = await Cart.findById(cart._id)
    .populate({
      path: 'items.product',
      model: Product,
    })
    .populate({
      path: 'user',
      model: User,
    })
    .exec();

  return populatedCart;
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
  await cart.save();

  // Populate the cart with user and product details
  const populatedCart = await Cart.findById(cart._id)
    .populate({
      path: 'items.product',
      model: Product,
    })
    .populate({
      path: 'user',
      model: User,
    })
    .exec();

  return populatedCart;
};
