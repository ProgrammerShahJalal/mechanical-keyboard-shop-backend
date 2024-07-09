import mongoose from 'mongoose';
import Cart from './cart.model';
import Product from '../product/product.model';
import { ICartItem } from './cart.interface';

export const addToCart = async (
  userId: string,
  productId: string,
  quantity: number
) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error('Product not found');
  }

  if (product.availableQuantity < quantity) {
    throw new Error('Not enough stock available');
  }

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    const newCart = new Cart({
      user: new mongoose.Types.ObjectId(userId),
      items: [{ product: new mongoose.Types.ObjectId(productId), quantity }],
    });

    await newCart.save();

    return newCart;
  }

  const existingItemIndex = cart.items.findIndex((item) =>
    item.product.equals(productId)
  );

  if (existingItemIndex >= 0) {
    cart.items[existingItemIndex].quantity += quantity;
    if (cart.items[existingItemIndex].quantity > product.availableQuantity) {
      throw new Error('Not enough stock available');
    }
  } else {
    cart.items.push({
      product: new mongoose.Types.ObjectId(productId),
      quantity,
    });
  }

  await cart.save();

  return cart;
};

export const getCart = async (userId: string) => {
  return await Cart.findOne({
    user: new mongoose.Types.ObjectId(userId),
  }).populate('items.product');
};

export const updateCart = async (
  userId: string,
  productId: string,
  quantity: number
) => {
  const cart = await Cart.findOne({
    user: new mongoose.Types.ObjectId(userId),
  });

  if (!cart) {
    throw new Error('Cart not found');
  }

  const itemIndex = cart.items.findIndex((item) =>
    item.product.equals(productId)
  );

  if (itemIndex === -1) {
    throw new Error('Product not found in cart');
  }

  cart.items[itemIndex].quantity = quantity;

  const product = await Product.findById(productId);

  if (!product) {
    throw new Error('Product not found');
  }

  if (product.availableQuantity < quantity) {
    throw new Error('Not enough stock available');
  }

  await cart.save();

  return cart;
};

export const removeFromCart = async (userId: string, productId: string) => {
  const cart = await Cart.findOne({
    user: new mongoose.Types.ObjectId(userId),
  });

  if (!cart) {
    throw new Error('Cart not found');
  }

  cart.items = cart.items.filter((item) => !item.product.equals(productId));

  await cart.save();

  return cart;
};
