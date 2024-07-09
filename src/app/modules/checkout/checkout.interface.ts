import { Types } from 'mongoose';

export interface IOrderItem {
  product: Types.ObjectId;
  quantity: number;
}

export interface IOrder {
  user: Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  paymentMethod: 'cashOnDelivery' | 'stripe';
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateOrder {
  user: Types.ObjectId;
  items: IOrderItem[];
  paymentMethod: 'cashOnDelivery' | 'stripe';
}

export interface IProcessStripePayment {
  orderId: Types.ObjectId;
  paymentToken: string;
}
