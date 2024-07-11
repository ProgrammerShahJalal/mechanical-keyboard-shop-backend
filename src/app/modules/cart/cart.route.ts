import { Router } from 'express';
import { CartController } from './cart.controller';

const router = Router();

router.post('/add', CartController.addToCart);
router.get('/', CartController.getCart);
router.put('/update', CartController.updateCart);
router.delete('/remove', CartController.removeFromCart);

export const cartRouters = router;
