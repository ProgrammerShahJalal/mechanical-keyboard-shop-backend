import { Router } from 'express';
import { CartController } from './cart.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router.post(
  '/add',
  auth(USER_ROLE.user, USER_ROLE.admin),
  CartController.addToCart
);
router.get('/', auth(USER_ROLE.user, USER_ROLE.admin), CartController.getCart);
router.put(
  '/update',
  auth(USER_ROLE.user, USER_ROLE.admin),
  CartController.updateCart
);
router.delete(
  '/remove',
  auth(USER_ROLE.user, USER_ROLE.admin),
  CartController.removeFromCart
);

export const cartRouters = router;
