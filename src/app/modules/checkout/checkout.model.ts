import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  userDetails: mongoose.Types.ObjectId;
  cartItems: { product: mongoose.Types.ObjectId; quantity: number }[];
  totalAmount: number;
  paymentMethod: 'cashOnDelivery' | 'stripe';
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema: Schema = new Schema(
  {
    userDetails: { type: Schema.Types.ObjectId, required: true },
    cartItems: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ['cashOnDelivery', 'stripe'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>('Order', orderSchema);
