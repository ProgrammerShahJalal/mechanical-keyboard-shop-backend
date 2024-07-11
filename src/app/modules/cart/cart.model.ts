import { Schema, model } from 'mongoose';
import { ICart, ICartItem } from './cart.interface';

const cartItemSchema = new Schema<ICartItem>({
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
    type: String, // Let's 'user' is now represented as a string (e.g., ucustomer name, address etc.) Beacuse Authentication part don't need to do only for this project.
    required: true,
  },
  items: [cartItemSchema],
  totalPrice: { type: Number, default: 0 },
});

const Cart = model<ICart>('Cart', cartSchema);

export default Cart;
