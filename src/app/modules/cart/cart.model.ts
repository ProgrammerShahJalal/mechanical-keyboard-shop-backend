import { Schema, model } from 'mongoose';
import { ICart } from './cart.interface';

const cartItemSchema = new Schema<ICart['items'][0]>({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

const cartSchema = new Schema<ICart>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [cartItemSchema],
});

const Cart = model<ICart>('Cart', cartSchema);

export default Cart;
