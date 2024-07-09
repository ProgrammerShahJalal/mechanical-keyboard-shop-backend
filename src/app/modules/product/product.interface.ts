import { Model } from 'mongoose';

export interface IProduct {
  name: string;
  brand: string;
  price: number;
  availableQuantity: number;
  rating: number;
  image: string;
  description: string;
}

export interface ProductModel extends Model<IProduct> {}
