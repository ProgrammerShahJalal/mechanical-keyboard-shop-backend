import { Router } from 'express';
import { CartController } from './cart.controller';

const router = Router();

router
  .route('/')
  .get(CartController.getCart)
  .post(CartController.addToCart)
  .patch(CartController.updateCart)
  .delete(CartController.removeFromCart);

export const cartRouters = router;
