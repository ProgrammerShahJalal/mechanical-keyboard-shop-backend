import { Types } from 'mongoose';

export interface ICartItem {
  product: Types.ObjectId;
  quantity: number;
}

export interface ICart {
  userDetails: string;
  cartItems: ICartItem[];
  totalPrice: number;
}
