import { Types } from 'mongoose';

export interface IUserDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface IOrderItem {
  product: Types.ObjectId;
  quantity: number;
}

export interface IOrder {
  userDetails: IUserDetails; // Updated to use IUserDetails instead of ObjectId
  cartItems: IOrderItem[];
  totalAmount: number;
  paymentMethod: 'cashOnDelivery' | 'stripe';
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateOrder {
  userDetails: IUserDetails; // Updated to use IUserDetails instead of ObjectId
  cartItems: IOrderItem[];
  paymentMethod: 'cashOnDelivery' | 'stripe';
  status?: 'completed' | 'failed';
}

export interface IProcessStripePayment {
  orderId: Types.ObjectId;
  paymentToken: string;
}
