import { Router } from 'express';
import { CartController } from './cart.controller';

const router = Router();

router.get('/', CartController.getCart);

export const cartRouters = router;
