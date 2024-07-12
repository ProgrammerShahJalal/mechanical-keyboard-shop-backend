import mongoose, { Schema, Document } from 'mongoose';

interface IUserDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface IOrderItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
}

interface IOrder extends Document {
  userDetails: IUserDetails;
  cartItems: IOrderItem[];
  totalAmount: number;
  paymentMethod: 'cashOnDelivery' | 'stripe';
}

const UserDetailsSchema = new Schema<IUserDetails>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
});

const OrderItemSchema = new Schema<IOrderItem>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
});

const OrderSchema = new Schema<IOrder>({
  userDetails: { type: UserDetailsSchema, required: true },
  cartItems: { type: [OrderItemSchema], required: true },
  totalAmount: { type: Number, required: true },
  paymentMethod: {
    type: String,
    enum: ['cashOnDelivery', 'stripe'],
    required: true,
  },
});

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
