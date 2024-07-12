import mongoose, { Document, Schema } from 'mongoose';

interface IOrderItem {
  product: mongoose.Schema.Types.ObjectId;
  quantity: number;
}

interface IOrder extends Document {
  userDetails: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  cartItems: IOrderItem[];
  totalAmount: number;
  paymentMethod: 'cashOnDelivery' | 'stripe';
  stripeCheckoutSessionId?: string; // for stripe payment
}

const OrderSchema: Schema = new Schema({
  userDetails: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
  },
  cartItems: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  paymentIntentId: { type: String },
});

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
