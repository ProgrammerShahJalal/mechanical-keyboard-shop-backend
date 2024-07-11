import { Types } from 'mongoose';

export interface ICartItem {
  product: Types.ObjectId;
  quantity: number;
}

export interface ICart {
  user: string;
  items: ICartItem[];
  totalPrice: number;
}
