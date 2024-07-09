import { z } from 'zod';
import { Types } from 'mongoose';

// Custom validation for ObjectId
const objectIdSchema = z
  .string()
  .refine((value) => Types.ObjectId.isValid(value), {
    message: 'Invalid ObjectId',
  });

const orderItemSchema = z.object({
  product: objectIdSchema,
  quantity: z.number().min(1, 'Quantity must be at least 1'),
});

const createOrderSchema = z.object({
  user: objectIdSchema,
  items: z.array(orderItemSchema),
  paymentMethod: z.enum(['cashOnDelivery', 'stripe']),
});

const processStripePaymentSchema = z.object({
  orderId: objectIdSchema,
  paymentToken: z.string(),
});

export const CheckoutValidation = {
  createOrderSchema,
  processStripePaymentSchema,
};
