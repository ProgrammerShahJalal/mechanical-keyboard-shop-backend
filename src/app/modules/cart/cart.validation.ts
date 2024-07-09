import { z } from 'zod';
import { Types } from 'mongoose';

// Custom validation for ObjectId
const objectIdSchema = z
  .string()
  .refine((value) => Types.ObjectId.isValid(value), {
    message: 'Invalid ObjectId',
  });

// Define the schema for an individual cart item
const cartItemSchema = z.object({
  product: objectIdSchema,
  quantity: z.number().min(1, 'Quantity must be at least 1'),
});

// Define the schema for the cart
const cartSchema = z.object({
  user: objectIdSchema,
  items: z.array(cartItemSchema),
});

// Define the schema for adding an item to the cart
const addToCartSchema = z.object({
  productId: objectIdSchema,
  quantity: z.number().min(1, 'Quantity must be at least 1'),
});

// Define the schema for updating an item in the cart
const updateCartSchema = z.object({
  productId: objectIdSchema,
  quantity: z.number().min(1, 'Quantity must be at least 1'),
});

// Define the schema for removing an item from the cart
const removeFromCartSchema = z.object({
  productId: objectIdSchema,
});

export const CartValidation = {
  cartItemSchema,
  cartSchema,
  addToCartSchema,
  updateCartSchema,
  removeFromCartSchema,
};
