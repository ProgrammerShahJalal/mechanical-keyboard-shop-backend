import { Types } from 'mongoose';

export interface IOrderItem {
  product: Types.ObjectId;
  quantity: number;
}

export interface IOrder {
  userDetails: Types.ObjectId;
  cartItems: IOrderItem[];
  totalAmount: number;
  paymentMethod: 'cashOnDelivery' | 'stripe';
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateOrder {
  userDetails: Types.ObjectId;
  cartItems: IOrderItem[];
  paymentMethod: 'cashOnDelivery' | 'stripe';
}

export interface IProcessStripePayment {
  orderId: Types.ObjectId;
  paymentToken: string;
}
